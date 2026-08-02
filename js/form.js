// Form Validation & Submission
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
      if (num < 1 || num > 50) {
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
  
  async handleSubmit(e) {
    e.preventDefault();
    
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
        name: document.getElementById("name").value,
        church: document.getElementById("church").value,
        attendance: document.querySelector('input[name="attendance"]:checked').value,
        numberOfPeople: document.getElementById("numberOfPeople").value || 1,
        message: document.getElementById("message").value,
      };
      
      console.log("Submitting form data:", formData);
      
      // Submit to Google Apps Script
      const response = await util.fetchAPI("POST_RSVP", "POST", formData);
      
      console.log("API Response:", response);
      
      if (response.success || response.status === "success") {
        this.showSuccessModal();
        this.form.reset();
        this.togglePeopleField();
        
        // Update statistics
        if (window.treeAnimation) {
          window.treeAnimation.updateFromAPI();
        }
        
        // Fetch updated stats
        this.updateStatistics();
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      util.showToast("Error submitting RSVP. Please try again.", "error");
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
      const stats = await util.fetchAPI("GET_STATS");
      
      // Update stat cards
      const peopleCard = document.getElementById("statPeopleConfirmed");
      const confirmCard = document.getElementById("statConfirmations");
      const churchCard = document.getElementById("statChurches");
      
      if (peopleCard) {
        const oldValue = parseInt(peopleCard.textContent);
        if (oldValue !== stats.peopleConfirmed) {
          new AnimatedCounter(peopleCard, stats.peopleConfirmed, 500).start();
        }
      }
      
      if (confirmCard) {
        const oldValue = parseInt(confirmCard.textContent);
        if (oldValue !== stats.confirmations) {
          new AnimatedCounter(confirmCard, stats.confirmations, 500).start();
        }
      }
      
      if (churchCard) {
        const oldValue = parseInt(churchCard.textContent);
        if (oldValue !== stats.participatingChurches) {
          new AnimatedCounter(churchCard, stats.participatingChurches, 500).start();
        }
      }
    } catch (error) {
      console.log("Could not update statistics");
    }
  }
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
  }
  
  .toast-success {
    border-left: 4px solid #55aa8a;
    color: #22863a;
  }
  
  .toast-error {
    border-left: 4px solid #dc2626;
    color: #7f1d1d;
  }
  
  .confetti-piece {
    position: fixed;
    width: 10px;
    height: 10px;
    pointer-events: none;
    bottom: 100vh;
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
