// Admin Dashboard Logic
class AdminDashboard {
  constructor() {
    this.isLoggedIn = false;
    this.allRSVPs = [];
    this.filteredRSVPs = [];
    this.init();
  }

  init() {
    this.setupLoginForm();
    this.checkSessionStorage();
  }

  setupLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }
  }

  checkSessionStorage() {
    const sessionToken = sessionStorage.getItem("adminLoggedIn");
    if (sessionToken) {
      this.isLoggedIn = true;
      this.showDashboard();
      this.loadDashboardData();
      this.setupEventSettingsForm();
    }
  }

  setupEventSettingsForm() {
    const form = document.getElementById("eventSettingsForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleEventSettingsSubmit(e));
      loadEventSettings();
    }
  }

  async handleEventSettingsSubmit(e) {
    e.preventDefault();

    const settingsData = {
      action: "UPDATE_SETTINGS",
      eventName: document.getElementById("eventName").value,
      theme: document.getElementById("eventTheme").value,
      bibleVerse: document.getElementById("bibleVerse").value,
      eventDate: document.getElementById("eventDate").value,
      eventTime: document.getElementById("eventTime").value,
      venue: document.getElementById("eventVenue").value,
      mapsUrl: document.getElementById("mapsUrl").value,
      contactPerson: document.getElementById("contactPerson").value,
      contactNumber: document.getElementById("contactNumber").value,
    };

    try {
      const response = await util.fetchAPI(settingsData);
      const messageEl = document.getElementById("settingsMessage");

      if (response.success || response.status === "success") {
        messageEl.classList.remove("error");
        messageEl.classList.add("success");
        messageEl.textContent = "Settings saved successfully!";
        
        // Update CONFIG
        CONFIG.eventName = settingsData.eventName;
        CONFIG.eventDate = settingsData.eventDate;
        CONFIG.eventTime = settingsData.eventTime;
        CONFIG.eventVenue = settingsData.venue;
        CONFIG.bibleVerse = settingsData.bibleVerse;
        CONFIG.contactPerson = settingsData.contactPerson;
        CONFIG.contactNumber = settingsData.contactNumber;
        
        setTimeout(() => {
          messageEl.classList.remove("success");
        }, 3000);
      } else {
        throw new Error(response.message || "Failed to save settings");
      }
    } catch (error) {
      const messageEl = document.getElementById("settingsMessage");
      messageEl.classList.remove("success");
      messageEl.classList.add("error");
      messageEl.textContent = "Error saving settings: " + error.message;
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("loginError");

    // Hash or verify password (client-side - not secure, use server validation)
    const hashedPassword = this.simpleHash(password);
    const expectedHash = this.simpleHash(CONFIG.admin.passwordHash);

    if (password === CONFIG.admin.passwordHash) {
      sessionStorage.setItem("adminLoggedIn", "true");
      this.isLoggedIn = true;
      this.showDashboard();
      this.loadDashboardData();
    } else {
      errorElement.textContent = "Invalid password";
      errorElement.classList.add("show");
    }
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash.toString();
  }

  showDashboard() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  }

  async loadDashboardData() {
    await this.loadStatistics();
    await this.loadAllRSVPs();
  }

  async loadStatistics() {
    try {
      const response = await util.fetchAPI("GET_STATS");
      if (response.success || response.status === "success") {
        document.getElementById("dashPeopleConfirmed").textContent = 
          response.peopleConfirmed || 0;
        document.getElementById("dashConfirmations").textContent = 
          response.confirmations || 0;
        document.getElementById("dashChurches").textContent = 
          response.participatingChurches || 0;
        document.getElementById("dashUnableToAttend").textContent = 
          response.unableToAttend || 0;

        // Refresh every 5 seconds
        setTimeout(() => this.loadStatistics(), 5000);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  }

  async loadAllRSVPs() {
    try {
      const response = await util.fetchAPI("GET_ALL_RSVPS", "GET", {
        password: CONFIG.admin.passwordHash,
      });

      if (response.success && response.data) {
        this.allRSVPs = response.data;
        this.filteredRSVPs = [...this.allRSVPs];
        this.renderTable();
      }
    } catch (error) {
      console.error("Error loading RSVPs:", error);
      document.getElementById("confirmsTable").innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-error">
            Error loading confirmations
          </td>
        </tr>
      `;
    }
  }

  renderTable(rsvps = null) {
    const table = document.getElementById("confirmsTable");
    const data = rsvps || this.filteredRSVPs;

    if (data.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">No confirmations yet</td>
        </tr>
      `;
      return;
    }

    table.innerHTML = data
      .map((rsvp) => {
        const date = new Date(rsvp.timestamp).toLocaleDateString();
        const attendanceClass = rsvp.attendance === "yes" ? "text-success" : "text-error";
        const attendanceBadge = rsvp.attendance === "yes" 
          ? '<span class="badge badge-success">Attending</span>'
          : '<span class="badge badge-error">Not Attending</span>';

        return `
          <tr>
            <td><strong>${rsvp.rsvpId}</strong></td>
            <td>${rsvp.name}</td>
            <td>${rsvp.church}</td>
            <td>${attendanceBadge}</td>
            <td>${rsvp.numberOfPeople}</td>
            <td>${date}</td>
            <td title="${rsvp.message}">
              ${rsvp.message ? rsvp.message.substring(0, 30) + "..." : "-"}
            </td>
          </tr>
        `;
      })
      .join("");
  }
}

// Global Functions
function logout() {
  sessionStorage.removeItem("adminLoggedIn");
  location.reload();
}

function loadEventSettings() {
  // Load event settings from CONFIG
  document.getElementById("eventName").value = CONFIG.eventName || "";
  document.getElementById("eventTheme").value = CONFIG.eventName?.split(" ")[0] || "";
  document.getElementById("bibleVerse").value = CONFIG.bibleVerse || "";
  document.getElementById("eventDate").value = CONFIG.eventDate || "";
  document.getElementById("eventTime").value = CONFIG.eventTime || "";
  document.getElementById("eventVenue").value = CONFIG.eventVenue || "";
  document.getElementById("mapsUrl").value = "";
  document.getElementById("contactPerson").value = CONFIG.contactPerson || "";
  document.getElementById("contactNumber").value = CONFIG.contactNumber || "";
}

function searchRSVP() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("searchResults");

  if (!searchInput) {
    resultsDiv.innerHTML = "";
    return;
  }

  const results = admin.allRSVPs.filter(
    (rsvp) =>
      rsvp.rsvpId.toLowerCase().includes(searchInput) ||
      rsvp.name.toLowerCase().includes(searchInput) ||
      rsvp.church.toLowerCase().includes(searchInput)
  );

  if (results.length === 0) {
    resultsDiv.innerHTML = '<p class="text-center text-muted">No results found</p>';
    return;
  }

  resultsDiv.innerHTML = results
    .map(
      (rsvp) => `
    <div class="result-item">
      <div class="result-title">${rsvp.name}</div>
      <div class="result-details">
        <strong>RSVP ID:</strong> ${rsvp.rsvpId}<br>
        <strong>Church:</strong> ${rsvp.church}<br>
        <strong>Attendance:</strong> ${rsvp.attendance === "yes" ? "Yes" : "No"}<br>
        <strong>People:</strong> ${rsvp.numberOfPeople}<br>
        <strong>Date:</strong> ${new Date(rsvp.timestamp).toLocaleString()}<br>
        ${rsvp.message ? `<strong>Message:</strong> ${rsvp.message}` : ""}
      </div>
    </div>
  `
    )
    .join("");
}

function applyFilter() {
  const filter = document.querySelector('input[name="filter"]:checked').value;

  if (filter === "all") {
    admin.filteredRSVPs = [...admin.allRSVPs];
  } else {
    admin.filteredRSVPs = admin.allRSVPs.filter((rsvp) => rsvp.attendance === filter);
  }

  admin.renderTable();
}

function exportToCSV() {
  if (admin.allRSVPs.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = [
    "RSVP ID",
    "Name",
    "Church",
    "Attendance",
    "Number of People",
    "Message",
    "Date",
  ];

  const rows = admin.allRSVPs.map((rsvp) => [
    rsvp.rsvpId,
    rsvp.name,
    rsvp.church,
    rsvp.attendance,
    rsvp.numberOfPeople,
    rsvp.message || "",
    new Date(rsvp.timestamp).toLocaleString(),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes in strings
          if (typeof cell === "string" && cell.includes(",")) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(",")
    ),
  ].join("\n");

  // Download CSV
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
  element.setAttribute("download", `church-anniversary-rsvps-${new Date().toISOString().split("T")[0]}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function closeModal() {
  util.closeModal();
}

// Initialize admin dashboard
let admin;
document.addEventListener("DOMContentLoaded", () => {
  admin = new AdminDashboard();
});
