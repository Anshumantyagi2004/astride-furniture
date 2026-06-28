"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function MapSection() {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use IntersectionObserver to lazy-load the iframe only when in view
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setLoaded(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });

    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[350px] md:h-[480px] rounded-[24px] overflow-hidden relative border border-slate-100">
      {!loaded ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white flex items-center justify-center">
          <div className="text-center text-sm text-slate-500">
            <div className="mb-2 font-semibold">Map preview</div>
            <div className="text-xs">Scroll or click to load the interactive map</div>
            <button
              onClick={() => setLoaded(true)}
              className="mt-3 inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
            >
              Load Map
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src="https://maps.google.com/maps?q=Astride%20Furniture,%20J-113%20%26%20114,%20DSIIDC%20Industrial%20Area,%20Sector%204,%20Bawana,%20New%20Delhi,%20Delhi%20110039&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 transition-opacity duration-500 opacity-100"
        />
      )}
    </div>
  );
}
