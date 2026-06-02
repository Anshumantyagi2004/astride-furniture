'use client';
import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
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
        return isMobile ? baseScale * 0.65 : baseScale;
    }, [clonedScene, isMobile]);

    return <primitive object={clonedScene} scale={scale} castShadow receiveShadow />;
};

const CameraRig = ({ progressRef, isMobile }: { progressRef: React.MutableRefObject<number>; isMobile: boolean }) => {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3(0, 0, 5));
    const targetLook = useRef(new THREE.Vector3(0, 0, 0));
    const currentLook = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        const o = progressRef.current;
        const zoom = isMobile ? 1.6 : 1.0;

        if (o < 0.15) {
            // Intro: Wide Shot of the entire chair (Centered)
            targetPos.current.set(0, 0, 5.0 * zoom);
            targetLook.current.set(0, 0, 0);
        } else if (o >= 0.15 && o < 0.4) {
            // Section 1: Premium Headrest (Top of the chair)
            targetPos.current.set(-1.0 * zoom, 1.3, 1.6 * zoom);
            targetLook.current.set(0, 1.3, 0);
        } else if (o >= 0.4 && o < 0.65) {
            // Section 2: Lumbar Support (Middle back)
            targetPos.current.set(1.5 * zoom, -0.2, 1.5 * zoom);
            targetLook.current.set(0, -0.2, 0);
        } else if (o >= 0.65 && o < 0.9) {
            // Section 3: Armrests (Side middle)
            targetPos.current.set(-1.6 * zoom, 0.1, 1.2 * zoom);
            targetLook.current.set(0, 0.1, 0);
        } else {
            // Section 4: Wheels & Base (Bottom of the chair)
            targetPos.current.set(1.5 * zoom, -1.0, 1.8 * zoom);
            targetLook.current.set(0, -1.2, 0);
        }

        // Slowly rotate the model continuously to show it off
        const time = state.clock.getElapsedTime();
        const radius = Math.sqrt(targetPos.current.x ** 2 + targetPos.current.z ** 2);
        const angle = Math.atan2(targetPos.current.z, targetPos.current.x) + time * 0.1;
        targetPos.current.x = Math.cos(angle) * radius;
        targetPos.current.z = Math.sin(angle) * radius;

        // Use Vector3's built-in lerp to gracefully move the camera
        camera.position.lerp(targetPos.current, 4 * delta);
        currentLook.current.lerp(targetLook.current, 4 * delta);
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
    
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);

    useEffect(() => {
        setMounted(true);
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Calculate progress through the 400vh container
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
            else if (progress >= 0.65 && progress < 0.9) section = 3;
            else section = 4;
            
            setActiveSection(section);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            handleScroll();
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div ref={containerRef} className="relative w-full h-[400vh] bg-[#090807] overflow-visible">
            {/* Sticky Container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
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
                            <CameraRig progressRef={progressRef} isMobile={isMobile} />
                        </Suspense>
                    </Canvas>
                </div>

                {/* HTML Overlay text cards dynamically shown based on activeSection */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none px-6">
                    {SECTIONS.map((sec, index) => {
                        const isActive = activeSection === index;
                        
                        return (
                            <div
                                key={index}
                                className={`absolute transition-all duration-700 ease-in-out px-6 md:px-12 w-full max-w-7xl flex ${
                                    sec.align === 'center' 
                                        ? 'justify-center text-center' 
                                        : sec.align === 'left' 
                                            ? 'justify-start text-left' 
                                            : 'justify-end text-left'
                                } ${
                                    isActive 
                                        ? 'opacity-100 translate-y-0 scale-100 visible' 
                                        : 'opacity-0 translate-y-8 scale-95 invisible pointer-events-none'
                                }`}
                            >
                                {sec.align === 'center' ? (
                                    <div className="max-w-2xl flex flex-col items-center">
                                        <h1 className="text-white text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4 drop-shadow-2xl uppercase">
                                            {sec.title}
                                        </h1>
                                        {sec.subtitle && (
                                            <p className="text-zinc-400 text-lg md:text-xl font-medium tracking-wide">
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
                                        <h2 className="text-white text-3xl md:text-4xl font-serif font-bold mb-4">
                                            {sec.title}
                                        </h2>
                                        {sec.desc && (
                                            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                                                {sec.desc}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
