'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function LazySection({ children, minHeight = '100vh', margin = '300px' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin });

    return (
        <div ref={ref} style={{ minHeight: isInView ? 'auto' : minHeight, width: '100%' }}>
            {isInView && children}
        </div>
    );
}
