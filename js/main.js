// Main Application Logic
class ChurchAnniversaryApp {
  constructor() {
    this.init();
  }
  
  init() {
    this.loadGallery();
    this.setupMobileMenu();
    this.preloadImages();
  }
  
  loadGallery() {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = "";
    
    CONFIG.gallery.forEach((imagePath, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item fade-up";
      galleryItem.style.animationDelay = (index * 0.1) + "s";
      galleryItem.innerHTML = `
        <img src="${imagePath}" alt="Gallery image ${index + 1}" loading="lazy">
      `;
      
      galleryItem.addEventListener("click", () => {
        this.openGalleryPreview(imagePath);
      });
      
      galleryGrid.appendChild(galleryItem);
    });
  }
  
  openGalleryPreview(imagePath) {
    const modal = document.createElement("div");
    modal.className = "gallery-modal";
    modal.innerHTML = `
      <div class="gallery-preview">
        <button class="gallery-close">&times;</button>
        <img src="${imagePath}" alt="Gallery preview">
      </div>
    `;
    
    const styles = `
      .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
      }
      
      .gallery-preview {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
      }
      
      .gallery-preview img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      
      .gallery-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .gallery-close:hover {
        transform: scale(1.2);
      }
    `;
    
    if (!document.getElementById("gallery-modal-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "gallery-modal-styles";
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector(".gallery-close");
    closeBtn.addEventListener("click", () => modal.remove());
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }
  
  setupMobileMenu() {
    // Add mobile menu toggle
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    
    const navContent = navbar.querySelector(".navbar-content");
    const menuToggle = document.createElement("button");
    menuToggle.className = "mobile-menu-toggle";
    menuToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `;
    
    const styles = `
      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text);
      }
      
      @media (max-width: 768px) {
        .mobile-menu-toggle {
          display: block;
        }
        
        .nav-links {
          display: none !important;
        }
        
        .nav-links.active {
          display: flex !important;
        }
      }
    `;
    
    if (!document.getElementById("mobile-menu-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "mobile-menu-styles";
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
    
    menuToggle.addEventListener("click", () => {
      const navLinks = document.querySelector(".nav-links");
      navLinks.classList.toggle("active");
    });
    
    navContent.appendChild(menuToggle);
  }
  
  preloadImages() {
    // Preload critical images
    const criticalImages = [
      "/assets/logo/logo.png",
      CONFIG.gallery[0],
    ];
    
    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    if ("PerformanceObserver" in window) {
      try {
        // Observe Core Web Vitals
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.value}ms`);
          }
        });
        
        perfObserver.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] });
      } catch (e) {
        console.log("Performance monitoring not available");
      }
    }
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  const app = new ChurchAnniversaryApp();
  window.app = app;
  
  // Performance monitoring
  if (CONFIG.motion.enableScrollReveal !== false) {
    new PerformanceMonitor();
  }
  
  // Log app ready
  console.log("Church Anniversary Website Ready");
  console.log("Configuration:", {
    church: CONFIG.churchName,
    event: CONFIG.eventName,
    date: CONFIG.eventDate,
  });
});

// Service Worker Registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register("/sw.js").catch(() => {
  //   console.log("Service worker not available");
  // });
}

// Global error handling
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
