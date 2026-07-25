'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D viewer immediately with SSR disabled
const ModelViewer = dynamic(() => import('@/components/Home/3d_Viewer_glb'), { ssr: false });

/**
 * PreloadModelViewer renders the 3D viewer immediately on client mount
 * so that it is fully loaded and ready regardless of scroll speed.
 */
export default function PreloadModelViewer() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="hidden md:block">
      <ModelViewer />
    </div>
  );
}
