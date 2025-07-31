// Button-Only Mouse Tracking - confined to buttons only, no continuous global effects

export function initializeButtonMouseTracking() {
  // Remove any existing tracking
  document.querySelectorAll('.mouse-tracking-initialized').forEach(el => {
    el.classList.remove('mouse-tracking-initialized');
  });

  // Find ONLY buttons - exclude inputs and other elements to reduce continuous effects
  const buttons = document.querySelectorAll('button, .btn-glass, [role="button"], input[type="button"], input[type="submit"]');
  
  buttons.forEach(button => {
    // Skip if already initialized
    if (button.classList.contains('mouse-tracking-initialized')) {
      return;
    }

    // Add initialization marker
    button.classList.add('mouse-tracking-initialized');

    // Add mousemove event listener - only for actual button interactions
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

  console.log(`🎯 Button-only mouse tracking initialized for ${buttons.length} buttons (no continuous effects)`);
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeButtonMouseTracking);
} else {
  initializeButtonMouseTracking();
}

// Re-initialize when new content is added (for dynamic content)
// Re-initialize only when significant DOM changes occur (not continuously)
const reinitializeTracking = () => {
  // Only re-initialize if there are new buttons
  const uninitializedButtons = document.querySelectorAll('button:not(.mouse-tracking-initialized), .btn-glass:not(.mouse-tracking-initialized), [role="button"]:not(.mouse-tracking-initialized)');
  if (uninitializedButtons.length > 0) {
    setTimeout(initializeButtonMouseTracking, 100);
  }
};

// Watch for DOM changes but only act on button additions
const observer = new MutationObserver((mutations) => {
  let hasNewButtons = false;
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName === 'BUTTON' || element.classList.contains('btn-glass') || element.getAttribute('role') === 'button') {
            hasNewButtons = true;
          }
          // Check for buttons within added elements
          if (element.querySelectorAll && element.querySelectorAll('button, .btn-glass, [role="button"]').length > 0) {
            hasNewButtons = true;
          }
        }
      });
    }
  });
  
  if (hasNewButtons) {
    reinitializeTracking();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

export { observer };
