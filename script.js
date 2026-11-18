// EcoRakshak - Water and Waste Management Website
// This JavaScript file is written using simple functions and beginner-friendly code.

// Get an HTML element by its id.
function getElement(id) {
    return document.getElementById(id);
}

// These are the civic helpline details shown in the report form.
const helplines = {
    KDMC: { name: "Kalyan-Dombivli Municipal Corporation", phone: "0251-2206206" },
    BMC: { name: "Brihanmumbai Municipal Corporation", phone: "1916" },
    TMC: { name: "Thane Municipal Corporation", phone: "022-25363580" },
    OTHER: { name: "Local municipal office", phone: "1916" }
};

// Water and waste have different report categories.
const waterCategories = [
    "Pipeline leakage",
    "Broken water connection",
    "Overflowing water tank",
    "Public tap wastage",
    "Roadside water wastage",
    "Water pollution / contamination",
    "Low water supply"
];

const wasteCategories = [
    "Garbage overflow",
    "Illegal roadside dumping",
    "Plastic waste littering",
    "Blocked drainage",
    "Wet and dry waste mixing",
    "Construction waste dumping",
    "Missed waste collection",
    "Public place littering"
];

// Sample reports are added so the website does not look empty when first opened.
// These are only demonstration records, not real complaints.
const sampleReports = [
    {
        id: "ER-DEMO-1001", type: "Water", city: "KDMC",
        category: "Pipeline leakage", area: "Shivaji Chowk, Kalyan West",
        description: "Water is leaking from a roadside pipeline.",
        gps: "19.24030, 73.13050", hours: 4, urgency: "Urgent",
        status: "Reported", isMine: false, isDemo: true,
        createdAt: new Date().toISOString(), history: ["Reported"]
    },
    {
        id: "ER-DEMO-1002", type: "Waste", city: "KDMC",
        category: "Garbage overflow", area: "Phadke Road, Dombivli East",
        description: "The dustbin is full and garbage is lying on the footpath.",
        gps: "", hours: 0, urgency: "Normal",
        status: "In Progress", isMine: false, isDemo: true,
        createdAt: new Date().toISOString(), history: ["Reported", "In Progress"]
    },
    {
        id: "ER-DEMO-1003", type: "Water", city: "BMC",
        category: "Public tap wastage", area: "Dadar Station West, Mumbai",
        description: "A public tap is not closing properly.",
        gps: "19.01780, 72.84780", hours: 3, urgency: "Normal",
        status: "Resolved", isMine: false, isDemo: true,
        createdAt: new Date().toISOString(), history: ["Reported", "Resolved"]
    },
    {
        id: "ER-DEMO-1004", type: "Waste", city: "TMC",
        category: "Plastic waste littering", area: "Teen Hath Naka, Thane",
        description: "Plastic bottles and wrappers are scattered near the bus stop.",
        gps: "", hours: 0, urgency: "Normal",
        status: "Reported", isMine: false, isDemo: true,
        createdAt: new Date().toISOString(), history: ["Reported"]
    }
];

// Load saved reports from this browser. If there are no saved reports, use sample data.
let reports = [];
const savedReports = localStorage.getItem("ecorakshak_reports");

if (savedReports) {
    reports = JSON.parse(savedReports);
} else {
    reports = sampleReports;
    saveReports();
}

let gpsLocation = "Not captured";
let photoImage = "";

// Save all reports in the browser.
function saveReports() {
    localStorage.setItem("ecorakshak_reports", JSON.stringify(reports));
}

// Show a small message at the bottom of the screen.
function showMessage(message) {
    const toast = getElement("toast");
    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(function () {
        toast.style.display = "none";
    }, 2500);
}

// Make user-entered text safe before showing it on the page.
function safeText(text) {
    return String(text || "").replace(/[&<>"']/g, function (letter) {
        const symbols = {
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#39;"
        };
        return symbols[letter];
    });
}

// Return Water or Waste depending on the selected radio button.
function getSelectedType() {
    return document.querySelector('input[name="issueType"]:checked').value;
}

// Change the categories when the user selects Water or Waste.
function changeIssueType() {
    const selectedType = getSelectedType();
    const categoryList = getElement("category");
    let options = waterCategories;

    if (selectedType === "Waste") {
        options = wasteCategories;
    }

    categoryList.innerHTML = "";

    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("option");
        option.textContent = options[i];
        categoryList.appendChild(option);
    }

    getElement("waterOption").classList.toggle("selected", selectedType === "Water");
    getElement("wasteOption").classList.toggle("selected", selectedType === "Waste");
    getElement("waterExtra").classList.toggle("hidden", selectedType !== "Water");
}

// Show the phone number for the selected municipal area.
function showHelpline() {
    const city = getElement("city").value;
    const office = helplines[city];

    getElement("helplineDisplay").innerHTML =
        "<b>Municipal Office: " + safeText(office.name) + "</b><br>" +
        "Helpline: <a href='tel:" + office.phone + "'>" + office.phone + "</a>";
}

// Open the selected part of the website.
function openTab(tabName) {
    const pages = document.querySelectorAll(".page");
    const buttons = document.querySelectorAll(".nav-link");

    pages.forEach(function (page) {
        page.classList.toggle("hidden", page.id !== "tab-" + tabName);
    });

    buttons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.tab === tabName);
    });

    getElement("desktop-nav").classList.remove("open");

    if (tabName === "home") showHomePage();
    if (tabName === "tracker") showReports();
    if (tabName === "locations") showLocations();
    if (tabName === "admin") showAdminPage();

    window.scrollTo(0, 0);
}

// Navigation buttons.
document.querySelectorAll(".nav-link").forEach(function (button) {
    button.addEventListener("click", function () {
        openTab(button.dataset.tab);
    });
});

// Buttons that take the user to the report or tracker page.
document.querySelectorAll("[data-go]").forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.dataset.kind) {
            document.querySelector('input[name="issueType"][value="' + button.dataset.kind + '"]').checked = true;
            changeIssueType();
        }
        openTab(button.dataset.go);
    });
});

// Mobile navigation menu.
getElement("menuBtn").addEventListener("click", function () {
    getElement("desktop-nav").classList.toggle("open");
});

// Listen for changes in report type and municipal area.
document.querySelectorAll('input[name="issueType"]').forEach(function (radio) {
    radio.addEventListener("change", changeIssueType);
});
getElement("city").addEventListener("change", showHelpline);

// Capture the user's current GPS location, if permission is given.
getElement("gpsButton").addEventListener("click", function () {
    if (!navigator.geolocation) {
        getElement("gpsText").innerText = "GPS is not available in this browser.";
        return;
    }

    getElement("gpsText").innerText = "Getting your location...";

    navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);
        gpsLocation = latitude + ", " + longitude;
        getElement("gpsText").innerText = "GPS captured: " + gpsLocation;
    }, function () {
        getElement("gpsText").innerText = "Location not available. Please enter a landmark.";
    });
});

// Check the selected photo and show its preview.
getElement("photo").addEventListener("change", function () {
    const file = getElement("photo").files[0];
    photoImage = "";
    getElement("photoPreview").classList.add("hidden");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showMessage("Please select an image file.");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showMessage("Photo size should be less than 2 MB.");
        getElement("photo").value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        photoImage = reader.result;
        getElement("photoPreview").src = photoImage;
        getElement("photoPreview").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
});

// Create a simple complaint number.
function createReportId() {
    return "ER-" + new Date().getTime();
}

// Check whether an active complaint already exists at the same place.
function alreadyReported(type, city, location) {
    for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        if (report.type === type && report.city === city &&
            report.area.toLowerCase() === location.toLowerCase() &&
            report.status !== "Resolved") {
            return true;
        }
    }
    return false;
}

// Submit a new complaint.
getElement("reportForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const type = getSelectedType();
    const city = getElement("city").value;
    const category = getElement("category").value;
    const location = getElement("area").value.trim();
    const description = getElement("description").value.trim();
    const hours = type === "Water" ? Number(getElement("hours").value) : 0;
    const urgency = getElement("urgency").value;

    if (location === "" || description === "") {
        showMessage("Please fill in the location and description.");
        return;
    }

    if (alreadyReported(type, city, location)) {
        showMessage("An active report already exists at this location.");
        openTab("tracker");
        return;
    }

    const newReport = {
        id: createReportId(),
        type: type,
        city: city,
        category: category,
        area: location,
        description: description,
        gps: gpsLocation,
        hours: hours,
        urgency: urgency,
        status: "Reported",
        isMine: true,
        isDemo: false,
        photo: photoImage,
        createdAt: new Date().toISOString(),
        history: ["Reported"]
    };

    reports.unshift(newReport);
    saveReports();
    showMessage("Your report has been submitted!");

    getElement("reportForm").reset();
    gpsLocation = "Not captured";
    photoImage = "";
    getElement("gpsText").innerText = "GPS not captured. You can submit with a landmark only.";
    getElement("photoPreview").classList.add("hidden");

    changeIssueType();
    showHelpline();
    openTab("tracker");
});

// Return a CSS class for the complaint status label.
function getStatusClass(status) {
    if (status === "Resolved") return "resolved";
    if (status === "In Progress") return "progress";
    return "";
}

// Create the HTML for one report card.
function createReportCard(report, showAdminButtons) {
    let typeLabel = report.type === "Water" ? "💧 Water" : "♻ Waste";
    let photoHTML = "";

    if (report.photo) {
        photoHTML = '<img class="preview" src="' + report.photo + '" alt="Issue photo">';
    }

    let adminHTML = "";
    if (showAdminButtons) {
        adminHTML = `
            <div class="admin-actions">
                <select id="status-${report.id}">
                    <option ${report.status === "Reported" ? "selected" : ""}>Reported</option>
                    <option ${report.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${report.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
                <button class="btn primary small-btn" onclick="updateStatus('${report.id}')">Update status</button>
            </div>`;
    }

    return `
        <article class="panel report-card">
            <div class="report-top">
                <div>
                    <h3>${safeText(report.category)}</h3>
                    <div class="report-meta">${safeText(report.id)} · ${safeText(report.city)} ${report.isDemo ? "· DEMO SAMPLE" : ""}</div>
                </div>
                <span class="badge ${getStatusClass(report.status)}">${safeText(report.status)}</span>
            </div>
            <span class="badge ${report.type === "Water" ? "type-water" : "type-waste"}">${typeLabel}</span>
            <p class="report-location">📍 ${safeText(report.area)}</p>
            <p class="report-desc">${safeText(report.description)}</p>
            <p class="report-meta">Urgency: ${safeText(report.urgency)}</p>
            ${photoHTML}
            <p class="report-meta">Status history: ${report.history.map(safeText).join(" → ")}</p>
            <div class="report-actions">
                <button class="btn outline small-btn" onclick="copyReport('${report.id}')">Copy details</button>
                <button class="btn outline small-btn" onclick="shareReport('${report.id}')">Share WhatsApp</button>
                ${report.gps !== "Not captured" && report.gps !== "" ? `<a class="btn outline small-btn" target="_blank" href="https://www.google.com/maps?q=${encodeURIComponent(report.gps)}">Open map</a>` : ""}
                ${adminHTML}
            </div>
        </article>`;
}

// Copy complaint details.
function copyReport(reportId) {
    const report = reports.find(function (item) { return item.id === reportId; });
    if (!report) return;

    const details = "EcoRakshak Report\n" +
        "ID: " + report.id + "\n" +
        "Type: " + report.type + "\n" +
        "Category: " + report.category + "\n" +
        "Location: " + report.area + "\n" +
        "Description: " + report.description + "\n" +
        "Status: " + report.status;

    navigator.clipboard.writeText(details).then(function () {
        showMessage("Report details copied.");
    }).catch(function () {
        showMessage("Copy is not available in this browser.");
    });
}

// Share complaint details using WhatsApp.
function shareReport(reportId) {
    const report = reports.find(function (item) { return item.id === reportId; });
    if (!report) return;

    const message = "EcoRakshak Report: " + report.id +
        " | " + report.type + " | " + report.category +
        " | Location: " + report.area +
        " | Status: " + report.status;

    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
}

// Show reports after applying the search and filter options.
function showReports() {
    const searchText = getElement("search").value.toLowerCase();
    const typeFilter = getElement("typeFilter").value;
    const statusFilter = getElement("statusFilter").value;
    const cityFilter = getElement("cityFilter").value;
    const mineOnly = getElement("mineOnly").checked;

    let result = reports.filter(function (report) {
        const matchesSearch = report.id.toLowerCase().includes(searchText) ||
            report.area.toLowerCase().includes(searchText) ||
            report.description.toLowerCase().includes(searchText);
        const matchesType = typeFilter === "all" || report.type === typeFilter;
        const matchesStatus = statusFilter === "all" || report.status === statusFilter;
        const matchesCity = cityFilter === "all" || report.city === cityFilter;
        const matchesMine = !mineOnly || report.isMine;

        return matchesSearch && matchesType && matchesStatus && matchesCity && matchesMine;
    });

    let reportHTML = "";
    result.forEach(function (report) {
        reportHTML += createReportCard(report, false);
    });

    if (result.length === 0) {
        reportHTML = '<div class="empty-state">No reports found.</div>';
    }

    getElement("reportsContainer").innerHTML = reportHTML;
}

// Update the numbers and recent reports on the home page.
function showHomePage() {
    const waterReports = reports.filter(report => report.type === "Water");
    const wasteReports = reports.filter(report => report.type === "Waste");
    const openReports = reports.filter(report => report.status !== "Resolved");
    const closedReports = reports.filter(report => report.status === "Resolved");

    getElement("homeWater").innerText = waterReports.length;
    getElement("homeWaste").innerText = wasteReports.length;
    getElement("homeOpen").innerText = openReports.length;
    getElement("homeResolved").innerText = closedReports.length;

    const recentReports = reports.slice(0, 3);
    let recentHTML = "";

    recentReports.forEach(function (report) {
        recentHTML += `
            <div class="recent-item">
                <div><b>${report.type === "Water" ? "💧" : "♻️"} ${safeText(report.category)}</b>
                <p>${safeText(report.area)} · ${safeText(report.city)}</p></div>
                <span class="badge ${getStatusClass(report.status)}">${safeText(report.status)}</span>
            </div>`;
    });

    getElement("homeRecent").innerHTML = recentHTML || '<div class="empty-state">No reports have been submitted.</div>';
}

// Show all reported locations.
function showLocations() {
    const activeReports = reports.filter(report => report.status !== "Resolved");
    getElement("locationSummary").innerHTML =
        "<span>📍 " + reports.length + " total reported locations</span>" +
        "<span>⏳ " + activeReports.length + " active issues</span>";

    let locationHTML = "";
    reports.forEach(function (report) {
        let mapLink = "No GPS location added";
        if (report.gps && report.gps !== "Not captured") {
            mapLink = '<a target="_blank" href="https://www.google.com/maps?q=' + encodeURIComponent(report.gps) + '">Open in Google Maps</a>';
        }

        locationHTML += `
            <article class="panel location-card">
                <div><b>${report.type === "Water" ? "💧" : "♻️"} ${safeText(report.area)}</b>
                <p>${safeText(report.city)} · ${safeText(report.category)} · ${safeText(report.status)}</p></div>
                <div>${mapLink}</div>
            </article>`;
    });

    getElement("mapContainer").innerHTML = locationHTML || '<div class="empty-state">No locations reported yet.</div>';
}

// Show the admin dashboard and all reports with status update options.
function showAdminPage() {
    const waterReports = reports.filter(report => report.type === "Water");
    const wasteReports = reports.filter(report => report.type === "Waste");
    const openReports = reports.filter(report => report.status !== "Resolved");
    const closedReports = reports.filter(report => report.status === "Resolved");

    getElement("adminWater").innerText = waterReports.length;
    getElement("adminWaste").innerText = wasteReports.length;
    getElement("adminOpen").innerText = openReports.length;
    getElement("adminResolved").innerText = closedReports.length;

    // This is only an example estimate. It is not a measured amount of saved water.
    let savedLitres = 0;
    closedReports.forEach(function (report) {
        if (report.type === "Water") {
            savedLitres += report.hours * 500;
        }
    });

    getElement("savedLitres").innerText = savedLitres + " L";
    getElement("wasteCount").innerText = wasteReports.length;

    let adminHTML = "";
    reports.forEach(function (report) {
        adminHTML += createReportCard(report, true);
    });
    getElement("adminContainer").innerHTML = adminHTML || '<div class="empty-state">No reports to manage.</div>';
}

// Change the status of a report from the admin page.
function updateStatus(reportId) {
    const report = reports.find(function (item) { return item.id === reportId; });
    const statusMenu = getElement("status-" + reportId);

    if (!report || !statusMenu) return;

    report.status = statusMenu.value;
    report.history.push(statusMenu.value);
    report.isDemo = false;

    saveReports();
    showAdminPage();
    showMessage("Report status updated.");
}

// Export the reports as a CSV file that can be opened in Excel.
function exportReports() {
    let csv = "ID,Type,City,Category,Location,Description,Status\n";

    reports.forEach(function (report) {
        csv += '"' + report.id + '","' + report.type + '","' + report.city +
            '","' + report.category + '","' + report.area + '","' +
            report.description.replace(/"/g, '""') + '","' + report.status + '"\n';
    });

    const file = new Blob([csv], { type: "text/csv" });
    const fileURL = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileURL;
    downloadLink.download = "EcoRakshak_Reports.csv";
    downloadLink.click();
    URL.revokeObjectURL(fileURL);
}

getElement("exportButton").addEventListener("click", exportReports);

// Restore the sample reports. This removes reports entered in this browser.
getElement("resetButton").addEventListener("click", function () {
    const answer = confirm("Reset the website to sample reports? Your submitted reports will be removed.");
    if (answer) {
        reports = sampleReports;
        saveReports();
        showAdminPage();
        showMessage("Sample reports restored.");
    }
});

// Search and filter controls update the tracker list.
getElement("search").addEventListener("input", showReports);
getElement("typeFilter").addEventListener("change", showReports);
getElement("statusFilter").addEventListener("change", showReports);
getElement("cityFilter").addEventListener("change", showReports);
getElement("mineOnly").addEventListener("change", showReports);

// Run these functions when the website first opens.
changeIssueType();
showHelpline();
showHomePage();
