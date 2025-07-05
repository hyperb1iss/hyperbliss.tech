/**
 * Input Manager for CyberScape 2.0
 * 
 * Centralized input handling for mouse, touch, and keyboard interactions.
 * Provides normalized input data for particle systems and header interactions.
 */

export interface InputState {
  mouse: {
    x: number;
    y: number;
    normalizedX: number; // -1 to 1
    normalizedY: number; // -1 to 1
    isDown: boolean;
    isOverHeader: boolean;
    velocity: { x: number; y: number };
    buttons: number;
  };
  
  touch: {
    touches: TouchPoint[];
    isActive: boolean;
    centroid: { x: number; y: number };
  };
  
  keyboard: {
    keys: Set<string>;
    modifiers: {
      shift: boolean;
      ctrl: boolean;
      alt: boolean;
      meta: boolean;
    };
  };
  
  // Header-specific interaction zones
  zones: {
    logo: boolean;
    navigation: boolean;
    particles: boolean;
  };
  
  // Performance tracking
  interaction: {
    isActive: boolean;
    intensity: number; // 0-1 based on movement speed
    lastActiveTime: number;
  };
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  force?: number;
}

export class InputManager {
  private canvas: HTMLCanvasElement;
  private headerElement: HTMLElement;
  private isInitialized = false;
  
  private state: InputState = {
    mouse: {
      x: 0,
      y: 0,
      normalizedX: 0,
      normalizedY: 0,
      isDown: false,
      isOverHeader: false,
      velocity: { x: 0, y: 0 },
      buttons: 0
    },
    touch: {
      touches: [],
      isActive: false,
      centroid: { x: 0, y: 0 }
    },
    keyboard: {
      keys: new Set(),
      modifiers: {
        shift: false,
        ctrl: false,
        alt: false,
        meta: false
      }
    },
    zones: {
      logo: false,
      navigation: false,
      particles: false
    },
    interaction: {
      isActive: false,
      intensity: 0,
      lastActiveTime: 0
    }
  };
  
  // Previous frame data for velocity calculation
  private prevMouse = { x: 0, y: 0, time: 0 };
  private velocityHistory: Array<{ x: number; y: number; time: number }> = [];
  private maxVelocityHistory = 5;
  
  // Event listener references for cleanup
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> = [];

  constructor(canvas: HTMLCanvasElement, headerElement: HTMLElement) {
    this.canvas = canvas;
    this.headerElement = headerElement;
  }

  /**
   * Initialize input management
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    this.setupMouseEvents();
    this.setupTouchEvents();
    this.setupKeyboardEvents();
    this.setupHeaderZoneDetection();
    
    this.isInitialized = true;
    console.log('🖱️ Input manager initialized');
  }

  /**
   * Setup mouse event listeners
   */
  private setupMouseEvents(): void {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Update position
      this.state.mouse.x = x;
      this.state.mouse.y = y;
      this.state.mouse.normalizedX = (x / rect.width) * 2 - 1;
      this.state.mouse.normalizedY = (y / rect.height) * 2 - 1;
      this.state.mouse.buttons = event.buttons;
      
      // Calculate velocity
      this.updateMouseVelocity(x, y);
      
      // Update interaction state
      this.updateInteractionState();
      
      // Check header zone
      this.state.mouse.isOverHeader = this.isOverHeader(event);
    };

    const handleMouseDown = (event: MouseEvent) => {
      this.state.mouse.isDown = true;
      this.state.mouse.buttons = event.buttons;
      this.updateInteractionState();
    };

    const handleMouseUp = (event: MouseEvent) => {
      this.state.mouse.isDown = false;
      this.state.mouse.buttons = event.buttons;
      this.updateInteractionState();
    };

    const handleMouseEnter = () => {
      this.state.mouse.isOverHeader = true;
    };

    const handleMouseLeave = () => {
      this.state.mouse.isOverHeader = false;
      this.state.zones.logo = false;
      this.state.zones.navigation = false;
      this.state.zones.particles = false;
    };

    // Add listeners
    this.addEventListeners([
      { element: window, event: 'mousemove', handler: handleMouseMove },
      { element: this.canvas, event: 'mousedown', handler: handleMouseDown },
      { element: window, event: 'mouseup', handler: handleMouseUp },
      { element: this.headerElement, event: 'mouseenter', handler: handleMouseEnter },
      { element: this.headerElement, event: 'mouseleave', handler: handleMouseLeave }
    ]);
  }

  /**
   * Setup touch event listeners
   */
  private setupTouchEvents(): void {
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      this.updateTouchState(event);
      this.updateInteractionState();
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      this.updateTouchState(event);
      this.updateInteractionState();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      this.updateTouchState(event);
      this.updateInteractionState();
    };

    this.addEventListeners([
      { element: this.canvas, event: 'touchstart', handler: handleTouchStart },
      { element: this.canvas, event: 'touchmove', handler: handleTouchMove },
      { element: this.canvas, event: 'touchend', handler: handleTouchEnd },
      { element: this.canvas, event: 'touchcancel', handler: handleTouchEnd }
    ]);
  }

  /**
   * Setup keyboard event listeners
   */
  private setupKeyboardEvents(): void {
    const handleKeyDown = (event: KeyboardEvent) => {
      this.state.keyboard.keys.add(event.code);
      this.updateModifiers(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      this.state.keyboard.keys.delete(event.code);
      this.updateModifiers(event);
    };

    this.addEventListeners([
      { element: window, event: 'keydown', handler: handleKeyDown },
      { element: window, event: 'keyup', handler: handleKeyUp }
    ]);
  }

  /**
   * Setup header zone detection
   */
  private setupHeaderZoneDetection(): void {
    // This will be enhanced with specific logo and nav element detection
    // For now, we'll use basic collision detection
  }

  /**
   * Update touch state from touch event
   */
  private updateTouchState(event: TouchEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const touches: TouchPoint[] = [];
    
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      touches.push({
        id: touch.identifier,
        x,
        y,
        normalizedX: (x / rect.width) * 2 - 1,
        normalizedY: (y / rect.height) * 2 - 1,
        force: (touch as any).force || 1.0
      });
    }
    
    this.state.touch.touches = touches;
    this.state.touch.isActive = touches.length > 0;
    
    // Calculate centroid
    if (touches.length > 0) {
      const centroidX = touches.reduce((sum, touch) => sum + touch.x, 0) / touches.length;
      const centroidY = touches.reduce((sum, touch) => sum + touch.y, 0) / touches.length;
      this.state.touch.centroid = { x: centroidX, y: centroidY };
    }
  }

  /**
   * Update keyboard modifiers
   */
  private updateModifiers(event: KeyboardEvent): void {
    this.state.keyboard.modifiers.shift = event.shiftKey;
    this.state.keyboard.modifiers.ctrl = event.ctrlKey;
    this.state.keyboard.modifiers.alt = event.altKey;
    this.state.keyboard.modifiers.meta = event.metaKey;
  }

  /**
   * Update mouse velocity
   */
  private updateMouseVelocity(x: number, y: number): void {
    const now = performance.now();
    const deltaTime = now - this.prevMouse.time;
    
    if (deltaTime > 0) {
      const velocityX = (x - this.prevMouse.x) / deltaTime;
      const velocityY = (y - this.prevMouse.y) / deltaTime;
      
      // Add to velocity history
      this.velocityHistory.push({ x: velocityX, y: velocityY, time: now });
      if (this.velocityHistory.length > this.maxVelocityHistory) {
        this.velocityHistory.shift();
      }
      
      // Calculate smoothed velocity
      const avgVelX = this.velocityHistory.reduce((sum, v) => sum + v.x, 0) / this.velocityHistory.length;
      const avgVelY = this.velocityHistory.reduce((sum, v) => sum + v.y, 0) / this.velocityHistory.length;
      
      this.state.mouse.velocity = { x: avgVelX, y: avgVelY };
    }
    
    this.prevMouse = { x, y, time: now };
  }

  /**
   * Update interaction intensity
   */
  private updateInteractionState(): void {
    const isActive = this.state.mouse.isDown || 
                    this.state.touch.isActive || 
                    this.state.mouse.isOverHeader;
    
    if (isActive) {
      this.state.interaction.lastActiveTime = performance.now();
    }
    
    this.state.interaction.isActive = isActive;
    
    // Calculate intensity based on movement speed
    const speed = Math.sqrt(
      this.state.mouse.velocity.x ** 2 + 
      this.state.mouse.velocity.y ** 2
    );
    this.state.interaction.intensity = Math.min(speed / 2, 1); // Normalize to 0-1
  }

  /**
   * Check if mouse is over header element
   */
  private isOverHeader(event: MouseEvent): boolean {
    const headerRect = this.headerElement.getBoundingClientRect();
    return event.clientX >= headerRect.left &&
           event.clientX <= headerRect.right &&
           event.clientY >= headerRect.top &&
           event.clientY <= headerRect.bottom;
  }

  /**
   * Add event listeners with cleanup tracking
   */
  private addEventListeners(listeners: Array<{ element: EventTarget; event: string; handler: EventListener }>): void {
    listeners.forEach(({ element, event, handler }) => {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    });
  }

  /**
   * Update input state (called each frame)
   */
  update(): void {
    // Update zone detection based on current mouse position
    this.updateZoneDetection();
    
    // Decay interaction intensity over time
    const timeSinceActive = performance.now() - this.state.interaction.lastActiveTime;
    if (timeSinceActive > 100) { // 100ms decay
      this.state.interaction.intensity *= 0.95;
    }
  }

  /**
   * Update header zone detection
   */
  private updateZoneDetection(): void {
    if (!this.state.mouse.isOverHeader) {
      this.state.zones.logo = false;
      this.state.zones.navigation = false;
      this.state.zones.particles = false;
      return;
    }

    // TODO: Implement specific zone detection based on logo and nav elements
    // For now, we'll use basic regions
    const headerRect = this.headerElement.getBoundingClientRect();
    const relativeX = this.state.mouse.x / headerRect.width;
    
    this.state.zones.logo = relativeX < 0.3; // Left 30% for logo
    this.state.zones.navigation = relativeX > 0.7; // Right 30% for nav
    this.state.zones.particles = !this.state.zones.logo && !this.state.zones.navigation;
  }

  /**
   * Get current input state
   */
  getState(): InputState {
    return { ...this.state }; // Return copy to prevent external modification
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(key: string): boolean {
    return this.state.keyboard.keys.has(key);
  }

  /**
   * Get primary input position (mouse or touch centroid)
   */
  getPrimaryPosition(): { x: number; y: number; normalizedX: number; normalizedY: number } {
    if (this.state.touch.isActive) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: this.state.touch.centroid.x,
        y: this.state.touch.centroid.y,
        normalizedX: (this.state.touch.centroid.x / rect.width) * 2 - 1,
        normalizedY: (this.state.touch.centroid.y / rect.height) * 2 - 1
      };
    }
    
    return {
      x: this.state.mouse.x,
      y: this.state.mouse.y,
      normalizedX: this.state.mouse.normalizedX,
      normalizedY: this.state.mouse.normalizedY
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Remove all event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    
    // Clear state
    this.state.keyboard.keys.clear();
    this.velocityHistory = [];
    
    this.isInitialized = false;
    console.log('🖱️ Input manager destroyed');
  }
} 