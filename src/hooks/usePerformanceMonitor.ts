import { useEffect, useState, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  isLowPerformance: boolean;
  frameTime: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false,
    frameTime: 16.67
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  
  useEffect(() => {
    let animationId: number;
    
    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      
      frameCount.current++;
      
      if (delta >= 1000) { // Update every second
        const fps = Math.round((frameCount.current * 1000) / delta);
        const frameTime = delta / frameCount.current;
        
        // Keep history of last 5 FPS measurements
        fpsHistory.current.push(fps);
        if (fpsHistory.current.length > 5) {
          fpsHistory.current.shift();
        }
        
        // Calculate average FPS
        const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
        
        // Consider low performance if average FPS is below 30
        const isLowPerformance = avgFps < 30;
        
        setMetrics({
          fps: Math.round(avgFps),
          isLowPerformance,
          frameTime
        });
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };
    
    animationId = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return metrics;
};