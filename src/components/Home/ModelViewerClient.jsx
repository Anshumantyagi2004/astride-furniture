'use client';
import dynamic from 'next/dynamic';

// This is a Client Component wrapper so we can use ssr:false
// (ssr:false is only allowed in Client Components, not Server Components)
const ModelViewer = dynamic(() => import('@/components/Home/3d_Viewer_glb'), { ssr: false });

export default function ModelViewerClient() {
  return <ModelViewer />;
}
