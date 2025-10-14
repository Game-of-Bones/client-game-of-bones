import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

const MapComponent = ({ discoveries }: MapComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pinsRef = useRef<Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }>>([]);
  
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const mockDiscoveries: Discovery[] = discoveries || [
    {
      id: 1,
      title: "Joaquinraptor casali",
      location: "La Pampa, Argentina",
      latitude: -36.6167,
      longitude: -64.2833,
      image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      geological_period: "Cretácico Superior",
      fossil_type: "bones_teeth"
    },
    {
      id: 2,
      title: "Qunkasaura pintiquiniestra",
      location: "Magallanes, Chile",
      latitude: -51.7167,
      longitude: -72.5000,
      image_url: "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=400",
      geological_period: "Cretácico",
      fossil_type: "bones_teeth"
    },
    {
      id: 3,
      title: "Tyrannosaurus Rex",
      location: "Montana, USA",
      latitude: 47.5,
      longitude: -107.5,
      image_url: "https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=400",
      geological_period: "Cretácico Superior",
      fossil_type: "bones_teeth"
    },
    {
      id: 4,
      title: "Spinosaurus aegyptiacus",
      location: "Kem Kem, Morocco",
      latitude: 31.5,
      longitude: -4.0,
      image_url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400",
      geological_period: "Cretácico",
      fossil_type: "bones_teeth"
    },
    {
      id: 5,
      title: "Velociraptor mongoliensis",
      location: "Gobi Desert, Mongolia",
      latitude: 43.5,
      longitude: 104.0,
      image_url: "https://images.unsplash.com/photo-1572300247897-34c4e4b5c7a1?w=400",
      geological_period: "Cretácico Superior",
      fossil_type: "bones_teeth"
    }
  ];

  useEffect(() => {
    if (!containerRef.current) {
      console.error('Container ref is null');
      return;
    }

    console.log('Initializing Three.js scene...');

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      sceneRef.current = scene;

      // Camera
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      console.log(`Container size: ${width}x${height}`);

      if (width === 0 || height === 0) {
        setError('El contenedor no tiene dimensiones válidas');
        return;
      }

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 3);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      containerRef.current.appendChild(renderer.domElement);
      console.log('Renderer added to DOM');

      // GLOBE
      const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
      const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b7355,
        emissive: 0x443322,
        shininess: 10,
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      globeRef.current = globe;
      scene.add(globe);
      console.log('Globe added');

      // OCEAN
      const oceanGeometry = new THREE.SphereGeometry(0.995, 64, 64);
      const oceanMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a6a7a,
        transparent: true,
        opacity: 0.7,
      });
      const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
      scene.add(ocean);
      console.log('Ocean added');

      // LIGHTS
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xff8844, 0.5);
      pointLight.position.set(-5, -3, 5);
      scene.add(pointLight);
      console.log('Lights added');

      // PINS
      const pins: Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }> = [];

      mockDiscoveries.forEach((discovery, index) => {
        const phi = (90 - discovery.latitude) * (Math.PI / 180);
        const theta = (discovery.longitude + 180) * (Math.PI / 180);
        const radius = 1.04;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        // Pin
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

        // Halo
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
        console.log(`Pin ${index + 1} added at`, discovery.location);
      });

      pinsRef.current = pins;

      // INTERACTION
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let isDragging = false;
      let previousMouse = { x: 0, y: 0 };

      const handleMouseMove = (event: MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (isDragging) {
          const deltaX = event.clientX - previousMouse.x;
          const deltaY = event.clientY - previousMouse.y;

          if (globeRef.current) {
            globeRef.current.rotation.y += deltaX * 0.005;
            globeRef.current.rotation.x += deltaY * 0.005;
            ocean.rotation.y += deltaX * 0.005;
            ocean.rotation.x += deltaY * 0.005;

            pinsRef.current.forEach(({ mesh, halo }) => {
              const pos = mesh.position.clone();
              pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
              pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * 0.005);
              mesh.position.copy(pos);
              halo.position.copy(pos);
            });
          }

          previousMouse = { x: event.clientX, y: event.clientY };
        } else {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(pinsRef.current.map(p => p.mesh));

          if (intersects.length > 0 && intersects[0].object.userData.discovery) {
            setHoveredDiscovery(intersects[0].object.userData.discovery);
            if (containerRef.current) containerRef.current.style.cursor = 'pointer';
          } else {
            setHoveredDiscovery(null);
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
          }
        }
      };

      const handleMouseDown = (event: MouseEvent) => {
        isDragging = true;
        previousMouse = { x: event.clientX, y: event.clientY };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
      };

      const handleMouseUp = () => {
        isDragging = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
      };

      const handleClick = (event: MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinsRef.current.map(p => p.mesh));

        if (intersects.length > 0 && intersects[0].object.userData.discovery) {
          const disc = intersects[0].object.userData.discovery;
          alert(`🦴 ${disc.title}\n📍 ${disc.location}\n\nNavegando a /posts/${disc.id}`);
        }
      };

      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mousedown', handleMouseDown);
      containerRef.current.addEventListener('mouseup', handleMouseUp);
      containerRef.current.addEventListener('click', handleClick);

      // ANIMATION
      let animationId: number;
      let time = 0;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.02;

        // Auto rotate
        if (!isDragging && globeRef.current) {
          globeRef.current.rotation.y += 0.001;
          ocean.rotation.y += 0.001;

          pinsRef.current.forEach(({ mesh, halo }) => {
            const pos = mesh.position.clone();
            pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.001);
            mesh.position.copy(pos);
            halo.position.copy(pos);
          });
        }

        // Pulse halos
        pinsRef.current.forEach(({ halo }) => {
          const scale = 1 + Math.sin(time) * 0.25;
          halo.scale.set(scale, scale, scale);
          const mat = halo.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.3 + Math.sin(time) * 0.1;
        });

        renderer.render(scene, camera);
      };

      animate();
      console.log('Animation started');
      setIsLoading(false);

      // RESIZE
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // CLEANUP
      return () => {
        console.log('Cleaning up Three.js');
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
          containerRef.current.removeEventListener('mousedown', handleMouseDown);
          containerRef.current.removeEventListener('mouseup', handleMouseUp);
          containerRef.current.removeEventListener('click', handleClick);
          
          if (rendererRef.current?.domElement && containerRef.current.contains(rendererRef.current.domElement)) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        }

        rendererRef.current?.dispose();
      };

    } catch (err) {
      console.error('Error initializing Three.js:', err);
      setError('Error al cargar el mapa 3D');
      setIsLoading(false);
    }
  }, [discoveries]);

  if (error) {
    return (
      <div className="w-full h-[700px] flex items-center justify-center bg-red-900 rounded-lg">
        <div className="text-center text-white p-8">
          <p className="text-xl font-bold mb-2">⚠️ Error</p>
          <p>{error}</p>
          <p className="text-sm mt-4">Revisa la consola para más detalles</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full rounded-lg overflow-hidden shadow-2xl border-2 border-amber-800"
      style={{ height: '700px', minHeight: '700px' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-300 text-lg">Cargando globo 3D...</p>
          </div>
        </div>
      )}

      <div 
        ref={containerRef} 
        className="w-full h-full bg-neutral-900"
        style={{ cursor: 'grab' }}
      />

      {hoveredDiscovery && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl p-4 max-w-md pointer-events-none z-30 border-2 border-red-500">
          <div className="flex gap-3">
            {hoveredDiscovery.image_url && (
              <img 
                src={hoveredDiscovery.image_url} 
                alt={hoveredDiscovery.title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">
                {hoveredDiscovery.title}
              </h3>
              <p className="text-xs text-gray-600 mb-1">
                📍 {hoveredDiscovery.location}
              </p>
              {hoveredDiscovery.geological_period && (
                <p className="text-xs text-gray-500">
                  🦕 {hoveredDiscovery.geological_period}
                </p>
              )}
              <p className="text-xs text-red-600 mt-2 font-semibold">
                Click para detalles →
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-4 py-3 rounded-lg text-sm z-20 backdrop-blur-sm">
        <p className="font-semibold mb-2">🌍 Mapa Interactivo</p>
        <p className="text-xs">• Arrastra para rotar el globo</p>
        <p className="text-xs">• Hover sobre los pins</p>
        <p className="text-xs">• Click para ver detalles</p>
        <p className="text-xs mt-2 text-amber-400">
          📍 <strong>{mockDiscoveries.length}</strong> descubrimientos
        </p>
      </div>

      <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white px-4 py-3 rounded-lg text-xs z-20 backdrop-blur-sm">
        <p className="font-semibold mb-2">Leyenda</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
          <span>Descubrimiento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-700"></div>
          <span>Tierra</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;