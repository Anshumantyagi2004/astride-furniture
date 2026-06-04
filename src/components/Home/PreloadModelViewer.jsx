'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D viewer — only after the trigger fires
const ModelViewer = dynamic(() => import('@/components/Home/3d_Viewer_glb'), { ssr: false });

/**
 * This component sits in the page where ModelViewer should render.
 * It uses an IntersectionObserver with a large rootMargin so it starts
 * loading the heavy Three.js bundle ~one full screen BEFORE the user
 * actually scrolls to this section (i.e., while they're still on VideoTestimonials).
 * 
 * By the time they finish watching VideoTestimonials and scroll down,
 * the 3D model is already loaded and ready — no 2-3 second pop-in delay.
 */
export default function PreloadModelViewer() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect(); // Only need to trigger once
        }
      },
      {
        // Start loading when this element is 100% of the viewport height ABOVE the viewport
        // i.e., as soon as VideoTestimonials (the section above) is visible
        rootMargin: '100% 0px 0px 0px',
      }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={triggerRef}>
      {shouldLoad ? (
        <ModelViewer />
      ) : (
        // Placeholder with matching background — invisible, zero cost
        <div style={{ background: '#090807' }} />
      )}
    </div>
  );
}
