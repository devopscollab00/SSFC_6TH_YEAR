// Particle Animation for Hero Background
class ParticleAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animationId = null;
    
    this.resize();
    window.addEventListener("resize", () => this.resize());
    
    if (CONFIG.motion.enableParticles) {
      this.init();
      this.animate();
    }
  }
  
  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
  
  init() {
    this.particles = [];
    const particleCount = CONFIG.motion.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle) => {
      this.ctx.fillStyle = `rgba(212, 166, 82, ${particle.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw subtle connections
      this.particles.forEach((other) => {
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 100) {
          this.ctx.strokeStyle = `rgba(212, 166, 82, ${(particle.opacity + other.opacity) * 0.1})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.stroke();
        }
      });
    });
  }
  
  update() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off walls
      if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.canvas.width) {
        particle.vx *= -1;
        particle.x = Math.max(particle.radius, Math.min(this.canvas.width - particle.radius, particle.x));
      }
      
      if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.canvas.height) {
        particle.vy *= -1;
        particle.y = Math.max(particle.radius, Math.min(this.canvas.height - particle.radius, particle.y));
      }
      
      // Slight opacity fluctuation
      particle.opacity += (Math.random() - 0.5) * 0.02;
      particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity));
    });
  }
  
  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize particles when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const particles = new ParticleAnimation("particleCanvas");
  window.particleAnimation = particles;
});
