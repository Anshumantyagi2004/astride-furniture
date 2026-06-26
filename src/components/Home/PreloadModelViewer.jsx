'use client';
import dynamic from 'next/dynamic';

// Dynamically import the 3D viewer immediately with SSR disabled
const ModelViewer = dynamic(() => import('@/components/Home/3d_Viewer_glb'), { ssr: false });

/**
 * PreloadModelViewer renders the 3D viewer immediately on client mount
 * so that it is fully loaded and ready regardless of scroll speed.
 */
export default function PreloadModelViewer() {
  return (
    <div className="hidden md:block">
      <ModelViewer />
    </div>
  );
}
