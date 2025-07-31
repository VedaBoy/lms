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
  private cursorFollower: HTMLElement | null = null;
  private mouseTrails: HTMLElement[] = [];
  private isInitialized = false;
  private mousePosition = { x: 0, y: 0 };
  private lastMousePosition = { x: 0, y: 0 };
  private velocity = { x: 0, y: 0 };
  private animationFrame: number | null = null;

  init() {
    if (this.isInitialized) return;
    
    this.createCursorFollower();
    this.setupEventListeners();
    this.startAnimationLoop();
    this.isInitialized = true;
  }

  private createCursorFollower() {
    // Create cursor follower
    this.cursorFollower = document.createElement('div');
    this.cursorFollower.className = 'cursor-follower';
    document.body.appendChild(this.cursorFollower);

    // Create mouse trails
    for (let i = 0; i < 10; i++) {
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      document.body.appendChild(trail);
      this.mouseTrails.push(trail);
    }
  }

  private setupEventListeners() {
    // Mouse move tracking
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Button hover effects
    document.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    
    // Click effects
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleMouseMove(e: MouseEvent) {
    this.lastMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: e.clientX, y: e.clientY };
    
    // Calculate velocity
    this.velocity = {
      x: this.mousePosition.x - this.lastMousePosition.x,
      y: this.mousePosition.y - this.lastMousePosition.y
    };

    // Update button tracking effects
    this.updateButtonTracking(e);
  }

  private handleMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    
    if (this.isButton(target)) {
      if (this.cursorFollower) {
        this.cursorFollower.classList.add('cursor-hover');
      }
      
      // Add magnetic effect
      if (target.classList.contains('btn-magnetic')) {
        this.applyMagneticEffect(target, e);
      }
    }
  }

  private handleMouseOut(e: MouseEvent) {
    const target = e.target as HTMLElement;
    
    if (this.isButton(target)) {
      if (this.cursorFollower) {
        this.cursorFollower.classList.remove('cursor-hover');
      }
      
      // Reset magnetic effect
      if (target.classList.contains('btn-magnetic')) {
        target.style.transform = '';
      }
    }
  }

  private handleMouseDown(e: MouseEvent) {
    const target = e.target as HTMLElement;
    
    if (this.isButton(target) && target.classList.contains('btn-ripple')) {
      this.createRippleEffect(target, e);
    }
  }

  private handleMouseUp() {
    // Handle mouse up effects if needed
  }

  private updateButtonTracking(e: MouseEvent) {
    // Update cursor follower position
    if (this.cursorFollower) {
      this.cursorFollower.style.left = `${e.clientX}px`;
      this.cursorFollower.style.top = `${e.clientY}px`;
    }

    // Update mouse trails
    this.updateMouseTrails();

    // Update button glow effects based on velocity
    this.updateVelocityEffects();

    // Update button tracking elements
    this.updateButtonTrackingElements(e);
  }

  private updateMouseTrails() {
    this.mouseTrails.forEach((trail, index) => {
      const delay = index * 50;
      setTimeout(() => {
        trail.style.left = `${this.mousePosition.x}px`;
        trail.style.top = `${this.mousePosition.y}px`;
        trail.style.opacity = `${Math.max(0, 1 - index * 0.1)}`;
      }, delay);
    });
  }

  private updateVelocityEffects() {
    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    const normalizedSpeed = Math.min(speed / 50, 1);

    // Apply velocity-based effects to elements
    document.querySelectorAll('.velocity-track').forEach((element: any) => {
      element.style.filter = `blur(${normalizedSpeed * 2}px) brightness(${1 + normalizedSpeed * 0.2})`;
    });

    document.querySelectorAll('.velocity-glow').forEach((element: any) => {
      const glowIntensity = normalizedSpeed * 20;
      element.style.boxShadow = `0 0 ${glowIntensity}px rgba(59, 130, 246, ${normalizedSpeed * 0.5})`;
    });
  }

  private updateButtonTrackingElements(e: MouseEvent) {
    // Update tracking elements for buttons and containers
    document.querySelectorAll('button, .btn-mouse-track, .mouse-track, .spotlight-track').forEach((element) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      
      if (isInside) {
        const htmlElement = element as HTMLElement;
        htmlElement.style.setProperty('--mouse-x', `${x}px`);
        htmlElement.style.setProperty('--mouse-y', `${y}px`);
        
        // Apply tilt effect based on mouse position
        if (element.classList.contains('btn-tilt') || element.classList.contains('btn-magnetic')) {
          this.applyTiltEffect(htmlElement, x, y, rect);
        }
      }
    });
  }

  private applyTiltEffect(element: HTMLElement, mouseX: number, mouseY: number, rect: DOMRect) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (mouseX - centerX) / centerX;
    const deltaY = (mouseY - centerY) / centerY;
    
    const tiltX = deltaY * 10; // Max 10 degrees
    const tiltY = deltaX * -10; // Max 10 degrees
    
    element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  }

  private applyMagneticEffect(target: HTMLElement, e: MouseEvent) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = Math.max(rect.width, rect.height);
    
    if (distance < maxDistance * 1.5) {
      const pullStrength = 1 - (distance / (maxDistance * 1.5));
      const pullX = deltaX * pullStrength * 0.1;
      const pullY = deltaY * pullStrength * 0.1;
      
      target.style.transform = `translate(${pullX}px, ${pullY}px) scale(${1 + pullStrength * 0.05})`;
    }
  }

  private createRippleEffect(target: HTMLElement, e: MouseEvent) {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple-expand 0.6s ease-out';
    
    target.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  private isButton(element: HTMLElement): boolean {
    return element.tagName === 'BUTTON' || 
           element.classList.contains('btn-glass') ||
           element.classList.contains('btn-interactive') ||
           element.role === 'button' ||
           element.closest('button') !== null;
  }

  private startAnimationLoop() {
    const animate = () => {
      // Smooth animations can be added here
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  destroy() {
    if (this.cursorFollower) {
      this.cursorFollower.remove();
    }
    
    this.mouseTrails.forEach(trail => trail.remove());
    this.mouseTrails = [];
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    this.isInitialized = false;
  }
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-expand {
    from {
      width: 0;
      height: 0;
      opacity: 1;
    }
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export const mouseTracker = new MouseTracker();
