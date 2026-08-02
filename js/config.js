// Configuration - EDIT THESE VALUES
const CONFIG = {
  // Event Information
  churchName: "Solid Foundation Church",
  eventName: "6th Church Anniversary Celebration",
  bibleVerse: "For as in Adam all die, so in Christ all will be made alive. - 1 Corinthians 15:22",
  
  // Event Details
  eventDate: "August 25, 2024",
  eventTime: "9:00 AM - 5:00 PM",
  eventVenue: "Solid Foundation Church, Main Sanctuary",
  eventLocation: "1234 Church Street, Your City, State 12345",
  contactPerson: "Pastor John Doe",
  contactNumber: "+1 (555) 123-4567",
  contactEmail: "info@church.com",
  
  // Google Apps Script
  googleScriptURL: "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercalc", // Update after deployment
  
  // Social Links (Optional)
  socialLinks: {
    facebook: "https://facebook.com/yourchurch",
    instagram: "https://instagram.com/yourchurch",
    twitter: "https://twitter.com/yourchurch",
  },
  
  // Gallery Images (replaceable via /assets/gallery/)
  gallery: [
    "/assets/gallery/1.jpg",
    "/assets/gallery/2.jpg",
    "/assets/gallery/3.jpg",
    "/assets/gallery/4.jpg",
    "/assets/gallery/5.jpg",
    "/assets/gallery/6.jpg",
  ],
  
  // Motion Settings
  motion: {
    enableParticles: true,
    particleCount: 50,
    enableTreeAnimation: true,
    enableScrollReveal: true,
    animationDuration: 0.6,
  },
  
  // Theme Colors (can be customized)
  colors: {
    primary: "#d4a652",
    secondary: "#1a2d4d",
    accent: "#55aa8a",
    background: "#faf8f6",
    text: "#1a1a1a",
  },
  
  // Admin Dashboard
  admin: {
    passwordHash: "admin123", // Change this in production
    dashboardRefreshInterval: 5000, // milliseconds
  },
};

// Initialize Configuration
document.addEventListener("DOMContentLoaded", function() {
  // Update all text content
  document.getElementById("eventDate").textContent = CONFIG.eventDate;
  document.getElementById("eventTime").textContent = CONFIG.eventTime;
  document.getElementById("eventVenue").textContent = CONFIG.eventVenue;
  document.getElementById("eventContact").textContent = CONFIG.contactNumber;
  document.getElementById("bibleVerse").textContent = CONFIG.bibleVerse;
  document.getElementById("footerContact").textContent = `${CONFIG.contactPerson}\n${CONFIG.contactNumber}`;
  document.getElementById("yearCopy").textContent = new Date().getFullYear();
  
  // Update page title
  document.title = CONFIG.churchName + " - " + CONFIG.eventName;
  
  // Apply custom colors
  Object.entries(CONFIG.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
});

// Utility Functions
const util = {
  /**
   * Fetch data from Google Apps Script
   */
  async fetchAPI(endpoint, method = "GET", data = null) {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      if (method !== "GET" && data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(CONFIG.googleScriptURL, options);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  
  /**
   * Format date
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
  
  /**
   * Format time
   */
  formatTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },
  
  /**
   * Generate unique ID
   */
  generateID() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const randomLetters = Array(3)
      .fill()
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");
    return `${randomLetters}-${numbers}`;
  },
  
  /**
   * Show toast notification
   */
  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },
  
  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Smooth scroll to element
   */
  smoothScroll(element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  },
};

// Export for use in other scripts
window.CONFIG = CONFIG;
window.util = util;
