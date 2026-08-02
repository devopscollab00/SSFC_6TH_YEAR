// Particle Animation for Hero Background - Enhanced
class ParticleAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.particles = [];
    this.animationId = null;
    this.time = 0;
    
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
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }
  
  init() {
    this.particles = [];
    const particleCount = CONFIG.motion.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const distance = Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.3;
      
      this.particles.push({
        x: this.centerX + Math.cos(angle) * distance,
        y: this.centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.4 + 0.15,
        baseOpacity: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        hue: Math.random() * 60 + 200, // Blue to Gold range
        lifetime: 0,
        maxLifetime: Math.random() * 500 + 300,
      });
    }
  }
  
  draw() {
    // Clear with slight trail effect for motion blur
    this.ctx.fillStyle = `rgba(250, 248, 246, 0.1)`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      const opacityVariation = Math.sin(this.time * particle.pulseSpeed) * 0.2;
      const currentOpacity = particle.baseOpacity + opacityVariation;
      
      // Create gradient for particle
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 2
      );
      
      // Color scheme based on position
      const colorPrimary = `hsla(${particle.hue}, 85%, 50%, ${currentOpacity})`;
      const colorSecondary = `hsla(${particle.hue + 20}, 90%, 60%, ${currentOpacity * 0.5})`;
      
      gradient.addColorStop(0, colorPrimary);
      gradient.addColorStop(1, colorSecondary);
      
      // Draw particle with glow
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Subtle outer glow
      this.ctx.strokeStyle = `hsla(${particle.hue}, 85%, 50%, ${currentOpacity * 0.3})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // Draw connections between nearby particles
      for (let j = index + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const connectionOpacity = (1 - distance / 150) * (currentOpacity + other.baseOpacity) * 0.3;
          this.ctx.strokeStyle = `rgba(212, 166, 82, ${connectionOpacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.stroke();
        }
      }
    });
  }
  
  update() {
    this.time++;
    
    this.particles.forEach((particle) => {
      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Apply gentle attraction to center
      const dx = this.centerX - particle.x;
      const dy = this.centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 50) {
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * 0.02;
        particle.vy += Math.sin(angle) * 0.02;
      }
      
      // Damping for smooth movement
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      
      // Bounce off walls with damping
      const padding = particle.radius;
      if (particle.x - padding < 0) {
        particle.x = padding;
        particle.vx = Math.abs(particle.vx) * 0.8;
      }
      if (particle.x + padding > this.canvas.width) {
        particle.x = this.canvas.width - padding;
        particle.vx = -Math.abs(particle.vx) * 0.8;
      }
      
      if (particle.y - padding < 0) {
        particle.y = padding;
        particle.vy = Math.abs(particle.vy) * 0.8;
      }
      if (particle.y + padding > this.canvas.height) {
        particle.y = this.canvas.height - padding;
        particle.vy = -Math.abs(particle.vy) * 0.8;
      }
      
      // Opacity variation
      particle.opacity = particle.baseOpacity + Math.sin(this.time * particle.pulseSpeed) * 0.15;
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
