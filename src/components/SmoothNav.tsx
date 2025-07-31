import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';

interface SmoothNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SmoothNavProps {
  items: SmoothNavItem[];
  className?: string;
}

// Smooth Navigation Component for internal page navigation
export const SmoothNav: React.FC<SmoothNavProps> = ({ items, className = '' }) => {
  const { scrollToElement } = useSmoothScroll();

  return (
    <nav className={`sticky top-4 z-30 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-4 mouse-glow-border ${className}`}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToElement(item.id)}
            className="btn-glass inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-300 cursor-pointer"
          >
            {item.icon && <item.icon className="w-4 h-4 mr-2 icon-bounce" />}
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Quick scroll buttons for common sections
export const QuickScrollButtons: React.FC = () => {
  const { scrollToTop, scrollBy } = useSmoothScroll();

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col space-y-2">
      <button
        onClick={() => scrollBy(-300)}
        className="btn-glass p-3 rounded-full shadow-lg text-gray-600 hover:text-gray-800 transition-all duration-300 cursor-pointer"
        title="Scroll up"
      >
        <ChevronDown className="w-5 h-5 rotate-180 icon-bounce" />
      </button>
      <button
        onClick={() => scrollBy(300)}
        className="btn-glass p-3 rounded-full shadow-lg text-gray-600 hover:text-gray-800 transition-all duration-300 cursor-pointer"
        title="Scroll down"
      >
        <ChevronDown className="w-5 h-5 icon-bounce" />
      </button>
    </div>
  );
};

// Smooth scroll progress indicator
export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default SmoothNav;
