import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { Download, Mail, Github, Linkedin, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { personalInfo } from '../utils/constants';

// Performance detection hook
const usePerformanceDetection = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    // Check device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setIsLowPerformance(true);
      return;
    }
    
    // Check for mobile or low-end devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasSlowConnection = (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g';
    
    setIsLowPerformance(isMobile || hasLowMemory || hasSlowConnection);
  }, []);
  
  return isLowPerformance;
};



// Optimized particle system with reduced count for mobile
const ParticleField = ({ isLowPerformance }: { 
  isLowPerformance: boolean;
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = isLowPerformance ? 30 : 60;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Continuous floating movement
        positions[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.01;
        positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.15) * 0.008;
        positions[i3 + 2] += Math.sin(time * 0.4 + i * 0.2) * 0.012;
        
        // Wrap around boundaries
        if (positions[i3] > 10) positions[i3] = -10;
        if (positions[i3] < -10) positions[i3] = 10;
        if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
        if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
        if (positions[i3 + 2] > 10) positions[i3 + 2] = -10;
        if (positions[i3 + 2] < -10) positions[i3 + 2] = 10;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Gentle continuous rotation
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isLowPerformance ? 0.03 : 0.05}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Morphing geometry with controlled rotation speed
const MorphingGeometry = ({ 
  isLowPerformance 
}: { 
  isLowPerformance: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Smooth autonomous rotation
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.z = Math.sin(time * 0.25) * 0.1;
      
      // Subtle scale animation
      const scale = 1 + Math.sin(time * 0.4) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (isLowPerformance) {
    return null; // Skip complex geometry on low-performance devices
  }

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.7}
          roughness={0.3}
          metalness={0.7}
          wireframe
        />
      </mesh>
    </Float>
  );
};

// Floating elements with minimum distance and controlled movement
const FloatingElement = ({ 
  position, 
  geometry, 
  color,
  isLowPerformance,
  index
}: { 
  position: [number, number, number];
  geometry: 'sphere' | 'box' | 'torus';
  color: string;
  isLowPerformance: boolean;
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + index * 0.5; // Offset for each element
      
      // Calculate smooth autonomous movement
      const offsetX = Math.sin(time * 0.3) * 0.2;
      const offsetY = Math.cos(time * 0.2) * 0.15;
      
      meshRef.current.position.x = position[0] + offsetX;
      meshRef.current.position.y = position[1] + offsetY;
      
      // Gentle rotation
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
    }
  });

  const GeometryComponent = {
    sphere: () => <sphereGeometry args={[0.25]} />,
    box: () => <boxGeometry args={[0.3, 0.3, 0.3]} />,
    torus: () => <torusGeometry args={[0.25, 0.08, 12, 24]} />,
  }[geometry];

  return (
    <Float 
      speed={isLowPerformance ? 0.5 : 1} 
      rotationIntensity={isLowPerformance ? 0.3 : 0.5} 
      floatIntensity={isLowPerformance ? 0.2 : 0.3}
    >
      <mesh ref={meshRef} position={position}>
        <GeometryComponent />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
};

// Fallback 2D version for low-performance devices
const Fallback2DBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-2000" />
    </div>
  );
};

// Optimized 3D scene with performance controls
const Scene = ({ 
  isLowPerformance 
}: { 
  isLowPerformance: boolean;
}) => {
  const elements = useMemo(() => [
    { position: [-2.5, 1.5, -1.5] as [number, number, number], geometry: 'sphere' as const, color: '#3b82f6' },
    { position: [2.5, -1, -1] as [number, number, number], geometry: 'box' as const, color: '#8b5cf6' },
    { position: [-1.5, -1.5, 0.5] as [number, number, number], geometry: 'torus' as const, color: '#06b6d4' },
    { position: [1.8, 1.8, -2] as [number, number, number], geometry: 'sphere' as const, color: '#f59e0b' },
    { position: [0, -2.5, 0] as [number, number, number], geometry: 'box' as const, color: '#ef4444' },
  ], []);

  return (
    <>
      {!isLowPerformance && (
        <>
          <Stars 
            radius={50} 
            depth={50} 
            count={300} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
          <AnimatedStars count={150} />
        </>
      )}
      
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      {!isLowPerformance && (
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#8b5cf6" />
      )}
      
      <ParticleField isLowPerformance={isLowPerformance} />
      <MorphingGeometry isLowPerformance={isLowPerformance} />
      
      {elements.slice(0, isLowPerformance ? 3 : 5).map((element, index) => (
        <FloatingElement
          key={index}
          position={element.position}
          geometry={element.geometry}
          color={element.color}
          isLowPerformance={isLowPerformance}
          index={index}
        />
      ))}
    </>
  );
};

// Animated stars component for continuous movement
const AnimatedStars = ({ count = 200 }: { count?: number }) => {
  const starsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate the entire star field
      starsRef.current.rotation.x = time * 0.01;
      starsRef.current.rotation.y = time * 0.02;
      
      // Make individual stars twinkle
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Add subtle movement to each star
        positions[i3] += Math.sin(time * 0.1 + i) * 0.001;
        positions[i3 + 1] += Math.cos(time * 0.1 + i) * 0.001;
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={false}
      />
    </points>
  );
};

// Custom cursor component
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', moveCursor);
    
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference transition-transform duration-200 ${
        isHovering ? 'scale-150' : 'scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

// Typewriter effect
const TypewriterText = ({ 
  texts, 
  delay = 100,
  pauseDelay = 2000 
}: { 
  texts: string[];
  delay?: number;
  pauseDelay?: number;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    if (!isDeleting && currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + currentText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === currentText.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDelay);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, delay / 2);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex === 0) {
      setIsDeleting(false);
      setCurrentTextIndex(prev => (prev + 1) % texts.length);
    }
  }, [currentIndex, delay, pauseDelay, texts, currentTextIndex, isDeleting]);

  return (
    <span className="relative">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Smooth Vertical Animation Component
const SmoothVerticalFloat = ({ 
  children, 
  distance = 20, 
  duration = 3, 
  delay = 0 
}: { 
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const isLowPerformance = usePerformanceDetection();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // const handleMouseMove = useCallback((e: React.MouseEvent) => {
  //   const rect = e.currentTarget.getBoundingClientRect();
  //   const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
  //   const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
  //   mouseX.set(x * 0.3); // Apply sensitivity here too
  //   mouseY.set(y * 0.3);
  // }, [mouseX, mouseY]);

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Akshay_Resume.pdf'; // Uses the actual file in the public folder
    link.download = 'Akshay_Dobariya_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const roles = [
    "Senior Full-Stack Developer",
    "React Specialist", 
    "Node.js Expert",
    "Cloud Architect",
    "Tech Lead"
  ];

  return (
    <>
      {!prefersReducedMotion && !isLowPerformance && <CustomCursor />}
      
      {/* Interactive Particle Background */}
      {/* <InteractiveParticles />s */}
      
      <section 
        id="hero" 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        // onMouseMove={handleMouseMove}
      >
        {/* 3D Background or Fallback */}
        {isLowPerformance ? (
          <Fallback2DBackground />
        ) : (
          <div className="absolute inset-0 z-0">
            <Canvas 
              camera={{ position: [0, 0, 5], fov: 75 }}
              dpr={[1, isLowPerformance ? 1 : 2]}
              performance={{ min: 0.5 }}
              frameloop="always" // Continuous rendering for animations
            >
              <Scene isLowPerformance={isLowPerformance} />
            </Canvas>
          </div>
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 z-10" />

        {/* Content */}
        <motion.div 
          className="relative z-20 text-center max-w-4xl mx-auto px-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="mb-8"
          >
            <motion.div 
              className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative group cursor-pointer"
              whileHover={!prefersReducedMotion ? { 
                scale: 1.1, 
                borderColor: "rgba(59, 130, 246, 0.5)",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
              } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Akshay Dobariya"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </motion.div>
          
          {/* Name */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span 
              className="gradient-text inline-block"
              whileHover={!prefersReducedMotion ? { 
                scale: 1.05,
                textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
              } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Akshay Dobariya
            </motion.span>
          </motion.h1>
          
          {/* Animated Role Text */}
          <motion.div 
            className="text-xl md:text-2xl text-gray-300 mb-6 h-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <TypewriterText texts={roles} delay={100} pauseDelay={2000} />
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Crafting exceptional digital experiences with modern technologies. 
            Specializing in React, Node.js, and cloud architecture.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              onClick={downloadCV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 relative overflow-hidden group min-h-[44px]"
              whileHover={!prefersReducedMotion ? { 
                scale: 1.05, 
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" 
              } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Download size={20} className="relative z-10" />
              <span className="relative z-10">Download CV</span>
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 relative overflow-hidden group min-h-[44px]"
              whileHover={!prefersReducedMotion ? { 
                scale: 1.05,
                borderColor: "rgba(139, 92, 246, 1)"
              } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Mail size={20} />
              Contact Me
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { icon: Github, href: personalInfo.github, color: "hover:text-gray-300" },
              { icon: Linkedin, href: personalInfo.linkedIn, color: "hover:text-blue-400" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 ${social.color} transition-all duration-300 p-3 rounded-full glass-card min-h-[44px] min-w-[44px] flex items-center justify-center`}
                whileHover={!prefersReducedMotion ? { 
                  scale: 1.2, 
                  rotate: 5,
                  boxShadow: "0 5px 15px rgba(59, 130, 246, 0.2)"
                } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator with Smooth Vertical Animation */}
        <motion.div 
          className="absolute bottom-8  transform -translate-x-1/2 cursor-pointer z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          onClick={scrollToNext}
          whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
          whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
        >
          <SmoothVerticalFloat 
            distance={15} 
            duration={2.5} 
            delay={0}
          >
            <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
              <span className="text-sm font-medium">Scroll Down</span>
              <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center relative">
                <div 
                  className="w-1 h-3 bg-current rounded-full mt-2"
                />
              </div>
              <ArrowDown size={16} />
            </div>
          </SmoothVerticalFloat>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;