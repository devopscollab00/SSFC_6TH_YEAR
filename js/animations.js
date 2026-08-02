// Scroll Reveal Animations
class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up");
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    this.init();
  }
  
  init() {
    document.querySelectorAll(".fade-up:not(.fade-up)").forEach((el) => {
      this.observer.observe(el);
    });
  }
}

// Animated Counter
class AnimatedCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = parseInt(target) || 0;
    this.current = 0;
    this.duration = duration;
    this.startTime = null;
    this.animated = false;
  }
  
  animate(currentTime) {
    if (!this.startTime) this.startTime = currentTime;
    
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    this.current = Math.floor(this.target * progress);
    this.element.textContent = this.current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame((time) => this.animate(time));
    } else {
      this.element.textContent = this.target.toLocaleString();
    }
  }
  
  start() {
    if (!this.animated) {
      this.animated = true;
      requestAnimationFrame((time) => this.animate(time));
    }
  }
}

// Counter Animation on Scroll
class CounterScroll {
  constructor() {
    this.counters = document.querySelectorAll("[data-target]");
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = new AnimatedCounter(
              entry.target,
              entry.target.getAttribute("data-target")
            );
            counter.start();
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    this.init();
  }
  
  init() {
    this.counters.forEach((counter) => {
      this.intersectionObserver.observe(counter);
    });
  }
}

// Smooth Hover Effects
class HoverEffect {
  constructor() {
    this.setupButtonHovers();
    this.setupCardHovers();
  }
  
  setupButtonHovers() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseenter", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        btn.style.setProperty("--mouse-x", x + "px");
        btn.style.setProperty("--mouse-y", y + "px");
      });
    });
  }
  
  setupCardHovers() {
    document.querySelectorAll(".detail-card, .stat-card, .gallery-item").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-4px)";
      });
      
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  }
}

// Parallax Effect
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll("[data-parallax]");
    if (this.elements.length > 0) {
      window.addEventListener("scroll", () => this.update());
    }
  }
  
  update() {
    const scrollY = window.scrollY;
    this.elements.forEach((el) => {
      const speed = el.getAttribute("data-parallax") || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
}

// Fade animations on load
function setupFadeAnimations() {
  const elements = document.querySelectorAll(".fade-up");
  elements.forEach((el, index) => {
    const delay = index * 0.1;
    el.style.animationDelay = delay + "s";
    el.style.opacity = "1";
  });
}

// Sticky Navigation on Scroll
class StickyNav {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.lastScroll = 0;
    
    if (this.navbar) {
      window.addEventListener("scroll", () => this.handleScroll());
    }
  }
  
  handleScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      this.navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      this.navbar.style.boxShadow = "none";
    }
    
    this.lastScroll = currentScroll;
  }
}

// Modal Animations
function setupModalAnimations() {
  const modal = document.getElementById("successModal");
  if (!modal) return;
  
  window.closeModal = function() {
    modal.classList.remove("show");
  };
}

// Page load animations
document.addEventListener("DOMContentLoaded", () => {
  setupFadeAnimations();
  new ScrollReveal();
  new CounterScroll();
  new HoverEffect();
  new ParallaxEffect();
  new StickyNav();
  setupModalAnimations();
  
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        util.smoothScroll(target);
      }
    });
  });
});

// Confetti Animation
function createConfetti() {
  const confettiContainer = document.getElementById("confetti");
  if (!confettiContainer) return;
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.delay = Math.random() * 0.5 + "s";
    confetti.style.backgroundColor = [
      "#d4a652",
      "#1a2d4d",
      "#55aa8a",
      "#ff69b4",
    ][Math.floor(Math.random() * 4)];
    
    confettiContainer.appendChild(confetti);
    
    const animation = confetti.animate(
      [
        { transform: "translateY(0) rotateZ(0deg)", opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotateZ(720deg)`, opacity: 0 },
      ],
      {
        duration: 2000 + Math.random() * 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }
    );
    
    animation.onfinish = () => confetti.remove();
  }
}

// Export for use in other modules
window.createConfetti = createConfetti;
window.AnimatedCounter = AnimatedCounter;
