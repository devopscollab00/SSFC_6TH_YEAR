class RSVPForm {
  constructor() {
    this.form = document.getElementById("rsvpForm");
    this.modal = document.getElementById("successModal");
    this.attendanceField = document.querySelector('input[name="attendance"]');
    this.peopleGroup = document.getElementById("peopleGroup");
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    
    // Show/hide number of people field
    document.querySelectorAll('input[name="attendance"]').forEach((input) => {
      input.addEventListener("change", () => this.togglePeopleField());
    });
    
    // Real-time validation
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("change", () => this.validateField(field));
    });
  }
  
  togglePeopleField() {
    const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
    if (selectedAttendance && selectedAttendance.value === "yes") {
      this.peopleGroup.style.display = "block";
      document.getElementById("numberOfPeople").required = true;
    } else {
      this.peopleGroup.style.display = "none";
      document.getElementById("numberOfPeople").required = false;
      document.getElementById("numberOfPeople").value = "";
    }
  }
  
  validateField(field) {
    const errorElement = document.getElementById(field.name + "Error");
    let isValid = true;
    let errorMessage = "";
    
    if (field.required && !field.value.trim()) {
      isValid = false;
      errorMessage = `${field.previousElementSibling?.textContent?.split("*")[0] || "This field"} is required`;
    } else if (field.name === "numberOfPeople") {
      const num = parseInt(field.value);
      if (field.required && (!field.value || num < 1 || num > 50)) {
        isValid = false;
        errorMessage = "Please enter a number between 1 and 50";
      }
    } else if (field.type === "email" && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(field.value);
      if (!isValid) {
        errorMessage = "Please enter a valid email address";
      }
    }
    
    if (errorElement) {
      if (isValid) {
        errorElement.classList.remove("show");
        field.classList.remove("error");
      } else {
        errorElement.textContent = errorMessage;
        errorElement.classList.add("show");
        field.classList.add("error");
      }
    }
    
    return isValid;
  }
  
  validateAttendanceRadio() {
    const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
    const attendanceError = document.getElementById("attendanceError");
    
    if (!selectedAttendance) {
      if (attendanceError) {
        attendanceError.textContent = "Please select whether you'll attend";
        attendanceError.classList.add("show");
      }
      return false;
    } else {
      if (attendanceError) {
        attendanceError.classList.remove("show");
      }
      return true;
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    console.log("Form submission started...");
    
    // Validate attendance selection first
    if (!this.validateAttendanceRadio()) {
      util.showToast("Please select whether you'll attend", "error");
      return;
    }
    
    // Validate all fields
    let isFormValid = true;
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      util.showToast("Please fix the errors above", "error");
      return;
    }
    
    // Show loading state
    const submitBtn = this.form.querySelector(".btn-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    
    try {
      // Collect form data
      const formData = {
        action: "POST_RSVP",
        name: document.getElementById("name").value.trim(),
        church: document.getElementById("church").value.trim(),
        attendance: document.querySelector('input[name="attendance"]:checked').value,
        numberOfPeople: document.querySelector('input[name="attendance"]:checked').value === "yes" 
          ? (document.getElementById("numberOfPeople").value || "1")
          : "1",
        message: document.getElementById("message").value.trim(),
        rsvpId: util.generateID(),
        timestamp: new Date().toISOString()
      };
      
      console.log("Submitting form data:", formData);
      
      // Submit to Google Apps Script
      const response = await util.fetchAPI(formData);
      
      console.log("API Response:", response);
      
      // With no-cors mode, we consider any non-network error as success
      if (response.success !== false) {
        this.showSuccessModal();
        this.form.reset();
        this.togglePeopleField();
        
        // Update statistics after successful submission
        setTimeout(() => {
          if (window.treeAnimation) {
            window.treeAnimation.updateFromAPI();
          }
          this.updateStatistics();
        }, 500);
        
        util.showToast("✓ RSVP submitted successfully! Thank you for confirming.", "success");
      } else {
        const errorMsg = response.message || "Submission failed. Please try again.";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Submission error:", error);
      util.showToast(error.message || "Error submitting RSVP. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
    }
  }
  
  showSuccessModal() {
    if (this.modal) {
      this.modal.classList.add("show");
      createConfetti();
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        this.modal.classList.remove("show");
      }, 5000);
    }
  }
  
  async updateStatistics() {
    try {
      const stats = await util.fetchAPI({ action: "GET_STATS" });
      
      // Update stat cards on home page
      const peopleCard = document.getElementById("statPeopleConfirmed");
      const confirmCard = document.getElementById("statConfirmations");
      const churchCard = document.getElementById("statChurches");
      
      if (peopleCard && stats.peopleConfirmed !== undefined) {
        const oldValue = parseInt(peopleCard.textContent);
        if (oldValue !== stats.peopleConfirmed) {
          new AnimatedCounter(peopleCard, stats.peopleConfirmed, 500).start();
        }
      }
      
      if (confirmCard && stats.confirmations !== undefined) {
        const oldValue = parseInt(confirmCard.textContent);
        if (oldValue !== stats.confirmations) {
          new AnimatedCounter(confirmCard, stats.confirmations, 500).start();
        }
      }
      
      if (churchCard && stats.participatingChurches !== undefined) {
        const oldValue = parseInt(churchCard.textContent);
        if (oldValue !== stats.participatingChurches) {
          new AnimatedCounter(churchCard, stats.participatingChurches, 500).start();
        }
      }
    } catch (error) {
      console.log("Could not update statistics:", error);
    }
  }
}

// Animated Counter Class
class AnimatedCounter {
  constructor(element, target, duration = 1000) {
    this.element = element;
    this.target = target;
    this.duration = duration;
    this.start = parseInt(element.textContent) || 0;
    this.increment = (this.target - this.start) / (duration / 16);
    this.current = this.start;
    this.animationId = null;
  }
  
  start() {
    const animate = () => {
      this.current += this.increment;
      
      if ((this.increment > 0 && this.current >= this.target) ||
          (this.increment < 0 && this.current <= this.target)) {
        this.element.textContent = Math.floor(this.target);
      } else {
        this.element.textContent = Math.floor(this.current);
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Confetti animation
function createConfetti() {
  const container = document.getElementById("confetti");
  if (!container) return;
  
  const colors = ["#d4a652", "#55aa8a", "#1a2d4d", "#fac858"];
  
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animation = `fall ${2 + Math.random() * 1}s ease-in forwards`;
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    container.appendChild(piece);
    
    setTimeout(() => piece.remove(), 3000);
  }
}

// Add keyframe for confetti
if (!document.getElementById("confetti-styles")) {
  const style = document.createElement("style");
  style.id = "confetti-styles";
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotateZ(360deg);
        opacity: 0;
      }
    }
    
    .confetti-piece {
      position: fixed;
      width: 10px;
      height: 10px;
      pointer-events: none;
      border-radius: 2px;
      z-index: 2001;
    }
  `;
  document.head.appendChild(style);
}

// Initialize form when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new RSVPForm();
});

// Add toast notification styles dynamically
const style = document.createElement("style");
style.textContent = `
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideUp 0.3s ease-out;
    max-width: 90vw;
  }
  
  .toast-success {
    border-left: 4px solid #55aa8a;
    color: #22863a;
  }
  
  .toast-error {
    border-left: 4px solid #dc2626;
    color: #7f1d1d;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);
