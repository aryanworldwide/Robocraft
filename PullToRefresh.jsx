import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children, threshold = 70 }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const pullDistRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => { onRefreshRef.current = onRefresh; }, [onRefresh]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY <= 0 && !refreshingRef.current) {
        startYRef.current = e.touches[0].clientY;
        pullingRef.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pullingRef.current || refreshingRef.current) return;
      const diff = e.touches[0].clientY - startYRef.current;
      if (diff > 0 && window.scrollY <= 0) {
        e.preventDefault();
        const dist = Math.min(diff * 0.4, threshold * 1.5);
        pullDistRef.current = dist;
        setPullDistance(dist);
      }
    };

    const handleTouchEnd = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      if (pullDistRef.current >= threshold) {
        refreshingRef.current = true;
        setIsRefreshing(true);
        setPullDistance(threshold);
        try {
          await onRefreshRef.current?.();
        } finally {
          refreshingRef.current = false;
          setIsRefreshing(false);
          pullDistRef.current = 0;
          setPullDistance(0);
        }
      } else {
        pullDistRef.current = 0;
        setPullDistance(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold]);

  return (
    <div
      className="transition-transform duration-200 ease-out"
      style={{
        transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        willChange: 'transform',
      }}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div className="flex items-center justify-center overflow-hidden" style={{ height: pullDistance }}>
          <RefreshCw
            className={`w-5 h-5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ opacity: Math.min(pullDistance / threshold, 1) }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
