import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import { skills } from '../utils/constants';
import * as THREE from 'three';

const SkillCube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      cubeRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      cubeRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Box ref={cubeRef} args={[2, 2, 2]}>
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.7}
        wireframe
      />
    </Box>
  );
};

const SkillBar = ({ skill, index, isVisible }: { skill: any, index: number, isVisible: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-medium flex items-center gap-2">
          <span className="text-lg">{skill.icon}</span>
          {skill.name}
        </span>
        <span className="text-blue-400 font-semibold">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
        />
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useIntersection(sectionRef);
  const [activeCategory, setActiveCategory] = useState('frontend');

  const categories = [
    { key: 'frontend', label: 'Frontend', icon: '🎨' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'database', label: 'Database', icon: '🗄️' },
    { key: 'devops', label: 'DevOps', icon: '🚀' },
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 h-80"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <SkillCube />
            </Canvas>
          </motion.div>

          {/* Skills Content */}
          <div className="lg:col-span-2">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category.key
                      ? 'bg-blue-600 text-white'
                      : 'glass-card text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>

            {/* Skills List */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-6 capitalize">
                {activeCategory} Technologies
              </h3>
              <div className="space-y-4">
                {skills[activeCategory as keyof typeof skills].map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    index={index}
                    isVisible={isInView}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;