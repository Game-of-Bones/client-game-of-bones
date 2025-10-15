import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// 💡 Nueva Importación: Necesaria para la navegación al hacer click en el pin
import { useNavigate } from 'react-router-dom';

// ===============================================
// FUNCIÓN AUXILIAR: PROYECCIÓN 3D A 2D (Sin cambios)
// ===============================================
const getScreenCoordinates = (
  position: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  container: HTMLDivElement
) => {
  // 1. Proyecta la posición 3D a coordenadas de clip
  const vector = position.clone().project(camera);

  // 2. Mapea las coordenadas de clip (-1 a 1) a coordenadas de pantalla (píxeles)
  const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
  const y = (vector.y * -0.5 + 0.5) * container.clientHeight;

  // Retorna la posición y un flag para saber si el punto está frente a la cámara
  return { x, y, visible: vector.z < 1 };
};

// ===============================================
// TIPOS (Sin cambios)
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
  // 💡 Hook de Navegación
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  // rendererRef se usa para la limpieza y la proyección 2D
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pinsRef = useRef<Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }>>([]);

  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 💡 Referencia para evitar el parpadeo (no fuerza re-renderizado de React)
  const lastHoveredRef = useRef<Discovery | null>(null);

  // 💡 Estado y límites para el Zoom. Initial Zoom 4.0 para hacerlo más pequeño y centrado.
  const MAX_ZOOM = 6;
  const MIN_ZOOM = 1.5;
  const INITIAL_ZOOM = 4.0;
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);

  // Datos mock (sin cambios)
  const mockDiscoveries: Discovery[] = discoveries || [
    { id: 1, title: "Joaquinraptor casali", location: "La Pampa, Argentina", latitude: -36.6167, longitude: -64.2833, image_url: "/assets/joaquinraptor.jpg", geological_period: "Cretácico Superior", fossil_type: "bones_teeth" },
    { id: 2, title: "Qunkasaura pintiquiniestra", location: "Magallanes, Chile", latitude: -51.7167, longitude: -72.5000, image_url: "/assets/qunkasaura.jpg", geological_period: "Cretácico", fossil_type: "bones_teeth" },
    { id: 3, title: "Tyrannotitan", location: "Chubut, Argentina", latitude: -43.3000, longitude: -65.1000, image_url: "/assets/tyrannotitan.jpg", geological_period: "Cretácico Inferior", fossil_type: "bones_teeth" },
  ];

  // 💡 Función de Zoom (Actualiza el estado y la cámara)
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
      // Usamos el zoom inicial
      camera.position.set(0, 0, zoomLevel);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0); // Fondo transparente
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      // ===============================================
      // CARGA DE TEXTURAS Y GLOBE 
      // ===============================================
      const textureLoader = new THREE.TextureLoader();
      // Asegúrate de que /public/earth_map.jpg sea tu mapa sepia
      const earthTexture = textureLoader.load('/public/earth_map.jpg');

      // 💡 CORRECCIÓN 1: Configuración para mitigar el 'seam'
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.minFilter = THREE.LinearMipmapLinearFilter; // Suaviza la unión
      earthTexture.magFilter = THREE.LinearFilter;

      const globeGeometry = new THREE.SphereGeometry(1, 64, 64);

      // 💡 CORRECCIÓN 2: Ajuste de color del material base para el 'océano' sepia (0x7A634E)
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture,
        color: 0x7A634E,
        roughness: 0.9,
        metalness: 0.1,
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      globeRef.current = globe;
      scene.add(globe);

      // LIGHTS (sin cambios)
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xff8844, 0.5);
      pointLight.position.set(-5, -3, 5);
      scene.add(pointLight);

      // PINS (sin cambios)
      const pins: Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }> = [];
      mockDiscoveries.forEach(discovery => {
        // ... (Lógica de creación de pins)
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

      // INTERACTION 
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let isDragging = false;
      let previousMouse = { x: 0, y: 0 };

      // 💡 CORRECCIÓN 3: Modificación en handleMouseMove para evitar el parpadeo
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

          // SOLO actualiza el estado de React si el pin ha cambiado
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


      // 💡 CORRECCIÓN 4: handleClick para la navegación
      const handleClick = (event: MouseEvent) => {
        if (!container) return;

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinsRef.current.map(p => p.mesh));

        if (intersects.length > 0 && intersects[0].object.userData.discovery) {
          const disc = intersects[0].object.userData.discovery as Discovery;
          // Redirige al post detail
          navigate(`/posts/${disc.id}`);
        }
      };

      // Adjuntar listeners (se removerán en el cleanup)
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('click', handleClick);


      // ANIMATION (Rotación reactivada)
      let animationId: number;
      let time = 0;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.02;

        // Auto rotate
        if (!isDragging && globeRef.current) {
          const autoRotateSpeed = 0.001;
          globeRef.current.rotation.y += autoRotateSpeed;
        }

        // Pulse halos
        pinsRef.current.forEach(({ halo }) => {
          const scale = 1 + Math.sin(time * 3) * 0.1;
          halo.scale.set(scale, scale, scale);
          const mat = halo.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.3 + Math.sin(time * 3) * 0.15;
        });

        // ❌ Lógica de setPopupPosition ELIMINADA del loop de animación.

        renderer.render(scene, camera);
      };

      animate();
      setIsLoading(false);

      // ===============================================
      // FUNCIÓN DE LIMPIEZA
      // ===============================================
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
  // ELIMINAMOS 'hoveredDiscovery' y 'popupPosition' de las dependencias para evitar re-renderizado excesivo

  // 💡 NUEVO EFECTO: Calcula la posición 2D del popup SOLO cuando cambia el pin o el zoom
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
  }, [hoveredDiscovery, zoomLevel]); // Se dispara al cambiar el pin o al hacer zoom

  // ===============================================
  // RENDERIZADO JSX (CENTRADOS Y BOTONES DE ZOOM)
  // ===============================================

  if (error) {
    return <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">Error: {error}</div>;
  }

  return (
    // Contenedor externo para centrar el mapa en la página
    <div className="flex justify-center w-full my-8">
      <div
        // Contenedor principal del mapa, ajusta su tamaño máximo aquí (max-w-4xl para centrarlo y hacerlo más pequeño)
        className="relative overflow-hidden w-full max-w-4xl"
        style={{ height: '700px', minHeight: '700px', backgroundColor: 'transparent' }}
      >
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
                style={{ borderColor: 'var(--color-amber)' }}
              ></div>
              <p className="text-lg" style={{ color: 'var(--text-primary)' }}>Cargando globo 3D...</p>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ cursor: 'grab' }}
        />

        {/* =============================================== */}
        {/* BOTONES DE ZOOM (CÓDIGO MODIFICADO) */}
        {/* =============================================== */}
        <div className="absolute top-4 right-20 z-20 flex flex-col gap-2">
          <button
            onClick={() => handleZoom('in')}
            className="btn w-10 h-10 rounded-full text-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
            disabled={zoomLevel <= MIN_ZOOM}
          >
            +
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="btn w-10 h-10 rounded-full text-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
            disabled={zoomLevel >= MAX_ZOOM}
          >
            -
          </button>
        </div>


        {/* =============================================== */}
        {/* POPUP DINÁMICO HTML/CSS */}
        {/* =============================================== */}
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
              <h3 className="font-bold text-xs text-center" style={{ color: 'var(--text-primary)' }}>
                {hoveredDiscovery.title}
              </h3>
            </div>
          </div>
        )}

        {/* =============================================== */}
        {/* Leyenda y Controles */}
        {/* =============================================== */}
        <div
          className="absolute top-4 left-4 px-4 py-3 rounded-lg text-sm z-20 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <p className="font-semibold mb-2">🌍 Mapa Interactivo</p>
          <p className="text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>• Arrastra para rotar el globo</span>
          </p>
          <p className="text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>• Hover sobre los pins</span>
          </p>
          <p className="text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>• Click para ver detalles</span>
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-amber)' }}>
            📍 <strong>{mockDiscoveries.length}</strong> descubrimientos
          </p>
        </div>

        <div
          className="absolute top-4 right-40 px-4 py-3 rounded-lg text-xs z-20 backdrop-blur-sm"
          style={{ 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
          }}
      >
          <p className="font-semibold mb-2">Leyenda</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: 'var(--color-coral)' }}></div>
            <span>Descubrimiento</span>
          </div>
          <div className="flex items-center gap-2">
            {/* 💡 Ajuste de color para la "Tierra" que se vea bien sobre el sepia */}
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A1887A' }}></div>
            <span>Tierra</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MapComponent;