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
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Datos mock - TODO: Reemplazar con props del backend
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
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // 🌍 Globo con estilo vintage/antiguo
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b7355,
      emissive: 0x3d2817,
      shininess: 5,
      specular: 0x333333,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // 🌊 Océanos con tono verdoso vintage
    const oceanGeometry = new THREE.SphereGeometry(0.998, 64, 64);
    const oceanMaterial = new THREE.MeshPhongMaterial({
      color: 0x5a8a9a,
      transparent: true,
      opacity: 0.75,
    });
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    scene.add(ocean);

    // 💡 Iluminación cálida estilo antiguo
    const ambientLight = new THREE.AmbientLight(0xffd7a8, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffe4b5, 0.6);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xff8c42, 0.3);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    // 📍 Crear pins rojos para cada descubrimiento
    const pins: Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }> = [];

    mockDiscoveries.forEach((discovery) => {
      const phi = (90 - discovery.latitude) * (Math.PI / 180);
      const theta = (discovery.longitude + 180) * (Math.PI / 180);

      const x = -(1.05 * Math.sin(phi) * Math.cos(theta));
      const y = 1.05 * Math.cos(phi);
      const z = 1.05 * Math.sin(phi) * Math.sin(theta);

      // Pin principal (esfera roja)
      const pinGeometry = new THREE.SphereGeometry(0.025, 16, 16);
      const pinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4493a,
        emissive: 0xd4493a,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.4
      });
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.position.set(x, y, z);

      // Halo pulsante alrededor del pin
      const haloGeometry = new THREE.SphereGeometry(0.03, 16, 16);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xd4493a,
        transparent: true,
        opacity: 0.4
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.copy(pin.position);

      scene.add(pin);
      scene.add(halo);

      pins.push({ mesh: pin, discovery, halo });
    });

    // Animación de pulso para los halos
    let pulseTime = 0;
    const animateHalos = () => {
      pulseTime += 0.05;
      pins.forEach(({ halo }) => {
        const scale = 1 + Math.sin(pulseTime) * 0.3;
        halo.scale.set(scale, scale, scale);
        // FIX: Type assertion para evitar error de TypeScript
        (halo.material as THREE.MeshBasicMaterial).opacity = 0.4 - Math.sin(pulseTime) * 0.15;
      });
    };

    // 🖱️ Raycaster para detectar clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pins.map(p => p.mesh));

      if (intersects.length > 0) {
        const clickedPin = pins.find(p => p.mesh === intersects[0].object);
        if (clickedPin) {
          // TODO: Conectar con React Router cuando esté integrado
          console.log(`Navegando a /posts/${clickedPin.discovery.id}`);
          alert(`Descubrimiento: ${clickedPin.discovery.title}\n\nEn producción navegará a:\n/posts/${clickedPin.discovery.id}`);
          // navigate(`/posts/${clickedPin.discovery.id}`);
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pins.map(p => p.mesh));

      if (intersects.length > 0) {
        const hoveredPin = pins.find(p => p.mesh === intersects[0].object);
        if (hoveredPin) {
          setHoveredDiscovery(hoveredPin.discovery);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredDiscovery(null);
        document.body.style.cursor = 'default';
      }
    };

    containerRef.current.addEventListener('click', onMouseClick);
    containerRef.current.addEventListener('mousemove', onMouseMove);

    // 🔄 Rotación manual con mouse
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseDrag = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      const rotationY = deltaX * 0.005;
      const rotationX = deltaY * 0.005;

      globe.rotation.y += rotationY;
      ocean.rotation.y += rotationY;
      globe.rotation.x += rotationX;
      ocean.rotation.x += rotationX;

      pins.forEach(({ mesh, halo }) => {
        const pos = mesh.position.clone();
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationX);
        mesh.position.copy(pos);
        halo.position.copy(pos);
      });

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseDrag);
    window.addEventListener('mouseup', onMouseUp);

    // ♻️ Loop de animación
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotación automática suave
      if (!isDragging) {
        globe.rotation.y += 0.0008;
        ocean.rotation.y += 0.0008;

        pins.forEach(({ mesh, halo }) => {
          const pos = mesh.position.clone();
          pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0008);
          mesh.position.copy(pos);
          halo.position.copy(pos);
        });
      }

      animateHalos();
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // 📏 Responsive
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 🧹 Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseDrag);
      window.removeEventListener('mouseup', onMouseUp);
      containerRef.current?.removeEventListener('click', onMouseClick);
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      oceanGeometry.dispose();
      oceanMaterial.dispose();
      
      document.body.style.cursor = 'default';
    };
  }, [discoveries]);

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-b from-stone-900 to-neutral-950 rounded-lg overflow-hidden border-2 border-amber-800 shadow-2xl">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900 bg-opacity-95 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-300 text-lg">Cargando mapa de descubrimientos...</p>
          </div>
        </div>
      )}

      {/* Contenedor del globo 3D */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Tooltip al hacer hover */}
      {hoveredDiscovery && (
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-amber-50 rounded-lg shadow-2xl p-4 max-w-md pointer-events-none z-20 border-2 border-amber-700"
          style={{ animation: 'fadeIn 0.3s ease-in' }}
        >
          <div className="flex gap-4">
            {hoveredDiscovery.image_url && (
              <img 
                src={hoveredDiscovery.image_url} 
                alt={hoveredDiscovery.title}
                className="w-24 h-24 object-cover rounded border-2 border-amber-600"
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-bold text-amber-950 mb-2 text-lg">
                {hoveredDiscovery.title}
              </h3>
              <p className="text-sm text-amber-800 mb-1">
                📍 {hoveredDiscovery.location}
              </p>
              {hoveredDiscovery.geological_period && (
                <p className="text-xs text-amber-700">
                  🦕 {hoveredDiscovery.geological_period}
                </p>
              )}
              <p className="text-xs text-red-700 mt-2 font-semibold">
                Click para ver detalles →
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones de uso */}
      <div className="absolute top-4 left-4 bg-stone-900 bg-opacity-90 text-amber-300 px-4 py-3 rounded-lg text-sm border border-amber-800 backdrop-blur-sm">
        <p className="font-semibold mb-2 text-amber-200">🌍 Mapa Interactivo</p>
        <p className="text-xs">• Arrastra para rotar el globo</p>
        <p className="text-xs">• Haz hover sobre los pins</p>
        <p className="text-xs">• Click para ver detalles</p>
        <p className="text-xs mt-2 text-amber-400">
          📍 <span className="font-semibold">{mockDiscoveries.length}</span> descubrimientos
        </p>
      </div>

      {/* Leyenda */}
      <div className="absolute top-4 right-4 bg-stone-900 bg-opacity-90 text-amber-300 px-4 py-3 rounded-lg text-xs border border-amber-800 backdrop-blur-sm">
        <p className="font-semibold mb-2 text-amber-200">Leyenda</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-600 shadow-lg"></div>
          <span>Descubrimiento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-700"></div>
          <span>Tierra</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;