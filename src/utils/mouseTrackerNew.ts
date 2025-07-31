// Simple Mouse Tracking for Glassmorphism Buttons
class MouseTracker {
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    this.setupButtonTracking();
    this.isInitialized = true;
  }

  private setupButtonTracking() {
    // Track mouse movement on all buttons for glassmorphism effect
    document.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  private handleMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.isButton(target)) {
      this.updateButtonMousePosition(target, e);
    }
  }

  private handleMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.isButton(target)) {
      this.updateButtonMousePosition(target, e);
    }
  }

  private handleMouseLeave(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (this.isButton(target)) {
      // Reset mouse position to center when leaving
      target.style.setProperty('--mouse-x', '50%');
      target.style.setProperty('--mouse-y', '50%');
    }
  }

  private updateButtonMousePosition(button: HTMLElement, e: MouseEvent) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    button.style.setProperty('--mouse-x', `${x}px`);
    button.style.setProperty('--mouse-y', `${y}px`);
  }

  private isButton(element: HTMLElement): boolean {
    return element.tagName === 'BUTTON' || 
           element.classList.contains('btn-glass') ||
           element.classList.contains('btn-interactive') ||
           element.role === 'button' ||
           element.closest('button') !== null;
  }

  destroy() {
    if (!this.isInitialized) return;

    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    
    this.isInitialized = false;
  }
}

export const mouseTracker = new MouseTracker();
