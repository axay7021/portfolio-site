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
        <div className="w-80 h-80 relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full backdrop-blur-sm border border-white/10" />
          
          {/* Developer Figure */}
          <svg
            viewBox="0 0 320 320"
            className="w-full h-full relative z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <circle
              cx="160"
              cy="120"
              r="35"
              fill="#fdbcb4"
              className="drop-shadow-sm"
            />
            
            {/* Hair */}
            <path
              d="M125 95 Q160 80 195 95 Q195 85 160 85 Q125 85 125 95"
              fill="#4a4a4a"
            />
            
            {/* Eyes */}
            <circle cx="150" cy="115" r="3" fill="#2563eb" />
            <circle cx="170" cy="115" r="3" fill="#2563eb" />
            
            {/* Glasses */}
            <rect
              x="140"
              y="110"
              width="15"
              height="12"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              rx="2"
            />
            <rect
              x="165"
              y="110"
              width="15"
              height="12"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              rx="2"
            />
            <line
              x1="155"
              y1="116"
              x2="165"
              y2="116"
              stroke="#374151"
              strokeWidth="2"
            />
            
            {/* Smile */}
            <path
              d="M150 125 Q160 130 170 125"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Body - Hoodie */}
            <rect
              x="130"
              y="155"
              width="60"
              height="80"
              fill="#1f2937"
              rx="8"
            />
            
            {/* Hoodie Details */}
            <rect
              x="135"
              y="160"
              width="50"
              height="70"
              fill="#374151"
              rx="6"
            />
            
            {/* Hoodie Strings */}
            <circle cx="155" cy="170" r="2" fill="#6b7280" />
            <circle cx="165" cy="170" r="2" fill="#6b7280" />
            
            {/* Arms */}
            <rect
              x="110"
              y="165"
              width="20"
              height="50"
              fill="#1f2937"
              rx="10"
            />
            <rect
              x="190"
              y="165"
              width="20"
              height="50"
              fill="#1f2937"
              rx="10"
            />
            
            {/* Hands */}
            <circle cx="120" cy="220" r="8" fill="#fdbcb4" />
            <circle cx="200" cy="220" r="8" fill="#fdbcb4" />
            
            {/* Laptop */}
            <rect
              x="140"
              y="235"
              width="40"
              height="25"
              fill="#374151"
              rx="2"
            />
            <rect
              x="142"
              y="237"
              width="36"
              height="15"
              fill="#000000"
              rx="1"
            />
            
            {/* Code on laptop screen */}
            <line x1="145" y1="240" x2="155" y2="240" stroke="#3b82f6" strokeWidth="1" />
            <line x1="145" y1="243" x2="165" y2="243" stroke="#10b981" strokeWidth="1" />
            <line x1="145" y1="246" x2="160" y2="246" stroke="#f59e0b" strokeWidth="1" />
            <line x1="145" y1="249" x2="170" y2="249" stroke="#8b5cf6" strokeWidth="1" />
          </svg>
          
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