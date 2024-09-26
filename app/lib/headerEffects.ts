// app/effects/headerEffects.ts

export const initializeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return () => {}; // Return no-op if canvas is not provided
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {}; // Return no-op if ctx isn't available
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Handle window resize
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
  
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
  
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
      }
  
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
  
        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
  
      draw(ctx: CanvasRenderingContext2D) { // ctx now passed as argument
        ctx.fillStyle = "#00fff0";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  
    // Vector Shape class (rotating triangles, squares)
    class VectorShape {
      x: number;
      y: number;
      size: number;
      rotation: number;
      speedRotation: number;
      shapeType: "triangle" | "square";
  
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 20 + 10;
        this.rotation = Math.random() * 360;
        this.speedRotation = Math.random() * 0.02 + 0.01;
        this.shapeType = Math.random() > 0.5 ? "triangle" : "square";
      }
  
      update() {
        this.rotation += this.speedRotation;
      }
  
      draw(ctx: CanvasRenderingContext2D) { // ctx passed as argument here too
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = "#ff75d8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
  
        if (this.shapeType === "triangle") {
          for (let i = 0; i < 3; i++) {
            ctx.lineTo(
              this.size * Math.cos((i * 2 * Math.PI) / 3),
              this.size * Math.sin((i * 2 * Math.PI) / 3)
            );
          }
        } else {
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(
              this.size * Math.cos((i * 2 * Math.PI) / 4),
              this.size * Math.sin((i * 2 * Math.PI) / 4)
            );
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }
  
    const particlesArray: Particle[] = [];
    const vectorShapesArray: VectorShape[] = [];
    const numberOfParticles = (width * height) / 8000;
    const numberOfShapes = 10;
  
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  
    for (let i = 0; i < numberOfShapes; i++) {
      vectorShapesArray.push(new VectorShape());
    }
  
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
  
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw(ctx); // Now passing ctx
      });
  
      vectorShapesArray.forEach((shape) => {
        shape.update();
        shape.draw(ctx); // Now passing ctx
      });
  
      connectParticles(particlesArray, ctx);
  
      requestAnimationFrame(animate);
    };
  
    const connectParticles = (particles: Particle[], ctx: CanvasRenderingContext2D) => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;
          if (distance < 4000) {
            ctx.strokeStyle = "rgba(0, 255, 240, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };
  
    animate();
  
    // Cleanup event listeners and animation frames on window unload
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };
  