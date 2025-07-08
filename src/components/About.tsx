import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Octahedron } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import { aboutText } from '../utils/constants';
import DeveloperAvatar from './DeveloperAvatar';
import * as THREE from 'three';

// Floating geometric shapes for background
const FloatingShape = ({ 
  position, 
  geometry, 
  color, 
  scale = 1,
  speed = 1 
}: { 
  position: [number, number, number];
  geometry: 'sphere' | 'box' | 'octahedron';
  color: string;
  scale?: number;
  speed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed;
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.2;
    }
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[0.3 * scale, 16, 16]} />;
      case 'box':
        return <boxGeometry args={[0.4 * scale, 0.4 * scale, 0.4 * scale]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.35 * scale]} />;
      default:
        return <sphereGeometry args={[0.3 * scale, 16, 16]} />;
    }
  };

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        {renderGeometry()}
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
};

// Glowing particles system
const GlowingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.5 + positions[i3]) * 0.002;
        positions[i3] += Math.cos(time * 0.3 + i) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.02;
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
        size={0.05}
        color="#60a5fa"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Realistic Human Avatar with business casual attire
const RealisticAvatar = ({ isVisible }: { isVisible: boolean }) => {
  const avatarRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame((state) => {
    if (avatarRef.current && isVisible) {
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      avatarRef.current.scale.y = 1 + breathe;
      
      // Gentle sway
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Hover effect
      if (isHovered) {
        avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
      <group 
        ref={avatarRef}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {/* Head */}
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#fdbcb4"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 1.85, -0.05]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            color="#4a4a4a"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.08, 1.75, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        <mesh position={[0.08, 1.75, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        
        {/* Torso - Business Shirt */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* Suit Jacket */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.37, 0.42, 0.82, 8]} />
          <meshStandardMaterial
            color="#1f2937"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        
        {/* Tie */}
        <mesh position={[0, 1.2, 0.35]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.08, 0.4, 0.02]} />
          <meshStandardMaterial
            color="#dc2626"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.5, 1.0, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.5, 1.0, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        
        {/* Hands */}
        <mesh position={[-0.65, 0.65, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
        <mesh position={[0.65, 0.65, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
        
        {/* Legs - Dress Pants */}
        <mesh position={[-0.15, 0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
          <meshStandardMaterial
            color="#374151"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0.15, 0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
          <meshStandardMaterial
            color="#374151"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        
        {/* Shoes */}
        <mesh position={[-0.15, -0.15, 0.1]}>
          <boxGeometry args={[0.15, 0.08, 0.25]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0.15, -0.15, 0.1]}>
          <boxGeometry args={[0.15, 0.08, 0.25]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Laptop Icon
const LaptopIcon = () => {
  const laptopRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <group ref={laptopRef} position={[2.5, -1, 1]}>
        {/* Circle background */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial
            color="#1e40af"
            transparent
            opacity={0.8}
            emissive="#1e40af"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Laptop base */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* Laptop screen */}
        <mesh position={[0, 0.13, -0.08]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.28, 0.18, 0.01]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Code symbols floating around
const FloatingCodeSymbols = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
        <mesh position={[-2, 2, 0]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial
            color="#60a5fa"
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[2, 1.5, -0.5]}>
          <planeGeometry args={[0.4, 0.25]} />
          <meshStandardMaterial
            color="#a78bfa"
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-1.5, -1, 0.5]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshStandardMaterial
            color="#34d399"
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </>
  );
};

// Enhanced visual elements around the avatar
const VisualElements = () => {
  return (
    <>
      {/* Code symbols */}
      <FloatingCodeSymbols />
      
      {/* Geometric shapes */}
      <FloatingShape
        position={[-3, 0.5, -1]}
        geometry="sphere"
        color="#3b82f6"
        scale={0.8}
        speed={0.8}
      />
      <FloatingShape
        position={[3, -0.5, -1.5]}
        geometry="box"
        color="#8b5cf6"
        scale={0.6}
        speed={1.2}
      />
      <FloatingShape
        position={[-2.5, -1.5, 0.5]}
        geometry="octahedron"
        color="#06b6d4"
        scale={0.7}
        speed={1.0}
      />
      <FloatingShape
        position={[2.8, 2, -0.8]}
        geometry="sphere"
        color="#f59e0b"
        scale={0.5}
        speed={1.5}
      />
      <FloatingShape
        position={[0, 2.5, -2]}
        geometry="box"
        color="#ef4444"
        scale={0.9}
        speed={0.6}
      />
    </>
  );
};

// 3D Scene Component
const Scene3D = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#3b82f6" />
      
      {/* Main avatar */}
      <RealisticAvatar isVisible={isVisible} />
      
      {/* Laptop icon */}
      <LaptopIcon />
      
      {/* Visual elements */}
      <VisualElements />
      
      {/* Glowing particles */}
      <GlowingParticles />
    </>
  );
};

// Loading placeholder
const AvatarPlaceholder = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

// Error Boundary for 3D Scene
const Scene3DErrorBoundary = ({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Performance detection hook
const usePerformanceDetection = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    setIsLowPerformance(isMobile || hasLowMemory);
  }, []);
  
  return isLowPerformance;
};

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useIntersection(sectionRef);
  const isLowPerformance = usePerformanceDetection();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [use2DAvatar, setUse2DAvatar] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
      setUse2DAvatar(true);
    }
    
    // Force 2D avatar for better compatibility
    setUse2DAvatar(true);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Lazy load 3D avatar when section comes into view
  useEffect(() => {
    if (isInView && !isLowPerformance && webGLSupported && !use2DAvatar) {
      const timer = setTimeout(() => {
        setAvatarLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, isLowPerformance, webGLSupported, use2DAvatar]);

  return (
    <section id="about" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-pink-900/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Professional Developer Avatar - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 order-2 lg:order-1 flex items-center justify-center"
          >
            <DeveloperAvatar isVisible={isInView} />
          </motion.div>

          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              About <span className="gradient-text">Me</span>
            </motion.h2>

            <div className="space-y-6 text-gray-300">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg leading-relaxed"
              >
                {aboutText.intro}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg leading-relaxed"
              >
                {aboutText.philosophy}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg leading-relaxed"
              >
                {aboutText.experience}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg leading-relaxed"
              >
                {aboutText.interests}
              </motion.p>
            </div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 grid grid-cols-2 gap-6"
            >
              <motion.div 
                className="glass-card p-4 text-center cursor-pointer"
                whileHover={!prefersReducedMotion ? { 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)"
                } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-blue-400 mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  5+
                </motion.div>
                <div className="text-gray-400">Years Experience</div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-4 text-center cursor-pointer"
                whileHover={!prefersReducedMotion ? { 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)"
                } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-purple-400 mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.9, type: "spring", stiffness: 200 }}
                >
                  50+
                </motion.div>
                <div className="text-gray-400">Projects Completed</div>
              </motion.div>
            </motion.div>

            {/* Core Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">Core Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'GraphQL'].map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-600/30 hover:bg-blue-600/30 transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;