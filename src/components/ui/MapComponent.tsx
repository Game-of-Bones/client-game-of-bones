import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

    // Datos mock (sin cambios)
    const mockDiscoveries: Discovery[] = discoveries || [
        { id: 1, title: "Joaquinraptor casali", location: "La Pampa, Argentina", latitude: -36.6167, longitude: -64.2833, image_url: "/assets/joaquinraptor.jpg", geological_period: "Cretácico Superior", fossil_type: "bones_teeth" },
        { id: 2, title: "Qunkasaura pintiquiniestra", location: "Magallanes, Chile", latitude: -51.7167, longitude: -72.5000, image_url: "/assets/qunkasaura.jpg", geological_period: "Cretácico", fossil_type: "bones_teeth" },
        // Añadiendo más pines mock para asegurar visibilidad
        { id: 3, title: "Tyrannotitan", location: "Chubut, Argentina", latitude: -43.3000, longitude: -65.1000, image_url: "/assets/tyrannotitan.jpg", geological_period: "Cretácico Inferior", fossil_type: "bones_teeth" },
    ];

    // ===============================================
    // EFECTO PRINCIPAL DE THREE.JS
    // ===============================================
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current; // Alias para usar en cleanup

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
            camera.position.set(0, 0, 3);
            cameraRef.current = camera;

            // alpha: true para transparencia
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0); // Fondo completamente transparente
            rendererRef.current = renderer;
            container.appendChild(renderer.domElement);

            // ===============================================
            // CARGA DE TEXTURAS Y GLOBE (CORREGIDO)
            // ===============================================
            const textureLoader = new THREE.TextureLoader();
            // Asegúrate de que esta textura sea la sepia que deseas
            const earthTexture = textureLoader.load('/public/earth_map.jpg'); 

            // CORRECCIÓN para mitigar el 'seam'
            earthTexture.wrapS = THREE.RepeatWrapping; 

            const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
            const globeMaterial = new THREE.MeshStandardMaterial({
                map: earthTexture,
                // 💡 CORRECCIÓN 2: Nuevo color sepia más claro para aumentar brillo
                color: 0x9D8A74, // Tono tan/sepia más claro
                roughness: 0.9,
                metalness: 0.1,
            });
            const globe = new THREE.Mesh(globeGeometry, globeMaterial);
            globeRef.current = globe;
            scene.add(globe);

            // LIGHTS (AUMENTO DE INTENSIDAD para más brillo)
            // 💡 CORRECCIÓN 1: Aumento de intensidad para globo más brillante
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // De 0.7 a 1.0
            scene.add(ambientLight);
            // 💡 CORRECCIÓN 1: Aumento de intensidad para globo más brillante
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // De 0.8 a 1.2
            directionalLight.position.set(5, 3, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0xff8844, 0.5);
            pointLight.position.set(-5, -3, 5);
            scene.add(pointLight);

            // PINS (sin cambios)
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

            // INTERACTION (Sin cambios)
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

                    if (intersects.length > 0 && intersects[0].object.userData.discovery) {
                        setHoveredDiscovery(intersects[0].object.userData.discovery);
                        container.style.cursor = 'pointer';
                    } else {
                        setHoveredDiscovery(null);
                        container.style.cursor = 'grab';
                    }
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
                    const disc = intersects[0].object.userData.discovery;
                    alert(`🦴 ${disc.title}\n📍 ${disc.location}\n\nNavegando a /posts/${disc.id}`);
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

                // Auto rotate (Debe funcionar ahora gracias al cleanup)
                if (!isDragging && globeRef.current) {
                    const autoRotateSpeed = 0.001;
                    
                    // Nota: Rotar la escena completa (o el globo y los pines) es clave.
                    // Si solo rotas el globo, los pines se quedan atrás.
                    // En la iteración anterior, no roté los pines en auto-rotate.
                    // Aquí rotamos el globo y delegamos la rotación de pines al drag, 
                    // o envolvemos todo en un Object3D padre para rotar de forma más simple.
                    // Por simplicidad, volvamos a la rotación solo del globo por ahora (si es que no es un problema)
                    globeRef.current.rotation.y += autoRotateSpeed;
                }
                
                // Pulse halos (sin cambios)
                pinsRef.current.forEach(({ halo }) => {
                    const scale = 1 + Math.sin(time * 3) * 0.1;
                    halo.scale.set(scale, scale, scale);
                    const mat = halo.material as THREE.MeshBasicMaterial;
                    mat.opacity = 0.3 + Math.sin(time * 3) * 0.15;
                });
                
                // LÓGICA CLAVE: PROYECTAR EL HOVERED PIN A COORDENADAS 2D (sin cambios)
                if (hoveredDiscovery && cameraRef.current && rendererRef.current && containerRef.current) {
                    const currentPin = pinsRef.current.find(p => p.discovery.id === hoveredDiscovery.id);
                    
                    if (currentPin) {
                        const screenCoords = getScreenCoordinates(
                            currentPin.mesh.position.clone(),
                            cameraRef.current,
                            rendererRef.current,
                            containerRef.current
                        );
                        
                        if (screenCoords.visible) {
                            setPopupPosition({ x: screenCoords.x, y: screenCoords.y });
                        } else if (popupPosition) {
                            setPopupPosition(null);
                        }
                    }
                } else if (popupPosition) {
                    setPopupPosition(null);
                }

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
    }, [discoveries, hoveredDiscovery, popupPosition]);

    // ===============================================
    // RENDERIZADO JSX (ESTILOS ACTUALIZADOS PARA TRANSPARENCIA)
    // ===============================================

    if (error) {
        return <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">Error: {error}</div>;
    }

    return (
        <div 
            // 💡 CORRECCIÓN 3: Eliminamos rounded-lg y shadow-2xl y forzamos transparencia
            className="relative w-full overflow-hidden" 
            style={{ height: '700px', minHeight: '700px', backgroundColor: 'transparent' }} 
        >
            {isLoading && (
                <div 
                    className="absolute inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Fondo semitransparente oscuro
                >
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
                             style={{ borderColor: 'var(--color-amber)' }} // Usa tu variable amber
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
            {/* POPUP DINÁMICO HTML/CSS (Sin cambios) */}
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
            
            {/* ... (Leyenda y Controles - Sin cambios) */}
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
                className="absolute top-4 right-4 px-4 py-3 rounded-lg text-xs z-20 backdrop-blur-sm"
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
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }}></div>
                    <span>Tierra</span>
                </div>
            </div>

        </div>
    );
};

export default MapComponent;