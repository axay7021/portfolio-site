import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const menuItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl z-50 glass-card border border-white/20 rounded-xl">
        <div className="px-6 py-3">
          <div className="flex justify-center items-center">
            <div className="flex space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg group ${
                    activeSection === item.href.slice(1) 
                      ? 'text-blue-400 bg-blue-400/10' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm z-50">
        <div className="glass-card border border-white/20 rounded-2xl px-2 py-2">
          <div className="flex justify-around items-center">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[60px] group ${
                  activeSection === item.href.slice(1) 
                    ? 'text-blue-400 bg-blue-400/10 scale-105' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-medium">{item.name}</span>
                {activeSection === item.href.slice(1) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;