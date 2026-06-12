'use client';
import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center, OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';

function LoadingScreen() {
    const { progress } = useProgress();
    const [visible, setVisible] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        // Only hide the loading screen when progress reaches 100%
        if (progress === 100 && !hasLoaded) {
            setHasLoaded(true);
            const timeout = setTimeout(() => setVisible(false), 600);
            return () => clearTimeout(timeout);
        }
    }, [progress, hasLoaded]);

    if (!visible) return null;

    return (
        <div 
            className={`absolute inset-0 flex flex-col items-center justify-center bg-[#090807] z-50 transition-opacity duration-500 ${
                hasLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                Loading 3D Experience {Math.round(hasLoaded ? 100 : progress)}%
            </p>
        </div>
    );
}

class EnvErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
    constructor(props: {children: React.ReactNode}) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
        console.warn("Environment failed to load:", error);
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return null; // Fallback to no environment if it fails
        }
        return this.props.children;
    }
}

const Model = ({ url, isMobile }: { url: string; isMobile: boolean }) => {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    const scale = useMemo(() => {
        // Calculate the bounding box synchronously to get the correct scale before <Center> measures it
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = (3 / (maxDim || 1)) * 0.9;
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
            targetPos.current.set(-1.0 * zoom * dScale, 1.15 * s, 1.6 * zoom * dScale);
            targetLook.current.set(0, 1.05 * s, 0);
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
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth < 768;
        }
        return false;
    });
    const [isInteracting, setIsInteracting] = useState(false);
    // Start as true so the canvas renders immediately on mount.
    // The IntersectionObserver will set this to false when scrolled off-screen.
    const [isInView, setIsInView] = useState(true);
    const isInteractingRef = useRef(false);
    const interactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Use a ref to track activeSection inside event listeners — avoids re-mounting listeners on every section change
    const activeSectionRef = useRef(0);
    
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

    // Keep activeSectionRef in sync with state (for use inside event listeners)
    useEffect(() => {
        activeSectionRef.current = activeSection;
    }, [activeSection]);

    useEffect(() => {
        setMounted(true);
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Visibility Observer to pause WebGL on mobile and desktop
    useEffect(() => {
        if (!mounted) return;
        
        const visibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => setIsInView(entry.isIntersecting));
            },
            { threshold: 0.05 }
        );
        if (containerRef.current) {
            visibilityObserver.observe(containerRef.current);
        }
        return () => visibilityObserver.disconnect();
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        if (isMobile) return; // Skip scroll snapping and touch gesture listeners on mobile

        let isSnapping = false;

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

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (interactTimeoutRef.current) {
                clearTimeout(interactTimeoutRef.current);
            }
        };
    }, [mounted, isMobile]);

    if (!mounted) return null;

    if (isMobile) {
        return (
            <div ref={containerRef} className="w-full bg-[#090807] pt-2 pb-10 px-8 flex flex-col gap-6">
                {/* Title at top */}
                <div className="text-center">
                    <span className="text-zinc-500 text-[10px] tracking-widest uppercase block mb-0.5">Interactive Experience</span>
                    <h2 className="text-white text-2xl font-serif font-bold uppercase tracking-tight">The Astride Chair</h2>
                </div>

                {/* Beautiful 3D Model Card */}
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900/30 shadow-2xl backdrop-blur-md">
                    <LoadingScreen />
                    <div className="w-full h-full">
                        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} frameloop={isInView ? "always" : "demand"}>
                            <color attach="background" args={['#090807']} />
                            
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                            
                            <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />

                            <Suspense fallback={null}>
                                <EnvErrorBoundary>
                                    <Environment preset="studio" />
                                </EnvErrorBoundary>
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
                    
                    {/* Interaction helper overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10">
                        <div className="flex items-center gap-2 text-[10px] text-neutral-300">
                            <span className="inline-flex items-center gap-2 rounded px-1.5 py-0.5 bg-white/10 ring-1 ring-white/20 font-mono">
                                R3F • GLB
                            </span>
                            <div className="text-neutral-400">
                                Drag to rotate, pinch to zoom
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plain text listed after the model */}
                <div className="flex flex-col gap-4 mt-2">
                    <div 
                        className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center text-center shadow-lg animate-fade-in"
                        style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                        <span className="text-zinc-500 font-bold tracking-[0.25em] text-[10px] mb-1.5 block uppercase">
                            Why Astride?
                        </span>
                        <h3 className="text-white text-xl font-extrabold tracking-wider mb-2 uppercase">
                            Engineered for Excellence
                        </h3>
                        <p className="text-zinc-300 text-sm leading-relaxed font-normal">
                            Discover the ultimate ergonomic experience, meticulously crafted from the ground up. Rotate, zoom, and interact with the 3D model above to explore the premium craftsmanship and ergonomic design.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-[500vh] md:h-[400vh] bg-[#090807] overflow-visible">
            {/* Sticky Container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <LoadingScreen />
                <>
                    {/* DESKTOP LAYOUT: full screen canvas with overlay cards */}
                    {/* 3D Canvas — only rendered when in view to stop GPU loop off-screen */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} frameloop={isInView ? "always" : "demand"}>
                            <color attach="background" args={['#090807']} />
                            
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                            
                            <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
 
                            <Suspense fallback={null}>
                                <EnvErrorBoundary>
                                    <Environment preset="studio" />
                                </EnvErrorBoundary>
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
                                            ? 'items-start justify-center px-12 text-center pt-10'
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
                                            <h1 className="text-white text-6xl md:text-7xl font-sans font-black tracking-tight mb-4 drop-shadow-2xl uppercase">
                                                Why <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-sans font-black pr-2">Astride?</span>
                                            </h1>
                                            {sec.subtitle && (
                                                <p 
                                                    className="absolute bottom-[180px] left-1/2 -translate-x-1/2 text-white text-lg md:text-xl font-semibold tracking-wide w-full max-w-2xl text-center z-20 px-6"
                                                    style={{
                                                        textShadow: '0 2px 8px rgba(0,0,0,1), -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0px 0px 10px rgba(0,0,0,0.8)'
                                                    }}
                                                >
                                                    {sec.subtitle}
                                                </p>
                                            )}
                                            {/* Scroll indicator - absolute positioned at bottom of viewport */}
                                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20">
                                                <span className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Scroll to explore</span>
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
            </div>
        </div>
    );
}
