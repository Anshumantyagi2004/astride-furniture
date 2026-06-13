"use client";

import React, { Suspense, useRef, useEffect, useState, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center, OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';

interface SectionData {
    title: string;
    subtitle?: string;
    desc?: string;
    badge?: string;
    align: 'center' | 'left' | 'right';
}

// Static sections data map pulled out of render cycles to isolate heap allocations
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

// Pre-allocated mathematical vectors used in continuous frame loops to reduce garbage collector workload
const targetPosVec = new THREE.Vector3(0, 0, 5);
const targetLookVec = new THREE.Vector3(0, 0, 0);
const currentLookVec = new THREE.Vector3(0, 0, 0);

function LoadingScreen() {
    const { progress } = useProgress();
    const [visible, setVisible] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
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
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.25em]">
                Loading 3D Experience {Math.round(hasLoaded ? 100 : progress)}%
            </p>
        </div>
    );
}

class EnvErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
        console.warn("Environment failed to load:", error);
        return { hasError: true };
    }
    override render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// Memoized vertex primitive container
const Model = memo(({ url, isMobile }: { url: string; isMobile: boolean }) => {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    const scale = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = (3 / (maxDim || 1)) * 0.9;
        return isMobile ? baseScale * 0.7 : baseScale;
    }, [clonedScene, isMobile]);

    return <primitive object={clonedScene} scale={scale} castShadow receiveShadow />;
});
Model.displayName = "Model";

const CameraRig = ({ progressRef, isMobile, isInteracting }: { progressRef: React.MutableRefObject<number>; isMobile: boolean; isInteracting: boolean }) => {
    const { camera } = useThree();

    useFrame((state, delta) => {
        const o = progressRef.current;
        const s = isMobile ? 0.7 : 1.0;
        const zoom = isMobile ? 1.1 : 1.0;
        const dScale = isMobile ? 1.0 : 1.4;

        // Shared camera interpolation matrix targets
        if (o < 0.15) {
            targetPosVec.set(0, 0, (isMobile ? 3.6 : 6.2) * zoom);
            targetLookVec.set(0, 0, 0);
        } else if (o >= 0.15 && o < 0.4) {
            targetPosVec.set(-1.0 * zoom * dScale, 1.15 * s, 1.6 * zoom * dScale);
            targetLookVec.set(0, 1.05 * s, 0);
        } else if (o >= 0.4 && o < 0.65) {
            targetPosVec.set(1.5 * zoom * dScale, -0.2 * s, 1.5 * zoom * dScale);
            targetLookVec.set(0, -0.2 * s, 0);
        } else if (o >= 0.65 && o < 0.8) {
            targetPosVec.set(-1.6 * zoom * dScale, 0.1 * s, 1.2 * zoom * dScale);
            targetLookVec.set(0, 0.1 * s, 0);
        } else {
            targetPosVec.set(1.5 * zoom * dScale, -1.0 * s, 1.8 * zoom * dScale);
            targetLookVec.set(0, -1.2 * s, 0);
        }

        if (isInteracting) return;

        // Retrieve active controls from internal frame instance safely (Fixes Error #1)
        const activeControls = state.controls as any;
        if (activeControls && activeControls.target) {
            activeControls.target.lerp(targetLookVec, 8 * delta);
        }

        // Ambient auto-rotation matrix calculations
        const time = state.clock.getElapsedTime();
        const radius = Math.sqrt(targetPosVec.x ** 2 + targetPosVec.z ** 2);
        const angle = Math.atan2(targetPosVec.z, targetPosVec.x) + time * 0.05;
        targetPosVec.x = Math.cos(angle) * radius;
        targetPosVec.z = Math.sin(angle) * radius;

        camera.position.lerp(targetPosVec, 6.1 * delta);
        currentLookVec.lerp(targetLookVec, 6.1 * delta);
        camera.lookAt(currentLookVec);
    });
    return null;
};

export default function ModelViewer({ url = '/3D_asset_glb/a3.glb' }: { url?: string }) {
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isInView, setIsInView] = useState(true);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<number>(0);
    // Platform-agnostic layout reference typing signature (Fixes Error #2)
    const interactTimeoutRef = useRef<any>(null);

    const handleInteractionStart = () => {
        setIsInteracting(true);
        if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    };

    const handleInteractionEnd = () => {
        if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
        interactTimeoutRef.current = setTimeout(() => {
            setIsInteracting(false);
        }, 600);
    };

    useEffect(() => {
        setMounted(true);
        setIsMobile(window.innerWidth < 768);
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Visibility observer handles pausing WebGL render processes when scrolled off-screen
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

    // Active tracking observer layers: Scroll monitors for desktop, Intersection blocks for mobile (Fixes Bug #4)
    useEffect(() => {
        if (!mounted) return;

        if (isMobile) {
            // Mobile Optimization: Intersection tracking links textual highlights to active camera angle offsets seamlessly
            const mobileCardBlocks = document.querySelectorAll('.mobile-text-card-trigger');
            const mobileObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const targetIdx = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setActiveSection(targetIdx);
                        
                        // Map progress intervals linearly based on target items
                        const progressionMap = [0, 0.28, 0.53, 0.73, 1.0];
                        progressRef.current = progressionMap[targetIdx];
                    }
                });
            }, { threshold: 0.6, rootMargin: "-10% 0px -20% 0px" });

            mobileCardBlocks.forEach(block => mobileObserver.observe(block));
            return () => mobileObserver.disconnect();
        }

        // Native smooth tracker parameters for desktop
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const totalScrollable = rect.height - viewHeight;
            if (totalScrollable <= 0) return;

            let progress = -rect.top / totalScrollable;
            progress = Math.min(Math.max(progress, 0), 1);
            progressRef.current = progress;
            
            let section = 0;
            if (progress < 0.15) section = 0;
            else if (progress >= 0.15 && progress < 0.4) section = 1;
            else if (progress >= 0.4 && progress < 0.65) section = 2;
            else if (progress >= 0.65 && progress < 0.8) section = 3;
            else section = 4;
            
            setActiveSection((prev) => (prev !== section ? section : prev));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
        };
    }, [mounted, isMobile]);

    if (!mounted) return null;

    if (isMobile) {
        return (
            <div ref={containerRef} className="w-full bg-[#090807] pt-2 pb-10 px-8 flex flex-col gap-6">
                <div className="text-center">
                    <span className="text-zinc-500 text-[10px] tracking-widest uppercase block mb-0.5">Interactive Experience</span>
                    <h2 className="text-white text-2xl font-serif font-bold uppercase tracking-tight">The Astride Chair</h2>
                </div>

                {/* Sticky model viewport area */}
                <div className="sticky top-4 relative w-full h-[400px] rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900/30 shadow-2xl backdrop-blur-md z-30">
                    {/* Subtle glow effect behind model */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-[#8B5CF6]/10 via-[#EC4899]/5 to-[#F97316]/10 rounded-full blur-[80px] pointer-events-none z-0" />
                    <LoadingScreen />
                    <div className="w-full h-full">
                        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} frameloop={isInView ? "always" : "demand"}>
                            <color attach="background" args={['#090807']} />
                            
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                            
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

                {/* Mobile descriptions render loop layout links focus cameras sequentially on intersection scroll paths */}
                <div className="flex flex-col gap-5 mt-4 z-10 relative">
                    {SECTIONS.map((sec, idx) => (
                        <div 
                            key={idx}
                            data-index={idx}
                            className={`mobile-text-card-trigger bg-zinc-950/50 border rounded-2xl p-6 flex flex-col justify-center text-center shadow-lg transition-all duration-300 ${
                                activeSection === idx ? 'border-orange-500 bg-zinc-900/70 scale-100' : 'border-white/5 opacity-50 scale-95'
                            }`}
                            style={{ fontFamily: '"Inter", sans-serif' }}
                        >
                            <span className="text-orange-500 font-bold tracking-[0.25em] text-[10px] mb-1.5 block uppercase">
                                {sec.badge || "Why Astride?"}
                            </span>
                            <h3 className="text-white text-xl font-extrabold tracking-wider mb-2 uppercase">
                                {sec.title}
                            </h3>
                            <p className="text-zinc-300 text-sm leading-relaxed font-normal">
                                {sec.desc || sec.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-[500vh] md:h-[400vh] bg-[#090807] overflow-visible">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <LoadingScreen />
                <>
                    <div className="absolute inset-0 w-full h-full z-0">
                        {/* Subtle glow effect behind model */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] bg-gradient-to-tr from-[#8B5CF6]/15 via-[#EC4899]/5 to-[#F97316]/10 rounded-full blur-[120px] pointer-events-none z-0" />
                        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} frameloop={isInView ? "always" : "demand"}>
                            <color attach="background" args={['#090807']} />
                            
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                            
                            <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
 
                            <Suspense fallback={null}>
                                <Center position={[0, -0.3, 0]}>
                                    <Model url={url} isMobile={isMobile} />
                                </Center>
                                <CameraRig progressRef={progressRef} isMobile={isMobile} isInteracting={false} />
                            </Suspense>
                        </Canvas>
                    </div>

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
                                                        textShadow: '0 2px 8px rgba(0,0,0,1), -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, -1.5px 1.5px 0 #000, 0px 0px 10px rgba(0,0,0,0.8)'
                                                    }}
                                                >
                                                    {sec.subtitle}
                                                </p>
                                            )}
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