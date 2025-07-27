import React from 'react';
import { motion } from 'framer-motion';
import { Code, Laptop, Coffee, Terminal } from 'lucide-react';

interface DeveloperAvatarProps {
  isVisible?: boolean;
  className?: string;
}

const DeveloperAvatar: React.FC<DeveloperAvatarProps> = ({ 
  isVisible = true, 
  className = "" 
}) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Main Avatar Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Background Circle */}
        <div className="w-[26rem] h-[26rem] md:w-[32rem] md:h-[32rem] relative flex items-center justify-center">
          {/* Outer Gradient Circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full backdrop-blur-sm border border-white/10 z-0" />
          {/* White/transparent circular background for avatar */}
          <div className="absolute inset-6 md:inset-8 bg-white/80 dark:bg-white/10 rounded-full z-10 shadow-2xl" />
          {/* Avatar Image with floating animation */}
          <motion.img
            src="/vecteezy_boy-standing-holding-laptop-with-left-hand-giving-thumbs-up_11006184.png"
            alt="Developer Avatar"
            className="relative z-20 select-none object-contain max-w-[22rem] max-h-[22rem] md:max-w-[28rem] md:max-h-[28rem] mx-auto my-auto"
            draggable={false}
            animate={{
              y: [-18, 18],
              rotate: [2, -2]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          {/* Floating Code Elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-4 -left-4"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
              <Code size={20} className="text-blue-400" />
            </div>
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -top-2 -right-6"
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
              <Terminal size={16} className="text-purple-400" />
            </div>
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-6 -left-6"
          >
            <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
              <Laptop size={24} className="text-cyan-400" />
            </div>
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 2.8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute -bottom-4 -right-8"
          >
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-amber-500/30">
              <Coffee size={14} className="text-amber-400" />
            </div>
          </motion.div>
          
          {/* Geometric Shapes */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-1/4 -right-12"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 transform rotate-45 opacity-60" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, -360],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute bottom-1/4 -left-10"
          >
            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/2 -left-8"
          >
            <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 opacity-60" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </motion.div>
        </div>
        
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-full blur-xl -z-10" />
      </motion.div>
      
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden -z-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DeveloperAvatar;