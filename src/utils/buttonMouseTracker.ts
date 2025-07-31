// Simple Button Mouse Tracking - exactly like your HTML example

export function initializeButtonMouseTracking() {
  // Remove any existing tracking
  document.querySelectorAll('.mouse-tracking-initialized').forEach(el => {
    el.classList.remove('mouse-tracking-initialized');
  });

  // Find ALL buttons in the project
  const buttons = document.querySelectorAll('button, .btn-glass, [role="button"], input[type="button"], input[type="submit"]');
  
  buttons.forEach(button => {
    // Skip if already initialized
    if (button.classList.contains('mouse-tracking-initialized')) {
      return;
    }

    // Add initialization marker
    button.classList.add('mouse-tracking-initialized');

    // Add mousemove event listener
    button.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = button.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      // Set CSS custom properties for the mouse position
      (button as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (button as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    });

    // Reset position when mouse leaves
    button.addEventListener('mouseleave', () => {
      (button as HTMLElement).style.setProperty('--mouse-x', '50%');
      (button as HTMLElement).style.setProperty('--mouse-y', '50%');
    });
  });

  console.log(`🎯 Mouse tracking initialized for ${buttons.length} buttons`);
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeButtonMouseTracking);
} else {
  initializeButtonMouseTracking();
}

// Re-initialize when new content is added (for dynamic content)
const reinitializeTracking = () => {
  setTimeout(initializeButtonMouseTracking, 100);
};

// Watch for DOM changes
const observer = new MutationObserver(reinitializeTracking);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

export { observer };
