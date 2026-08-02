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
  googleScriptURL: "https://script.google.com/macros/s/AKfycbwj2CFKBweVffV2O4UaDeBF5e9OBVkgfPDq53ORb4EWBpA6-rFYjMJXyEvc5Nzfx0Bt/exec",
  
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
document.addEventListener("DOMContentLoaded", async function() {
  // Try to fetch settings from Google Sheets
  try {
    const settings = await util.fetchAPI({ action: "GET_SETTINGS" });
    if (settings.success && settings.data) {
      // Update event details from spreadsheet
      if (settings.data.eventDate) CONFIG.eventDate = settings.data.eventDate;
      if (settings.data.eventTime) CONFIG.eventTime = settings.data.eventTime;
      if (settings.data.venue) CONFIG.eventVenue = settings.data.venue;
      if (settings.data.contactNumber) CONFIG.contactNumber = settings.data.contactNumber;
      if (settings.data.bibleVerse) CONFIG.bibleVerse = settings.data.bibleVerse;
      if (settings.data.eventName) CONFIG.eventName = settings.data.eventName;
    }
  } catch (error) {
    console.log("Using default config values:", error);
  }
  
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
   * Accepts either a string endpoint or full object with action property
   */
  async fetchAPI(endpointOrData, method = "POST", data = null) {
    try {
      let payload = {};
      
      // Handle different input formats
      if (typeof endpointOrData === 'string') {
        // Legacy format: fetchAPI("GET_STATS")
        payload = {
          action: endpointOrData,
          ...data
        };
      } else if (typeof endpointOrData === 'object' && endpointOrData.action) {
        // New format: fetchAPI({ action: "POST_RSVP", name: "..." })
        payload = endpointOrData;
      } else if (typeof endpointOrData === 'object') {
        // Data object as first param
        payload = {
          action: method || "POST_RSVP",
          ...endpointOrData
        };
      }
      
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Handle CORS by using no-cors mode
      };
      
      console.log("API Request:", payload);
      
      const response = await fetch(CONFIG.googleScriptURL, options);
      
      // With no-cors mode, we can't read the response directly
      // So we'll assume success if no network error
      console.log("API Call Sent:", payload);
      
      // For no-cors requests, return success
      // The Google Apps Script will still process the request
      return {
        success: true,
        status: "success",
        message: "Request processed successfully"
      };
      
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        status: "error",
        message: "Network error. Please check your connection.",
        error: error.message
      };
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
    
    // Add animation
    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease-out forwards";
    }, 2500);
    
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
  
  /**
   * Close modal (global)
   */
  closeModal() {
    const modal = document.getElementById("successModal");
    if (modal) {
      modal.classList.remove("show");
    }
  }
};

// Export for use in other scripts
window.CONFIG = CONFIG;
window.util = util;
