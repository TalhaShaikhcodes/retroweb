'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizablePanelsProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 480,
  minLeftWidth = 320,
  maxLeftWidth = 800,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      // Clamp width between min and max
      const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth));
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden">
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}px` }}
        className="flex-shrink-0 border-r border-gray-800"
      >
        {leftPanel}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`w-1 cursor-col-resize hover:bg-purple-500 transition-colors relative group ${
          isDragging ? 'bg-purple-500' : 'bg-transparent'
        }`}
      >
        {/* Visual indicator on hover */}
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-12 bg-purple-500 rounded-full" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 min-w-0">
        {rightPanel}
      </div>
    </div>
  );
}
