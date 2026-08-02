// Statistics Management
class StatisticsManager {
  constructor() {
    this.stats = {
      peopleConfirmed: 0,
      confirmations: 0,
      participatingChurches: 0,
      unableToAttend: 0,
    };
    this.init();
  }
  
  async init() {
    await this.fetchStats();
    this.setupAutoRefresh();
  }
  
  async fetchStats() {
    try {
      const response = await util.fetchAPI("GET_STATS");
      
      if (response.success || response.status === "success") {
        this.stats = {
          peopleConfirmed: response.peopleConfirmed || 0,
          confirmations: response.confirmations || 0,
          participatingChurches: response.participatingChurches || 0,
          unableToAttend: response.unableToAttend || 0,
        };
        
        this.updateDisplay();
      }
    } catch (error) {
      console.log("Using default statistics");
      this.updateDisplay();
    }
  }
  
  updateDisplay() {
    const elements = {
      peopleConfirmed: document.getElementById("statPeopleConfirmed"),
      confirmations: document.getElementById("statConfirmations"),
      participatingChurches: document.getElementById("statChurches"),
    };
    
    Object.entries(elements).forEach(([key, element]) => {
      if (element) {
        const statKey = key === "participatingChurches" ? "participatingChurches" : key;
        element.setAttribute("data-target", this.stats[statKey]);
      }
    });
  }
  
  setupAutoRefresh() {
    // Refresh stats every 10 seconds
    setInterval(() => {
      this.fetchStats();
    }, 10000);
  }
}

// Initialize statistics when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const statsManager = new StatisticsManager();
  window.statsManager = statsManager;
});
