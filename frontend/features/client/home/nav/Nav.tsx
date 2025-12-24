"use client";

"use client";

import { useState } from 'react';
import TopBar from './components/TopBar';
import Header from './components/Header';
import NavigationMenu from './components/NavigationMenu';

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full font-sans text-sm relative">
      <TopBar />
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        onToggleMobileMenu={toggleMobileMenu} 
      />
      <NavigationMenu />
    </div>
  );
};

export default Nav;
