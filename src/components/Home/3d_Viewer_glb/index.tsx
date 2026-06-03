'use client';
import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url, isMobile }: { url: string; isMobile: boolean }) => {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    const scale = useMemo(() => {
        // Calculate the bounding box synchronously to get the correct scale before <Center> measures it
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = 3 / (maxDim || 1);
        return isMobile ? baseScale * 0.7 : baseScale;
    }, [clonedScene, isMobile]);

    return <primitive object={clonedScene} scale={scale} castShadow receiveShadow />;
};

const CameraRig = ({ 
    progressRef, 
    isMobile,
    isInteracting 
}: { 
    progressRef: React.MutableRefObject<number>; 
    isMobile: boolean;
    isInteracting: boolean;
}) => {
    const { camera, controls } = useThree();
    const targetPos = useRef(new THREE.Vector3(0, 0, 5));
    const targetLook = useRef(new THREE.Vector3(0, 0, 0));
    const currentLook = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        const o = progressRef.current;
        const s = isMobile ? 0.7 : 1.0;
        const zoom = isMobile ? 1.1 : 1.0;
        const dScale = isMobile ? 1.0 : 1.4; // Zoom out the close-up shots slightly on desktop only

        if (o < 0.15) {
            // Intro: Wide Shot of the entire chair (Zoomed in on mobile, zoomed out further on desktop)
            targetPos.current.set(0, 0, (isMobile ? 3.6 : 6.2) * zoom);
            targetLook.current.set(0, 0, 0);
        } else if (o >= 0.15 && o < 0.4) {
            // Section 1: Premium Headrest (Top of the chair)
            targetPos.current.set(-1.0 * zoom * dScale, 1.3 * s, 1.6 * zoom * dScale);
            targetLook.current.set(0, 1.3 * s, 0);
        } else if (o >= 0.4 && o < 0.65) {
            // Section 2: Lumbar Support (Middle back)
            targetPos.current.set(1.5 * zoom * dScale, -0.2 * s, 1.5 * zoom * dScale);
            targetLook.current.set(0, -0.2 * s, 0);
        } else if (o >= 0.65 && o < 0.8) {
            // Section 3: Armrests (Side middle)
            targetPos.current.set(-1.6 * zoom * dScale, 0.1 * s, 1.2 * zoom * dScale);
            targetLook.current.set(0, 0.1 * s, 0);
        } else {
            // Section 4: Wheels & Base (Bottom of the chair)
            targetPos.current.set(1.5 * zoom * dScale, -1.0 * s, 1.8 * zoom * dScale);
            targetLook.current.set(0, -1.2 * s, 0);
        }

        if (isInteracting) return; // Let OrbitControls take full control during interaction

        // Sync OrbitControls target focus position
        if (controls) {
            (controls as any).target.lerp(targetLook.current, 8 * delta);
        }

        // Slowly rotate the model continuously when not interacting
        const time = state.clock.getElapsedTime();
        const radius = Math.sqrt(targetPos.current.x ** 2 + targetPos.current.z ** 2);
        const angle = Math.atan2(targetPos.current.z, targetPos.current.x) + time * 0.05;
        targetPos.current.x = Math.cos(angle) * radius;
        targetPos.current.z = Math.sin(angle) * radius;

        // Use Vector3's built-in lerp to gracefully move the camera
        camera.position.lerp(targetPos.current, 6.1 * delta);
        currentLook.current.lerp(targetLook.current, 6.1 * delta);
        camera.lookAt(currentLook.current);
    });
    return null;
};

interface SectionData {
    title: string;
    subtitle?: string;
    desc?: string;
    badge?: string;
    align: 'center' | 'left' | 'right';
}

const SECTIONS: SectionData[] = [
    {
        title: "Why Astride?",
        subtitle: "Engineered for excellence. Discover the ultimate ergonomic experience, meticulously crafted from the ground up.",
        align: "center"
    },
    {
        title: "Premium Headrest",
        desc: "Dynamic cranial support that adapts to your posture. Contoured with breathable mesh to ensure your neck remains completely strain-free during those intense 12-hour sessions.",
        badge: "01 / COMFORT",
        align: "right"
    },
    {
        title: "Adaptive Lumbar",
        desc: "Patented lower-back suspension system. It actively tracks your spine's curvature, pushing back with the exact right amount of pressure whether you lean forward or recline.",
        badge: "02 / POSTURE",
        align: "left"
    },
    {
        title: "4D Armrests",
        desc: "Total dimensional control. Shift them up, down, left, right, or angle them precisely to align with your desk height, eliminating shoulder fatigue instantly.",
        badge: "03 / PRECISION",
        align: "right"
    },
    {
        title: "Silent Glide Base",
        desc: "Forged from aerospace-grade aluminum. Paired with our specialized PU casters, it glides across hardwood and carpet with zero noise and absolute stability.",
        badge: "04 / FOUNDATION",
        align: "left"
    }
];

export default function ModelViewer({ url = '/3D_asset_glb/a3.glb' }: { url?: string }) {
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const isInteractingRef = useRef(false);
    const interactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);

    const handleInteractionStart = () => {
        setIsInteracting(true);
        isInteractingRef.current = true;
        if (interactTimeoutRef.current) {
            clearTimeout(interactTimeoutRef.current);
        }
    };

    const handleInteractionEnd = () => {
        if (interactTimeoutRef.current) {
            clearTimeout(interactTimeoutRef.current);
        }
        interactTimeoutRef.current = setTimeout(() => {
            setIsInteracting(false);
            isInteractingRef.current = false;
        }, 600);
    };

    useEffect(() => {
        setMounted(true);
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let isSnapping = false;
        let startY = 0;

        const snapToSection = (sectionIndex: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const absoluteContainerTop = window.scrollY + rect.top;
            const totalScrollable = rect.height - window.innerHeight;
            
            const snapPoints = [0, 0.28, 0.53, 0.73, 1.0];
            const progress = snapPoints[sectionIndex];
            const targetScrollY = absoluteContainerTop + progress * totalScrollable;
            
            isSnapping = true;
            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                isSnapping = false;
            }, 800);
        };

        const handleScroll = () => {
            if (isSnapping || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Calculate progress through the container
            const totalScrollable = rect.height - viewHeight;
            if (totalScrollable <= 0) return;

            let progress = -rect.top / totalScrollable;
            progress = Math.min(Math.max(progress, 0), 1);
            
            progressRef.current = progress;
            
            // Determine active section
            let section = 0;
            if (progress < 0.15) section = 0;
            else if (progress >= 0.15 && progress < 0.4) section = 1;
            else if (progress >= 0.4 && progress < 0.65) section = 2;
            else if (progress >= 0.65 && progress < 0.8) section = 3;
            else section = 4;
            
            setActiveSection(section);
        };

        // Mobile Gesture Swipe Snapping Controls
        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = () => {
            // Reset startY after each gesture so next swipe starts fresh
            startY = 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
            // If user is rotating the 3D model, don't intercept scroll gestures
            if (isSnapping || isInteractingRef.current || !containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const absoluteContainerTop = window.scrollY + rect.top;
            
            // Only capture gesture if container is locked in active view
            if (rect.top <= 10 && rect.bottom >= viewHeight - 10) {
                const currentY = e.touches[0].clientY;
                const diffY = startY - currentY; // positive diff means swipe up/scroll down
                
                if (Math.abs(diffY) > 30) {
                    if (diffY > 0) {
                        // Swipe Up (Scroll Down) -> advance to next slide
                        e.preventDefault();
                        if (activeSection < 4) {
                            setActiveSection(prev => {
                                const nextSec = prev + 1;
                                snapToSection(nextSec);
                                return nextSec;
                            });
                        } else {
                            // Already at last slide, scroll past the component down
                            isSnapping = true;
                            window.scrollTo({
                                top: absoluteContainerTop + rect.height,
                                behavior: 'smooth'
                            });
                            setTimeout(() => { isSnapping = false; }, 800);
                        }
                    } else {
                        // Swipe Down (Scroll Up) -> go to previous slide
                        e.preventDefault();
                        if (activeSection > 0) {
                            setActiveSection(prev => {
                                const prevSec = prev - 1;
                                snapToSection(prevSec);
                                return prevSec;
                            });
                        } else {
                            // Already at first slide, scroll past the component up
                            isSnapping = true;
                            window.scrollTo({
                                top: Math.max(0, absoluteContainerTop - viewHeight),
                                behavior: 'smooth'
                            });
                            setTimeout(() => { isSnapping = false; }, 800);
                        }
                    }
                }
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            handleScroll();
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        
        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchmove', handleTouchMove, { passive: false });
            container.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
        
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            }
            if (interactTimeoutRef.current) {
                clearTimeout(interactTimeoutRef.current);
            }
        };
    }, [mounted, activeSection, isMobile]);

    if (!mounted) return null;

    return (
        <div ref={containerRef} className="relative w-full h-[500vh] md:h-[400vh] bg-[#090807] overflow-visible">
            {/* Sticky Container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">

                {/* MOBILE LAYOUT */}
                {isMobile ? (
                    <div className="w-full h-full flex flex-col justify-start gap-4 pt-20 pb-4 px-4 z-10 relative">
                        {/* Title at top */}
                        <div className="text-center">
                            <span className="text-zinc-500 text-[10px] tracking-widest uppercase block mb-0.5">Interactive Experience</span>
                            <h2 className="text-white text-2xl font-serif font-bold uppercase tracking-tight">The Astride Chair</h2>
                        </div>

                        {/* Beautiful 3D Model Card */}
                        <div className="relative w-full h-[460px] max-h-[55vh] mx-auto rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/45 shadow-2xl backdrop-blur-md">
                            <div className="w-full h-full">
                                <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                                    <color attach="background" args={['#090807']} />
                                    
                                    <ambientLight intensity={0.5} />
                                    <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                                    <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                                    <Environment preset="studio" />
                                    
                                    <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
            
                                    <Suspense fallback={null}>
                                        <Center position={[0, -0.3, 0]}>
                                            <Model url={url} isMobile={isMobile} />
                                        </Center>
                                        <CameraRig progressRef={progressRef} isMobile={isMobile} isInteracting={isInteracting} />
                                    </Suspense>

                                    <OrbitControls 
                                        enablePan={false}
                                        enableZoom={true}
                                        minDistance={2}
                                        maxDistance={10}
                                        minPolarAngle={Math.PI / 2.1}
                                        maxPolarAngle={Math.PI / 1.9}
                                        onStart={handleInteractionStart}
                                        onEnd={handleInteractionEnd}
                                        makeDefault
                                    />
                                </Canvas>
                            </div>
                            
                            {/* Astronaut-style overlay on card bottom */}
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10">
                                <div className="flex items-center gap-2 text-[10px] text-neutral-300">
                                    <span className="inline-flex items-center gap-2 rounded px-1.5 py-0.5 bg-white/10 ring-1 ring-white/20 font-mono">
                                        R3F • GLB
                                    </span>
                                    <div className="text-neutral-400">
                                        Drag to rotate, scroll to zoom
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text card below the 3D Viewer */}
                        <div className="w-full bg-zinc-950/50 border border-white/10 backdrop-blur-md rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-lg relative z-20">
                            {(() => {
                                const sec = SECTIONS[activeSection];
                                if (!sec) return null;
                                return (
                                    <div className="w-full flex flex-col items-center text-center transition-all duration-300" style={{ fontFamily: '"Inter", sans-serif' }}>
                                        {sec.badge && (
                                            <span className="text-zinc-400 font-bold tracking-[0.25em] text-[10px] mb-2 block uppercase">
                                                {sec.badge}
                                            </span>
                                        )}
                                        <h3 className="text-white text-2xl font-extrabold tracking-wider mb-2.5 uppercase">
                                            {sec.title}
                                        </h3>
                                        {sec.subtitle && (
                                            <p className="text-zinc-200 text-sm leading-relaxed max-w-sm font-normal">
                                                {sec.subtitle}
                                            </p>
                                        )}
                                        {sec.desc && (
                                            <p className="text-zinc-200 leading-relaxed text-sm font-normal">
                                                {sec.desc}
                                            </p>
                                        )}
                                        {sec.align === 'center' && (
                                            <div className="mt-5 flex flex-col items-center animate-bounce">
                                                <span className="text-zinc-400 text-[9px] tracking-[0.2em] uppercase font-bold">Scroll to explore</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* DESKTOP LAYOUT: full screen canvas with overlay cards */}
                        {/* 3D Canvas */}
                        <div className="absolute inset-0 w-full h-full z-0">
                            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                                <color attach="background" args={['#090807']} />
                                
                                <ambientLight intensity={0.5} />
                                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                                <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                                <Environment preset="studio" />
                                
                                <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
         
                                <Suspense fallback={null}>
                                    <Center position={[0, -0.3, 0]}>
                                        <Model url={url} isMobile={isMobile} />
                                    </Center>
                                    <CameraRig progressRef={progressRef} isMobile={isMobile} isInteracting={false} />
                                </Suspense>
                            </Canvas>
                        </div>

                        {/* DESKTOP: Full-screen overlay cards */}
                        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                            {SECTIONS.map((sec, index) => {
                                const isActive = activeSection === index;
                                return (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${
                                            sec.align === 'center'
                                                ? 'items-end justify-center px-12 text-center pb-20'
                                                : sec.align === 'left'
                                                    ? 'items-center justify-start px-12'
                                                    : 'items-center justify-end px-12'
                                        } ${
                                            isActive
                                                ? 'opacity-100 translate-y-0 scale-100 visible'
                                                : 'opacity-0 translate-y-8 scale-95 invisible pointer-events-none'
                                        }`}
                                    >
                                        {sec.align === 'center' ? (
                                            <div className="max-w-2xl flex flex-col items-center">
                                                <h1 className="text-white text-7xl font-serif font-bold tracking-tight mb-4 drop-shadow-2xl uppercase">
                                                    {sec.title}
                                                </h1>
                                                {sec.subtitle && (
                                                    <p className="text-zinc-400 text-xl font-medium tracking-wide">
                                                        {sec.subtitle}
                                                    </p>
                                                )}
                                                <div className="mt-12 flex flex-col items-center animate-bounce">
                                                    <span className="text-zinc-500 text-sm tracking-widest uppercase mb-2">Scroll to explore</span>
                                                    <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="max-w-md bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl pointer-events-auto">
                                                {sec.badge && (
                                                    <span className="text-orange-500 font-bold tracking-widest text-sm mb-2 block">
                                                        {sec.badge}
                                                    </span>
                                                )}
                                                <h2 className="text-white text-4xl font-serif font-bold mb-4">
                                                    {sec.title}
                                                </h2>
                                                {sec.desc && (
                                                    <p className="text-zinc-400 leading-relaxed text-base">
                                                        {sec.desc}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
