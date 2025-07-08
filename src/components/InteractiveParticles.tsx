import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  isScattered: boolean;
  returnSpeed: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const InteractiveParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Theme colors matching the website
  const colors = [
    '#3b82f6', // blue-500
    '#8b5cf6', // purple-500
    '#06b6d4', // cyan-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#10b981', // emerald-500
  ];

  // Initialize particles
  const initializeParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(100, Math.max(50, Math.floor((width * height) / 15000)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      particles.push({
        id: i,
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.2, // Slower initial movement
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 3 + 2, // 2-5px
        opacity: Math.random() * 0.2 + 0.3, // 30-50% opacity
        speed: Math.random() * 0.2 + 0.1, // Reduced speed
        color: colors[Math.floor(Math.random() * colors.length)],
        isScattered: false,
        returnSpeed: Math.random() * 0.01 + 0.005, // Slower return speed
      });
    }

    particlesRef.current = particles;
  }, [colors]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // Update particle positions
  const updateParticles = useCallback((width: number, height: number) => {
    const mouse = mouseRef.current;
    const scatterRadius = 100;
    const scatterForce = 0.8; // Reduced scatter force

    particlesRef.current.forEach((particle) => {
      // Calculate distance to mouse
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Scatter effect when mouse is nearby
      if (distance < scatterRadius && distance > 0) {
        const force = (scatterRadius - distance) / scatterRadius;
        const angle = Math.atan2(dy, dx);
        
        particle.vx += Math.cos(angle) * force * scatterForce;
        particle.vy += Math.sin(angle) * force * scatterForce;
        particle.isScattered = true;
      }

      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Return to original position gradually
      if (particle.isScattered && distance > scatterRadius) {
        const returnDx = particle.originalX - particle.x;
        const returnDy = particle.originalY - particle.y;
        const returnDistance = Math.sqrt(returnDx * returnDx + returnDy * returnDy);

        if (returnDistance > 1) {
          particle.vx += returnDx * particle.returnSpeed;
          particle.vy += returnDy * particle.returnSpeed;
        } else {
          particle.isScattered = false;
        }
      }

      // Apply friction
      particle.vx *= 0.98; // Increased friction
      particle.vy *= 0.98;

      // Normal floating movement when not scattered
      if (!particle.isScattered) {
        particle.vx += (Math.random() - 0.5) * 0.01; // Reduced random movement
        particle.vy += (Math.random() - 0.5) * 0.01;
        
        // Limit normal movement speed
        const normalSpeed = 0.3; // Reduced speed limit
        if (Math.abs(particle.vx) > normalSpeed) particle.vx = normalSpeed * Math.sign(particle.vx);
        if (Math.abs(particle.vy) > normalSpeed) particle.vy = normalSpeed * Math.sign(particle.vy);
      }

      // Handle edge fading and wrapping
      const fadeZone = 50;
      let edgeOpacity = 1;

      if (particle.x < fadeZone) {
        edgeOpacity = particle.x / fadeZone;
      } else if (particle.x > width - fadeZone) {
        edgeOpacity = (width - particle.x) / fadeZone;
      }

      if (particle.y < fadeZone) {
        edgeOpacity = Math.min(edgeOpacity, particle.y / fadeZone);
      } else if (particle.y > height - fadeZone) {
        edgeOpacity = Math.min(edgeOpacity, (height - particle.y) / fadeZone);
      }

      // Wrap around edges
      if (particle.x < -10) {
        particle.x = width + 10;
        particle.originalX = Math.random() * width;
      } else if (particle.x > width + 10) {
        particle.x = -10;
        particle.originalX = Math.random() * width;
      }

      if (particle.y < -10) {
        particle.y = height + 10;
        particle.originalY = Math.random() * height;
      } else if (particle.y > height + 10) {
        particle.y = -10;
        particle.originalY = Math.random() * height;
      }

      // Apply edge opacity
      particle.opacity = Math.max(0, Math.min(0.5, particle.opacity * edgeOpacity));
    });
  }, []);

  // Render particles
  const renderParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particlesRef.current.forEach((particle) => {
      ctx.save();
      
      // Create gradient for each particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${particle.color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    updateParticles(canvas.width, canvas.height);
    renderParticles(ctx);

    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, renderParticles]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    
    setDimensions({ width: innerWidth, height: innerHeight });
    initializeParticles(innerWidth, innerHeight);
  }, [initializeParticles]);

  // Initialize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Start animation
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, dimensions]);

  // Add mouse event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{
        background: 'transparent',
      }}
    />
  );
};

export default InteractiveParticles;