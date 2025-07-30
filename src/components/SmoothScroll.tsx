import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

// Smooth scroll utility functions
export const smoothScrollTo = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const smoothScrollBy = (pixels: number) => {
  window.scrollBy({
    top: pixels,
    behavior: 'smooth'
  });
};

// Scroll to Top Button Component
export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      className={`scroll-to-top-button ${isVisible ? 'visible' : ''} mouse-tilt btn-interactive`}
      onClick={smoothScrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 icon-bounce" />
    </button>
  );
};

// Enhanced Smooth Scroll Container
export const SmoothScrollContainer: React.FC<SmoothScrollProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`smooth-scroll-container ${className}`}>
      {children}
    </div>
  );
};

// Smooth Scroll Page Wrapper
export const SmoothScrollPage: React.FC<SmoothScrollProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`scroll-smooth ${className}`}>
      {children}
      <ScrollToTopButton />
    </div>
  );
};

// Hook for smooth scrolling
export const useSmoothScroll = () => {
  const scrollToElement = (elementId: string, offset: number = 80) => {
    smoothScrollTo(elementId, offset);
  };

  const scrollToTop = () => {
    smoothScrollToTop();
  };

  const scrollBy = (pixels: number) => {
    smoothScrollBy(pixels);
  };

  return {
    scrollToElement,
    scrollToTop,
    scrollBy
  };
};

export default SmoothScrollPage;
