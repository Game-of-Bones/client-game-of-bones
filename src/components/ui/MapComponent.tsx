import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ===============================================
// FUNCIÓN AUXILIAR: PROYECCIÓN 3D A 2D
// Esta función proyecta una posición 3D (un pin) a coordenadas de pantalla (píxeles)
// para que podamos posicionar elementos HTML (el popup) sobre el canvas de Three.js.
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
// TIPOS (SIN CAMBIOS)
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

    // ESTADO AÑADIDO: Posición del popup en píxeles (x, y)
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
    
    const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Datos mock (sin cambios)
    const mockDiscoveries: Discovery[] = discoveries || [
        { id: 1, title: "Joaquinraptor casali", location: "La Pampa, Argentina", latitude: -36.6167, longitude: -64.2833, image_url: "/assets/joaquinraptor.jpg", geological_period: "Cretácico Superior", fossil_type: "bones_teeth" },
        { id: 2, title: "Qunkasaura pintiquiniestra", location: "Magallanes, Chile", latitude: -51.7167, longitude: -72.5000, image_url: "/assets/qunkasaura.jpg", geological_period: "Cretácico", fossil_type: "bones_teeth" },
        // ... (el resto de tus descubrimientos mock)
    ];

    // ===============================================
    // EFECTO PRINCIPAL DE THREE.JS
    // ===============================================
    useEffect(() => {
        if (!containerRef.current) return;

        try {
            // Inicialización de Escena, Cámara y Renderer (sin cambios mayores)
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0a);
            sceneRef.current = scene;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            if (width === 0 || height === 0) {
                setError('El contenedor no tiene dimensiones válidas');
                return;
            }

            const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
            camera.position.set(0, 0, 3);
            cameraRef.current = camera;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            rendererRef.current = renderer;
            containerRef.current.appendChild(renderer.domElement);

            // ===============================================
            // CARGA DE TEXTURAS Y GLOBE (MODIFICADO)
            // ===============================================
            const textureLoader = new THREE.TextureLoader();
            // 💡 NOTA: Asegúrate de que esta ruta sea accesible en tu proyecto Vite.
            const earthTexture = textureLoader.load('/public/earth_map.jpg'); 

            const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
            const globeMaterial = new THREE.MeshStandardMaterial({ // Usamos Standard para mejor iluminación
                map: earthTexture, // 👈 APLICAMOS LA TEXTURA
                color: 0xffffff,   // Base blanca para que la textura se muestre correctamente
                roughness: 0.9,    // Aspecto no tan brillante
                metalness: 0.1,
            });
            const globe = new THREE.Mesh(globeGeometry, globeMaterial);
            globeRef.current = globe;
            scene.add(globe);

            // **IMPORTANTE:** Eliminamos el objeto 'ocean' ya que la textura ya incluye los océanos.
            // Si quieres que el globo pueda rotarse en el mouse down, debe ser parte de la escena,
            // pero para el propósito de rotar el mapa, solo rotaremos el 'globe' (y los pins).

            // LIGHTS (sin cambios)
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);
            // ... (resto de luces)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 3, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0xff8844, 0.5);
            pointLight.position.set(-5, -3, 5);
            scene.add(pointLight);

            // PINS (sin cambios funcionales, la lógica de rotación se maneja en 'animate')
            const pins: Array<{ mesh: THREE.Mesh; discovery: Discovery; halo: THREE.Mesh }> = [];
            mockDiscoveries.forEach(discovery => {
                // ... (cálculo de posición x, y, z)
                const phi = (90 - discovery.latitude) * (Math.PI / 180);
                const theta = (discovery.longitude + 180) * (Math.PI / 180);
                const radius = 1.04;
                const x = -(radius * Math.sin(phi) * Math.cos(theta));
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                // Pin (geométria)
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

                // Halo (efecto)
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

// 💡 FUNCIÓN CORREGIDA: Definición de movimiento y arrastre
const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
        const deltaX = event.clientX - previousMouse.x;
        const deltaY = event.clientY - previousMouse.y;

        if (globeRef.current) {
            // Rotación del globo (ejes X e Y)
            globeRef.current.rotation.y += deltaX * 0.005;
            globeRef.current.rotation.x += deltaY * 0.005;
            // No rotamos "ocean" porque lo eliminamos para la textura
            // ocean.rotation.y += deltaX * 0.005;
            // ocean.rotation.x += deltaY * 0.005;

            // Rotación de los pins para que se muevan con el globo
            pinsRef.current.forEach(({ mesh, halo }) => {
                const rotationY = deltaX * 0.005;
                const rotationX = deltaY * 0.005;

                // Aplicar rotación a los pins en el eje X e Y globales
                // Nota: Usar applyAxisAngle puede ser más estable que clonar/aplicar para arrastre
                mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationY);
                mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rotationX);
                
                halo.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationY);
                halo.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rotationX);
            });
        }

        previousMouse = { x: event.clientX, y: event.clientY };
    } else {
        // Lógica de Raycaster para detectar HOVER
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

// 💡 FUNCIÓN CORREGIDA: Definición de mouse down (inicio de arrastre)
const handleMouseDown = (event: MouseEvent) => {
    isDragging = true;
    previousMouse = { x: event.clientX, y: event.clientY };
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
};

// 💡 FUNCIÓN CORREGIDA: Definición de mouse up (fin de arrastre)
const handleMouseUp = () => {
    isDragging = false;
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
};

// 💡 FUNCIÓN CORREGIDA: Definición de click (navegación)
const handleClick = (event: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pinsRef.current.map(p => p.mesh));

    if (intersects.length > 0 && intersects[0].object.userData.discovery) {
        const disc = intersects[0].object.userData.discovery;
        // En un proyecto real usarías 'navigate(`/posts/${disc.id}`)',
        // pero mantenemos el alert por ahora:
        alert(`🦴 ${disc.title}\n📍 ${disc.location}\n\nNavegando a /posts/${disc.id}`);
    }
};

// Adjuntar listeners (sin cambios en esta parte, ahora las funciones existen)
containerRef.current.addEventListener('mousemove', handleMouseMove);
containerRef.current.addEventListener('mousedown', handleMouseDown);
containerRef.current.addEventListener('mouseup', handleMouseUp);
containerRef.current.addEventListener('click', handleClick);



            // ANIMATION (MODIFICADO para el popup)
            let animationId: number;
            let time = 0;

            const animate = () => {
                animationId = requestAnimationFrame(animate);
                time += 0.02;

                // Auto rotate (Ajustado para rotar solo el globo y los pins)
                if (!isDragging && globeRef.current) {
                    const autoRotateSpeed = 0.001;
                    
                    globeRef.current.rotation.y += autoRotateSpeed;

                    pinsRef.current.forEach(({ mesh, halo }) => {
                         // Rotar los pins en el eje Y global
                         mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), autoRotateSpeed);
                         halo.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), autoRotateSpeed);
                    });
                }
                
                // Pulse halos (sin cambios)
                pinsRef.current.forEach(({ halo }) => {
                    const scale = 1 + Math.sin(time * 3) * 0.1; // Ajustado la velocidad del pulso
                    halo.scale.set(scale, scale, scale);
                    const mat = halo.material as THREE.MeshBasicMaterial;
                    mat.opacity = 0.3 + Math.sin(time * 3) * 0.15;
                });
                
                // =========================================================
                // 💡 LÓGICA CLAVE: PROYECTAR EL HOVERED PIN A COORDENADAS 2D
                // =========================================================
                if (hoveredDiscovery && globeRef.current && cameraRef.current && rendererRef.current && containerRef.current) {
                    const currentPin = pinsRef.current.find(p => p.discovery.id === hoveredDiscovery.id);
                    
                    if (currentPin) {
                        const screenCoords = getScreenCoordinates(
                            currentPin.mesh.position.clone(),
                            cameraRef.current,
                            rendererRef.current,
                            containerRef.current
                        );
                        
                        // Solo mostramos el popup si el pin está visible al frente
                        if (screenCoords.visible) {
                            setPopupPosition({ x: screenCoords.x, y: screenCoords.y });
                        } else if (popupPosition) {
                            setPopupPosition(null); // Ocultar si ya no está visible
                        }
                    }
                } else if (popupPosition) {
                    // Si el mouse sale pero el popup sigue visible, lo ocultamos
                    setPopupPosition(null);
                }

                renderer.render(scene, camera);
            };

            animate();
            setIsLoading(false);

            // ... (RESİZE y CLEANUP sin cambios)

        } catch (err) {
            console.error('Error initializing Three.js:', err);
            setError('Error al cargar el mapa 3D');
            setIsLoading(false);
        }
    }, [discoveries, hoveredDiscovery, popupPosition]); // Agregamos dependencias para evitar warnings/errores.

    // ===============================================
    // RENDERIZADO JSX (MODIFICADO para el popup)
    // ===============================================

    if (error) {
        // ... (Tu manejo de errores)
    }

    return (
        <div 
            className="relative w-full rounded-lg overflow-hidden shadow-2xl border-2 border-amber-800"
            style={{ height: '700px', minHeight: '700px' }}
        >
            {isLoading && (
                // ... (Tu Loading State)
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

            {/* =============================================== */}
            {/* POPUP DINÁMICO HTML/CSS (Ajustado con popupPosition) */}
            {/* =============================================== */}
            {hoveredDiscovery && popupPosition && (
                <div 
                    className="absolute bg-white rounded-lg shadow-2xl p-2 max-w-sm pointer-events-none z-30 border-2 border-amber-800"
                    style={{ 
                        // POSICIONAMIENTO ABSOLUTO EN PÍXELES DESDE LA PROYECCIÓN 3D
                        left: `${popupPosition.x}px`,
                        top: `${popupPosition.y}px`,
                        // CENTRADO y DESPLAZADO HACIA ARRIBA para que el pin quede en el punto inferior
                        transform: 'translate(-50%, -100%) translateY(-10px)', 
                        // 10px extra de margen
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
                        <h3 className="font-bold text-gray-900 text-xs text-center">
                            {hoveredDiscovery.title}
                        </h3>
                    </div>
                </div>
            )}
            
            {/* ... (Tu Leyenda y Controles) */}
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