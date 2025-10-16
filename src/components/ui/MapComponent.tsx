import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
// ===============================================
// FUNCIÓN AUXILIAR: PROYECCIÓN 3D A 2D
// ===============================================
const getScreenCoordinates = (
  position: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  container: HTMLDivElement
) => {
  const vector = position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
  const y = (vector.y * -0.5 + 0.5) * container.clientHeight;
  return { x, y, visible: vector.z < 1 };
};
// ===============================================
// TIPOS
// ===============================================
interface Discovery {
  id: number;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  geological_period?: string;
  fossil_type: string;
}
interface MapComponentProps {
  discoveries?: Discovery[];
}
// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================
const MapComponent = ({ discoveries }: MapComponentProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pinsRef = useRef<Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }>>([]);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const lastHoveredRef = useRef<Discovery | null>(null);
  const MAX_ZOOM = 6;
  const MIN_ZOOM = 1.5;
  const INITIAL_ZOOM = 4.0;
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
  const mockDiscoveries: Discovery[] = discoveries || [
    { id: 1, title: "Joaquinraptor casali", location: "La Pampa, Argentina", latitude: -36.6167, longitude: -64.2833, image_url: "/assets/joaquinraptor.jpg", geological_period: "Cretácico Superior", fossil_type: "bones_teeth" },
    { id: 2, title: "Qunkasaura pintiquiniestra", location: "Magallanes, Chile", latitude: -51.7167, longitude: -72.5000, image_url: "/assets/qunkasaura.jpg", geological_period: "Cretácico", fossil_type: "bones_teeth" },
    { id: 3, title: "Tyrannotitan", location: "Chubut, Argentina", latitude: -43.3000, longitude: -65.1000, image_url: "/assets/tyrannotitan.jpg", geological_period: "Cretácico Inferior", fossil_type: "bones_teeth" },
  ];
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prevZoom => {
      let newZoom = prevZoom;
      if (direction === 'in') {
        newZoom = Math.max(MIN_ZOOM, prevZoom - 0.5);
      } else {
        newZoom = Math.min(MAX_ZOOM, prevZoom + 0.5);
      }
      if (cameraRef.current) {
        cameraRef.current.position.z = newZoom;
        cameraRef.current.updateProjectionMatrix();
      }
      return newZoom;
    });
  };
  // ===============================================
  // EFECTO PRINCIPAL DE THREE.JS
  // ===============================================
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) {
        setError('El contenedor no tiene dimensiones válidas');
        return;
      }

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, zoomLevel);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      const textureLoader = new THREE.TextureLoader();
      const earthTexture = textureLoader.load('/public/earth_map.jpg');

      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
      earthTexture.magFilter = THREE.LinearFilter;

      const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture,
        color: 0x7A634E,
        roughness: 0.9,
        metalness: 0.1,
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      globeRef.current = globe;
      scene.add(globe);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xff8844, 0.5);
      pointLight.position.set(-5, -3, 5);
      scene.add(pointLight);

      const pins: Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }> = [];
      mockDiscoveries.forEach(discovery => {
        const phi = (90 - discovery.latitude) * (Math.PI / 180);
        const theta = (discovery.longitude + 180) * (Math.PI / 180);
        const radius = 1.04;
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        const pinGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const pinMaterial = new THREE.MeshStandardMaterial({
          color: 0xff3333,
          emissive: 0xff0000,
          emissiveIntensity: 0.5,
        });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.set(x, y, z);
        pin.userData = { discovery };
        scene.add(pin);

        const haloGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xff3333,
          transparent: true,
          opacity: 0.3
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.position.copy(pin.position);
        scene.add(halo);

        pins.push({ mesh: pin, discovery, halo });
      });
      pinsRef.current = pins;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let isDragging = false;
      let previousMouse = { x: 0, y: 0 };

      const handleMouseMove = (event: MouseEvent) => {
        if (!container) return;

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (isDragging) {
          const deltaX = event.clientX - previousMouse.x;
          const deltaY = event.clientY - previousMouse.y;

          if (globeRef.current) {
            globeRef.current.rotation.y += deltaX * 0.005;
            globeRef.current.rotation.x += deltaY * 0.005;
          }
          previousMouse = { x: event.clientX, y: event.clientY };
        } else {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(pinsRef.current.map(p => p.mesh));

          const newHoveredDiscovery = intersects.length > 0 && intersects[0].object.userData.discovery
            ? intersects[0].object.userData.discovery
            : null;

          if (newHoveredDiscovery?.id !== lastHoveredRef.current?.id) {
            setHoveredDiscovery(newHoveredDiscovery);
            lastHoveredRef.current = newHoveredDiscovery;
          }
          container.style.cursor = newHoveredDiscovery ? 'pointer' : 'grab';
        }
      };

      const handleMouseDown = (event: MouseEvent) => {
        isDragging = true;
        previousMouse = { x: event.clientX, y: event.clientY };
        container.style.cursor = 'grabbing';
      };

      const handleMouseUp = () => {
        isDragging = false;
        container.style.cursor = 'grab';
      };

      const handleClick = (event: MouseEvent) => {
        if (!container) return;

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinsRef.current.map(p => p.mesh));

        if (intersects.length > 0 && intersects[0].object.userData.discovery) {
          const disc = intersects[0].object.userData.discovery as Discovery;
          navigate(`/posts/${disc.id}`);
        }
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('click', handleClick);

      let animationId: number;
      let time = 0;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.02;

        if (!isDragging && globeRef.current) {
          const autoRotateSpeed = 0.001;
          globeRef.current.rotation.y += autoRotateSpeed;
        }

        pinsRef.current.forEach(({ halo }) => {
          const scale = 1 + Math.sin(time * 3) * 0.1;
          halo.scale.set(scale, scale, scale);
          const mat = halo.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.3 + Math.sin(time * 3) * 0.15;
        });

        renderer.render(scene, camera);
      };

      animate();
      setIsLoading(false);

      return () => {
        cancelAnimationFrame(animationId);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('click', handleClick);
        if (renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };

    } catch (err) {
      console.error('Error initializing Three.js:', err);
      setError('Error al cargar el mapa 3D');
      setIsLoading(false);
    }
  }, [discoveries, zoomLevel, navigate]);
  useEffect(() => {
    if (!hoveredDiscovery || !cameraRef.current || !rendererRef.current || !containerRef.current) {
      setPopupPosition(null);
      return;
    }
    const currentPin = pinsRef.current.find(p => p.discovery.id === hoveredDiscovery.id);

    if (currentPin) {
      const screenCoords = getScreenCoordinates(
        currentPin.mesh.position.clone(),
        cameraRef.current,
        rendererRef.current,
        containerRef.current
      );

      if (screenCoords.visible) {
        setPopupPosition(screenCoords);
      } else {
        setPopupPosition(null);
      }
    }
  }, [hoveredDiscovery, zoomLevel]);
  // ===============================================
  // RENDERIZADO JSX CON ESTILOS GLOBALES
  // ===============================================
  if (error) {
    return (
      <div className="p-4 text-center rounded-lg" style={{
        backgroundColor: 'var(--color-danger)',
        color: 'var(--text-inverse)',
        fontFamily: "'Playfair Display', serif"
      }}>
        Error: {error}
      </div>
    );
  }
  return (
    <div className="flex justify-center w-full my-8">
      <div
        className="relative overflow-hidden w-full max-w-4xl"
        style={{ height: '700px', minHeight: '700px', backgroundColor: 'transparent' }}
      >
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
                style={{ borderColor: 'var(--color-amber)' }}
              ></div>
              <p
                className="text-lg"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Cargando globo 3D...
              </p>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ cursor: 'grab' }}
        />

        {/* BOTONES DE ZOOM CON ESTILOS GLOBALES */}
        <div className="absolute top-4 right-20 z-20 flex flex-col gap-2">
          <button
            onClick={() => handleZoom('in')}
            className="btn w-10 h-10 rounded-full text-xl flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
              fontFamily: "'Cinzel', serif",
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease'
            }}
            disabled={zoomLevel <= MIN_ZOOM}
          >
            +
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="btn w-10 h-10 rounded-full text-xl flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
              fontFamily: "'Cinzel', serif",
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease'
            }}
            disabled={zoomLevel >= MAX_ZOOM}
          >
            -
          </button>
        </div>

        {/* POPUP CON ESTILOS GLOBALES */}
        {hoveredDiscovery && popupPosition && (
          <div
            className="absolute rounded-lg shadow-2xl p-2 max-w-sm pointer-events-none z-30"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              borderWidth: '2px',
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
              transform: 'translate(-50%, -100%) translateY(-10px)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div className="flex flex-col gap-1 w-40">
              {hoveredDiscovery.image_url && (
                <img
                  src={hoveredDiscovery.image_url}
                  alt={hoveredDiscovery.title}
                  className="w-full h-24 object-cover rounded-md mb-1"
                />
              )}
              <h3
                className="font-bold text-xs text-center"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                {hoveredDiscovery.title}
              </h3>
            </div>
          </div>
        )}

        {/* LEYENDA CON ESTILOS GLOBALES */}
        <div
          className="absolute top-4 left-4 px-4 py-3 rounded-lg text-sm z-20 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)',
            fontFamily: "'Playfair Display', serif"
          }}
        >
          <p
            className="font-semibold mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            🌍 Mapa Interactivo
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            • Arrastra para rotar el globo
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            • Hover sobre los pins
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            • Click para ver detalles
          </p>
          <p
            className="text-xs mt-2"
            style={{
              color: 'var(--color-amber)',
              fontFamily: "'Cinzel', serif"
            }}
          >
            📍 <strong>{mockDiscoveries.length}</strong> descubrimientos
          </p>
        </div>

        {/* LEYENDA DE COLORES CON ESTILOS GLOBALES */}
        <div
          className="absolute top-4 right-40 px-4 py-3 rounded-lg text-xs z-20 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)',
            fontFamily: "'Playfair Display', serif"
          }}
        >
          <p
            className="font-semibold mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Leyenda
          </p>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: 'var(--color-coral)' }}
            ></div>
            <span>Descubrimiento</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#A1887A' }}
            ></div>
            <span>Tierra</span>
          </div>
        </div>

      </div>
    </div>
  );
};
export default MapComponent;