/**
 * Hyperspace Easter Egg
 * A cosmic visual effect that can be activated from the console
 */

// Define the interface for the global hyperbliss object
export interface HyperblissInterface {
  activate: () => string;
  readonly duration: number;
  setDuration: (seconds: number) => void;
  readonly intensity: number;
  setIntensity: (level: number) => void;
  readonly isActive: boolean;
}

/**
 * Hyperspace Manager Class
 * Manages the cosmic visual effects and console interactions
 */
class HyperspaceManager {
  private static instance: HyperspaceManager;
  private isInitialized: boolean = false;
  private _isActive: boolean = false;
  private _duration: number = 10;
  private _intensity: number = 1;
  private container: HTMLDivElement | null = null;
  private tunnelContainer: HTMLDivElement | null = null;
  private dripContainer: HTMLDivElement | null = null;

  // Console styling
  private styles = {
    logoGradient:
      "background: linear-gradient(90deg, #000033 0%, #0033cc 25%, #6600cc 50%, #cc00ff 75%, #ff00ff 100%); padding: 5px;",
    tagline:
      "background: linear-gradient(90deg, #000033 0%, #0033cc 25%, #6600cc 50%, #cc00ff 75%, #ff00ff 100%); color: #00ffff; font-weight: bold; padding: 10px; border-radius: 5px; font-size: 18px; text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 35px #00ffff, 0 0 40px #00ffff, 0 0 50px #00ffff, 0 0 75px #00ffff;",
    techStack:
      "color: #a259ff; font-style: italic; font-size: 14px; padding: 5px;",
    hint: "color: #ff9900; font-size: 12px; font-style: italic;",
    activated: "color: #ff00ff; font-weight: bold; font-size: 16px;",
    deactivated: "color: #00ffff; font-weight: bold; font-size: 14px;",
    alreadyActive: "color: #00ffff; font-size: 14px;",
  };

  // Cyberpunk elements
  private cyberElements = {
    symbols: ["✨", "⭐", "💫", "🌟", "✵", "⊹", "⎊", "⨳", "✧", "✦", "⋆"],
    colors: ["#00ffff", "#ff00ff", "#9900ff", "#00ccff"],
    gridColors: ["#ff00ff", "#00ffff", "#9900ff", "#cc00ff"],
    dripColors: ["#00ffff", "#ff00ff", "#9900ff", "#00ccff"],
  };

  // Private constructor for singleton pattern
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): HyperspaceManager {
    if (!HyperspaceManager.instance) {
      HyperspaceManager.instance = new HyperspaceManager();
    }
    return HyperspaceManager.instance;
  }

  /**
   * Initialize the hyperspace easter egg
   */
  public initialize(): void {
    if (this.isInitialized) return;

    this.printConsoleWelcome();
    this.registerGlobalObject();
    this.isInitialized = true;
  }

  /**
   * Print the welcome message in the console
   */
  private printConsoleWelcome(): void {
    // Tagling
    console.log("%c 🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹ ", this.styles.tagline);

    // Tech stack
    console.log(
      "%c⟨ Next.js 15 × React 19 × TypeScript ⟩ digital elegance with neural precision",
      this.styles.techStack
    );

    // Easter egg hint
    console.log(
      "%c⟨ hyperbliss.activate() to initiate neural interface ⟩",
      this.styles.hint
    );
  }

  /**
   * Register the global hyperbliss object
   */
  private registerGlobalObject(): void {
    // Create the hyperbliss object without using 'this' alias
    const hyperblissObject: HyperblissInterface = {
      activate: this.activate.bind(this),
      // Use arrow functions to preserve 'this' context
      get duration() {
        return HyperspaceManager.getInstance()._duration;
      },
      setDuration: this.setDuration.bind(this),
      get intensity() {
        return HyperspaceManager.getInstance()._intensity;
      },
      setIntensity: this.setIntensity.bind(this),
      get isActive() {
        return HyperspaceManager.getInstance()._isActive;
      },
    };

    // Properly type the window object with an interface extension
    (
      window as Window & typeof globalThis & { hyperbliss: HyperblissInterface }
    ).hyperbliss = hyperblissObject;
  }

  /**
   * Set the duration of the hyperspace effect
   */
  public setDuration(seconds: number): void {
    if (seconds < 1 || seconds > 60) {
      console.log(
        "%c⟨ parameter out of range: duration must be between 1-60s ⟩",
        "color: #ff00ff"
      );
      return;
    }
    this._duration = seconds;
    console.log(
      `%c⟨ neural interface duration: ${seconds}s ⟩`,
      "color: #00ffff"
    );
  }

  /**
   * Set the intensity of the hyperspace effect (1-3)
   */
  public setIntensity(level: number): void {
    if (level < 1 || level > 3) {
      console.log(
        "%c⟨ parameter out of range: intensity must be between 1-3 ⟩",
        "color: #ff00ff"
      );
      return;
    }
    this._intensity = level;
    console.log(`%c⟨ neural interface intensity: ${level} ⟩`, "color: #00ffff");
  }

  /**
   * Generate the animation styles based on current intensity
   */
  private getAnimationStyles(): string {
    // Base animation styles with cyberpunk tunnel effect and liquid drips
    const baseStyles = `
      @keyframes cyber-pulse {
        0%, 100% { background-color: rgba(0, 0, 51, ${0.1 * this._intensity}); }
        50% { background-color: rgba(102, 0, 204, ${0.1 * this._intensity}); }
      }
      
      @keyframes neon-glow {
        0% { text-shadow: 0 0 ${5 * this._intensity}px #ff00ff, 0 0 ${
      10 * this._intensity
    }px #ff00ff; }
        50% { text-shadow: 0 0 ${15 * this._intensity}px #00ffff, 0 0 ${
      25 * this._intensity
    }px #00ffff; }
        100% { text-shadow: 0 0 ${5 * this._intensity}px #ff00ff, 0 0 ${
      10 * this._intensity
    }px #ff00ff; }
      }
      
      @keyframes cyber-float {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0.7; }
        50% { transform: translate(var(--tx), var(--ty)) rotate(180deg); opacity: 1; }
        100% { transform: translate(0, 0) rotate(360deg); opacity: 0.7; }
      }
      
      @keyframes tunnel-zoom {
        0% { transform: translateZ(0) scale(1); opacity: 0.3; }
        100% { transform: translateZ(${500 * this._intensity}px) scale(${
      3 + this._intensity
    }); opacity: 0; }
      }
      
      @keyframes grid-pulse {
        0% { opacity: 0.05; box-shadow: 0 0 5px var(--grid-color), 0 0 10px var(--grid-color); }
        50% { opacity: ${0.15 * this._intensity}; box-shadow: 0 0 ${
      10 * this._intensity
    }px var(--grid-color), 0 0 ${20 * this._intensity}px var(--grid-color); }
        100% { opacity: 0.05; box-shadow: 0 0 5px var(--grid-color), 0 0 10px var(--grid-color); }
      }
      
      @keyframes neon-drip {
        0% { height: 0; opacity: 0.7; }
        80% { height: var(--drip-height); opacity: 0.7; }
        100% { height: var(--drip-height); opacity: 0; }
      }
      
      @keyframes drip-appear {
        0% { opacity: 0; transform: scaleY(0); }
        100% { opacity: 1; transform: scaleY(1); }
      }
      
      body.hyperspace-active {
        animation: cyber-pulse ${8 - this._intensity}s ease infinite;
        transition: all 0.5s ease;
        background-image: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, ${
          0.8 + this._intensity * 0.05
        }) 100%);
        perspective: 1000px;
        overflow-x: hidden;
      }
      
      body.hyperspace-active h1, 
      body.hyperspace-active h2,
      body.hyperspace-active a {
        animation: neon-glow ${4 - this._intensity * 0.5}s infinite;
        position: relative;
      }
      
      .cyber-particle {
        position: absolute;
        pointer-events: none;
        animation: cyber-float var(--duration) ease-in-out infinite;
        z-index: 10000;
        filter: blur(${0.5 * this._intensity}px);
      }
      
      .tunnel-ring {
        position: absolute;
        border-radius: 50%;
        border: 1px solid var(--ring-color);
        box-shadow: 0 0 ${8 * this._intensity}px var(--ring-color), inset 0 0 ${
      5 * this._intensity
    }px var(--ring-color);
        opacity: 0.2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1);
        transform-style: preserve-3d;
        animation: tunnel-zoom ${3 - this._intensity * 0.4}s linear infinite;
        backdrop-filter: blur(${0.5 * this._intensity}px);
      }
      
      .grid-line {
        position: absolute;
        background: transparent;
        box-shadow: 0 0 3px var(--grid-color), 0 0 5px var(--grid-color);
        opacity: 0.1;
        animation: grid-pulse ${5 - this._intensity}s infinite;
      }
      
      .horizontal-grid {
        height: 1px;
        width: 100%;
        left: 0;
      }
      
      .vertical-grid {
        width: 1px;
        height: 100%;
        top: 0;
      }
      
      .neon-drip {
        position: absolute;
        width: 2px;
        height: 0;
        background: linear-gradient(to bottom, var(--drip-color) 0%, transparent 100%);
        box-shadow: 0 0 ${5 * this._intensity}px var(--drip-color), 0 0 ${
      8 * this._intensity
    }px var(--drip-color);
        animation: neon-drip var(--drip-duration) ease-in forwards;
        animation-delay: var(--drip-delay);
        opacity: 0.7;
        z-index: 9997;
        border-radius: 0 0 ${this._intensity}px ${this._intensity}px;
        transform-origin: top center;
        animation-iteration-count: infinite;
      }
      
      .drip-head {
        position: absolute;
        bottom: -${5 + this._intensity * 2}px;
        left: -${3 + this._intensity}px;
        width: ${8 + this._intensity * 2}px;
        height: ${8 + this._intensity * 2}px;
        border-radius: 50%;
        background: var(--drip-color);
        box-shadow: 0 0 ${8 * this._intensity}px var(--drip-color), 0 0 ${
      15 * this._intensity
    }px var(--drip-color);
        opacity: 0.8;
      }
    `;

    return baseStyles;
  }

  /**
   * Create drippy neon effects
   */
  private createDrippyEffects(): void {
    // Create drip container
    this.dripContainer = document.createElement("div");
    this.dripContainer.id = "hyperspace-drips";
    this.dripContainer.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9997; overflow: hidden;";

    // Create drips
    const dripCount = 15 + this._intensity * 10;
    let dripsHTML = "";

    for (let i = 0; i < dripCount; i++) {
      const leftPos = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 7;
      const height = 50 + Math.random() * 250;
      const color =
        this.cyberElements.dripColors[
          Math.floor(Math.random() * this.cyberElements.dripColors.length)
        ];
      const dripWidth = 1 + Math.random() * 2;

      dripsHTML += `<div class="neon-drip" style="
        left: ${leftPos}%;
        top: 0;
        width: ${dripWidth}px;
        --drip-color: ${color};
        --drip-duration: ${duration}s;
        --drip-delay: ${delay}s;
        --drip-height: ${height}px;
      ">
        <div class="drip-head"></div>
      </div>`;
    }

    this.dripContainer.innerHTML = dripsHTML;
    document.body.appendChild(this.dripContainer);

    // Add a few drips from the bottom too for balance
    const bottomDripContainer = document.createElement("div");
    bottomDripContainer.id = "hyperspace-bottom-drips";
    bottomDripContainer.style.cssText =
      "position: fixed; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9997; overflow: hidden; transform: rotate(180deg);";

    let bottomDripsHTML = "";
    const bottomDripCount = 5 + this._intensity * 3;

    for (let i = 0; i < bottomDripCount; i++) {
      const leftPos = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 7;
      const height = 30 + Math.random() * 150;
      const color =
        this.cyberElements.dripColors[
          Math.floor(Math.random() * this.cyberElements.dripColors.length)
        ];
      const dripWidth = 1 + Math.random() * 2;

      bottomDripsHTML += `<div class="neon-drip" style="
        left: ${leftPos}%;
        top: 0;
        width: ${dripWidth}px;
        --drip-color: ${color};
        --drip-duration: ${duration}s;
        --drip-delay: ${delay}s;
        --drip-height: ${height}px;
      ">
        <div class="drip-head"></div>
      </div>`;
    }

    bottomDripContainer.innerHTML = bottomDripsHTML;
    document.body.appendChild(bottomDripContainer);

    // Store reference for cleanup
    const originalDrip = this.dripContainer;
    this.dripContainer = document.createElement("div");
    this.dripContainer.id = "drip-containers";
    this.dripContainer.appendChild(originalDrip);
    this.dripContainer.appendChild(bottomDripContainer);
    document.body.appendChild(this.dripContainer);
  }

  /**
   * Create the cyberpunk tunnel effect
   */
  private createTunnelEffect(): void {
    // Create tunnel container
    this.tunnelContainer = document.createElement("div");
    this.tunnelContainer.id = "hyperspace-tunnel";
    this.tunnelContainer.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998; overflow: hidden; perspective: 1000px;";

    // Create tunnel rings
    const ringCount = 8 + this._intensity * 4;
    let ringsHTML = "";

    for (let i = 0; i < ringCount; i++) {
      const size = 50 + i * 25;
      const delay = i * (0.2 / this._intensity);
      const color =
        this.cyberElements.colors[
          Math.floor(Math.random() * this.cyberElements.colors.length)
        ];

      ringsHTML += `<div class="tunnel-ring" style="
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        --ring-color: ${color};
      "></div>`;
    }

    // Create cyberpunk grid - more subtle
    const gridCount = 8 + this._intensity * 3;

    // Horizontal grid lines
    for (let i = 0; i < gridCount; i++) {
      const position = (100 / gridCount) * i;
      const color =
        this.cyberElements.gridColors[i % this.cyberElements.gridColors.length];
      const delay = i * 0.1;

      ringsHTML += `<div class="grid-line horizontal-grid" style="
        top: ${position}%;
        animation-delay: ${delay}s;
        --grid-color: ${color};
      "></div>`;
    }

    // Vertical grid lines
    for (let i = 0; i < gridCount; i++) {
      const position = (100 / gridCount) * i;
      const color =
        this.cyberElements.gridColors[i % this.cyberElements.gridColors.length];
      const delay = i * 0.1;

      ringsHTML += `<div class="grid-line vertical-grid" style="
        left: ${position}%;
        animation-delay: ${delay}s;
        --grid-color: ${color};
      "></div>`;
    }

    this.tunnelContainer.innerHTML = ringsHTML;
    document.body.appendChild(this.tunnelContainer);
  }

  /**
   * Activate the hyperspace effect
   */
  public activate(): string {
    console.log("%c⟨ neural interface activated ⟩", this.styles.activated);

    // Check if hyperspace is already active
    if (this._isActive) {
      console.log(
        "%c⟨ neural interface already engaged ⟩",
        this.styles.alreadyActive
      );
      return "Already active";
    }

    this._isActive = true;

    // Create style element
    const style = document.createElement("style");
    style.id = "hyperbliss-animation";
    style.textContent = this.getAnimationStyles();
    document.head.appendChild(style);

    // Add the class to the body
    document.body.classList.add("hyperspace-active");

    // Create drippy neon effects
    this.createDrippyEffects();

    // Create cyberpunk tunnel effect
    this.createTunnelEffect();

    // Create cyber particle container
    this.container = document.createElement("div");
    this.container.id = "hyperspace-void";
    this.container.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden;";

    // Calculate number of particles based on intensity
    const particleCount = 20 + this._intensity * 10;

    // Create particles HTML
    let particlesHTML = "";
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 10 + 3 * this._intensity;
      const symbol =
        this.cyberElements.symbols[
          Math.floor(Math.random() * this.cyberElements.symbols.length)
        ];
      const color =
        this.cyberElements.colors[
          Math.floor(Math.random() * this.cyberElements.colors.length)
        ];
      const duration = Math.random() * 8 + 10 - this._intensity + "s";
      const top = Math.random() * 100 + "vh";
      const left = Math.random() * 100 + "vw";
      const tx =
        Math.random() * 100 * this._intensity - 50 * this._intensity + "px";
      const ty =
        Math.random() * 100 * this._intensity - 50 * this._intensity + "px";

      particlesHTML += `<div class="cyber-particle" style="
        top: ${top};
        left: ${left};
        font-size: ${size}px;
        color: ${color};
        opacity: ${Math.random() * 0.5 + 0.3 + this._intensity * 0.1};
        --duration: ${duration};
        --tx: ${tx};
        --ty: ${ty};
      ">${symbol}</div>`;
    }

    // Set innerHTML and append container
    this.container.innerHTML = particlesHTML;
    document.body.appendChild(this.container);

    // Deactivate after the specified duration
    setTimeout(() => this.deactivate(), this._duration * 1000);

    return `⟨ neural interface active: ${this._duration}s at intensity ${this._intensity} ⟩`;
  }

  /**
   * Deactivate the hyperspace effect
   */
  private deactivate(): void {
    if (!this._isActive) return;

    // Fade out
    if (this.container) {
      this.container.style.transition = "opacity 1.5s ease-out";
      this.container.style.opacity = "0";
    }

    if (this.tunnelContainer) {
      this.tunnelContainer.style.transition = "opacity 1.5s ease-out";
      this.tunnelContainer.style.opacity = "0";
    }

    if (this.dripContainer) {
      this.dripContainer.style.transition = "opacity 1.5s ease-out";
      this.dripContainer.style.opacity = "0";
    }

    setTimeout(() => {
      // Clean up
      document.body.classList.remove("hyperspace-active");
      const animStyle = document.getElementById("hyperbliss-animation");
      if (animStyle) animStyle.remove();
      if (this.container) this.container.remove();
      if (this.tunnelContainer) this.tunnelContainer.remove();
      if (this.dripContainer) this.dripContainer.remove();
      this.container = null;
      this.tunnelContainer = null;
      this.dripContainer = null;
      this._isActive = false;

      console.log("%c⟨ neural interface disengaged ⟩", this.styles.deactivated);
    }, 1500);
  }
}

/**
 * Initialize the hyperspace easter egg in the console
 */
export function initHyperspace(): void {
  // Single bailout point for non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  const hyperspaceManager = HyperspaceManager.getInstance();
  hyperspaceManager.initialize();
}
