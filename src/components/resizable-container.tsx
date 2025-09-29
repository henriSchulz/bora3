'use client';

import React, { useRef, useLayoutEffect, useState, ReactNode } from 'react';

interface ResizableContainerProps {
  children: (size: { width: number; height: number }) => ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ResizableContainer({ children, className, style }: ResizableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children(containerSize)}
    </div>
  );
}