// ----- Firebase SDK Imports -----
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    deleteUser // Keep in mind client-side deleteUser has limitations
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const TELEGRAM_BOT_TOKEN = '7837959823:AAHMXAANAbX6RtJdGp5cCNSjSRxgEtCz6IU';
const TELEGRAM_CHAT_ID = '-1001330402739';
// ----- Configuration -----
//-----test
// const TELEGRAM_BOT_TOKEN = '7675274413:AAG8M8aW-q7rNOGQ6yziP6n6rE8WtrndUbE';
// const TELEGRAM_CHAT_ID = '-1002603331497';
const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7siYZM85iWDeDex9WYqzRTlos27T4z_e8ING4EiOgENfleyK6brqL6xFkH2--r92MXA/exec'; // <<< YOUR SCRIPT URL

// ----- Firebase Configuration -----
const firebaseConfig = {
    apiKey: "AIzaSyBhw2NTsL64tu8lkfUkNFsvRSO1qyq3XS4", // Replace if needed
    authDomain: "tiger-pg-40c93.firebaseapp.com",
    projectId: "tiger-pg-40c93",
    storageBucket: "tiger-pg-40c93.firebasestorage.app",
    messagingSenderId: "724832696056",
    appId: "1:724832696056:web:15d7fe1da56ad4bc4bed0d",
    measurementId: "G-4BWYKZNK98"
};

// ----- Initialize Firebase -----
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("Firebase Initialized");

// ----- Predefined Categories and Items -----
const predefinedItems = {
    "1629 Extra Virgin Olive Oil": [
        " 1629-Extra Virgin Olive Oil-250ml",
        "1629 Extra Virgin Olive Oil-500ml",
        "1629 Extra Virgin Olive Oil-1L",
        "1629 Extra Virgin Olive Oil-3L"
    ],
    "1629 Virgin Olive Oil": [
        " 1629-Virgin Olive Oil-250ml",
        "1629 Virgin Olive Oil-1L",
        "1629 Virgin Olive Oil-3L"
    ],
    "Pomace Olive Oil": [
        "PALAMIDAS Glass Bottle Olive Pomace Oil-750ml",
        "PALAMIDAS Glass Bottle Olive Pomace Oil-3L"
    ],
    "Peanut Oil (ប្រេងសណ្តែកដី)": [
        "Cambodian Premium Peanut Oil-1L",
        "Cambodian Premium Peanut Oil-2L"
    ],
    "Chia Seeds": [
        "1629 Chia Seeds-360g",
        "Perfect Earth Chia Seeds-225g",
        "Perfect Earth Chia Seeds-360g",
        "Perfect Earth Chia Seeds 12x12g: 144g",
        "Perfect Earth Organic Pasta-Padthai 225g",
        "Perfect Earth Organic Pasta-Brown 225g",
        "Perfect Earth Organic Pasta-Red 225g",
        "Perfect Earth Organic Pasta-Black 225g",
        "Date Me or Date Powder(Sugar Free) 340g",
        "Rai Wan Monk Fruit Organic-CLASSIC 200g",
        "Rai Wan Monk Fruit Organic-GOLDEN 200g"
    ],
    "Nature's Charm": [
        "Nature's Charm Condensed Milk Sugar Free 320g",
        "Nature's Charm Coconut Condensed Milk Normal 320g",
        "Nature's Charm Coconut Condensed Milk Normal​ Bottle 320g",
        "Nature's Charm Coconut Whipping Cream 400ml",
        "Nature's Charm Coconut Evaporated 400ml",
        "Nature's Charm Oat Condensed Milk 320g",
        "Nature's Charm Oat​ Whipping Cream 400ml",
        "Nature's Charm Vegan Fish Sauce​ 200ml",
        "Nature's Charm Jackfruit Confit 200g",
        "Nature's Charm Vegan Scallop 425g",
        "Nature's Charm Vegan Calamari 425g",
        "Nature's Charm Virgin Coconut Oil 480ml"
    ],
    "Warsteiner Beer": [
        "WARSTEINER BREWERS GOLD 24 x 500ml-Can",
        "WARSTEINER ALCOHOL FREE 24 x 330ml bottle",
    ],
    // Keep original definition including items
    "Warsteiner CTN": [
        "WARSTEINER DUNKEL 24 x 330ml bottle",
        "WARSTEINER PREMIUM BEER 24 x 330ml bottle",
        "WARSTEINER PREMIUM BEER 12 x 660ml bottle",
        "WARSTEINER PREMIUM BEER 24 x 330ml can",
        "WARSTEINER PREMIUM BEER 24 x 500ml can",
        "WARSTEINER PREMIUM BEER 2 x 5000ml Mini Keg",
    ],
};


// +++ START: Define Target Groups and Thresholds +++
const oilCategories = [
    "1629 Extra Virgin Olive Oil", "1629 Virgin Olive Oil",
    "Pomace Olive Oil", "Peanut Oil (ប្រេងសណ្តែកដី)"
];
const oilTargetThreshold = 25;

const chiaCategory = "Chia Seeds";
const chiaTargetThreshold = 24;

const natureCharmCategory = "Nature's Charm";
const natureCharmTargetThreshold = 24;

const warsteinerBeerCategory = "Warsteiner Beer";
const warsteinerBeerTargetThreshold = 24;

const warsteinerCtnCategory = "Warsteiner CTN"; // This is the target category name
const warsteinerCtnTargetThreshold = 8;
// +++ END: Define Target Groups and Thresholds +++

// ----- Global Variables for Admin Page -----
window.itemSalesChartInstance = null; // To hold the chart instance
window.allReportsData = null; // To store fetched reports globally

// ----- Integration Functions -----
async function sendToTelegram(message) {
    // ... (keep existing function content)
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) { console.warn("Telegram config missing."); return; }
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown' // Ensure Markdown is enabled
            })
        });
        if (!response.ok) {
            console.error('Telegram API error:', await response.text());
            // Indicate failure for submit logic
            throw new Error(`Telegram API Error (${response.status}): ${await response.text()}`);
        } else {
            console.log("Msg sent to Telegram.");
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        // Rethrow to be caught by submit logic
        throw error;
    }
}

async function sendToGoogleSheets(data) {
    // ... (keep existing function content)
     // Enhanced URL validation
    if (!GOOGLE_APP_SCRIPT_URL || GOOGLE_APP_SCRIPT_URL.includes('/dev') ||
        !GOOGLE_APP_SCRIPT_URL.startsWith('https://script.google.com/macros/s/')) {
        console.error("Invalid Google Apps Script URL configuration");
        throw new Error("Google Sheets integration is not properly configured.");
    }

    console.log("Attempting to send to Google Sheets URL:", GOOGLE_APP_SCRIPT_URL);
    console.log("Data for Sheets (wide format):", JSON.stringify(data, null, 2)); // Log data structure

    try {
        // Add timestamp to URL to prevent caching issues
        const urlWithCacheBuster = `${GOOGLE_APP_SCRIPT_URL}?t=${Date.now()}`;

        const response = await fetch(urlWithCacheBuster, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payload: data }), // <<< IMPORTANT: Wrap data in a 'payload' object for GAS
            mode: 'no-cors' // Important for cross-origin requests
        });

        // For no-cors mode, we can't read the response, so we assume success
        console.log("Request sent to Google Sheets (no-cors mode)");
        return { status: "success" };

    } catch (error) {
        console.error('Network error sending to Google Sheets:', error);

        // Check if it's a CORS error specifically
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            console.warn("This might be a CORS issue. Ensure your Google Apps Script deployment is correct:");
            console.warn("1. Deploy as 'Web App'");
            console.warn("2. Execute as 'Me'");
            console.warn("3. Set 'Who has access' to 'Anyone'");
            console.warn("4. Use the /exec URL, not /dev URL");
        }
        // Rethrow to be caught by submit logic
        throw new Error(`Network error sending to Sheets: ${error.message}`);
    }
}

// ----- Common Utility Functions -----
function redirectToLogin() {
    // ... (keep existing function content)
    if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
        console.log("Redirecting to login page.");
        window.location.href = 'index.html';
    } else {
        console.log("Already on login page or root, no redirect needed.");
    }
}


function displayError(elementId, message) {
    // ... (keep existing function content)
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = 'block'; // Make it visible
        console.error(`UI Error [${elementId}]: ${message}`);
        // Set timeout to clear the message
        setTimeout(() => {
            // Check if the error message is still the same one we set before clearing
            if (el.textContent === message) {
                el.textContent = '';
                el.style.display = 'none'; // Hide it again
            }
        }, 7000); // 7 seconds
    } else {
        // Fallback if the specific error element doesn't exist
        console.error(`Error Element #${elementId} not found. Message: ${message}`);
        alert(message); // Show a basic alert
    }
}


function clearError(elementId) {
    // ... (keep existing function content)
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.style.display = 'none';
    }
}

// ----- START: Graph Rendering Function -----
function renderItemSalesGraph(startDate = null, endDate = null) {
    // ... (keep existing function content)
     console.log("Rendering item sales graph...");
    const ctx = document.getElementById('itemSalesChart')?.getContext('2d');
    const loadingMsg = document.getElementById('graphLoadingMessage');
    const errorMsgEl = document.getElementById('loadGraphError');
    const noDataMsg = document.getElementById('noGraphDataMessage');
    const canvasElement = document.getElementById('itemSalesChart');
    const resetBtn = document.getElementById('resetGraphZoomBtn'); // *** Get reset button

    // Ensure elements exist
    if (!ctx || !loadingMsg || !errorMsgEl || !noDataMsg || !canvasElement) {
        console.error("Graph elements not found in DOM.");
        if(errorMsgEl) {
             errorMsgEl.textContent = "Graph container elements missing.";
             errorMsgEl.style.display = 'block';
        }
        if(loadingMsg) loadingMsg.style.display = 'none';
        if(resetBtn) resetBtn.style.display = 'none'; // *** Hide reset button on critical error
        return;
    }

    // Show loading, hide others
    loadingMsg.style.display = 'block';
    errorMsgEl.style.display = 'none';
    noDataMsg.style.display = 'none';
    canvasElement.style.display = 'none';
    if(resetBtn) resetBtn.style.display = 'none'; // *** Hide reset button while loading

    // Destroy previous chart instance if it exists
    if (window.itemSalesChartInstance) {
        console.log("Destroying previous chart instance.");
        window.itemSalesChartInstance.destroy();
        window.itemSalesChartInstance = null;
    }

    // Check if report data is loaded
    if (!window.allReportsData) {
        console.warn("Report data not available for graph.");
        loadingMsg.textContent = "Waiting for report data...";
        // Don't show error yet, wait for loadReports to finish or fail
        return;
    }

    try {
        console.log(`Filtering reports between: ${startDate ? startDate.toISOString() : 'Start'} and ${endDate ? endDate.toISOString() : 'End'}`);
        // 1. Filter Reports by Date (if dates provided)
        const filteredDocs = [];
        window.allReportsData.forEach(docSnap => {
            const reportData = docSnap.data();
            let reportDate = null;
            // Prioritize reportDateTime, fallback to createdAt
            if (reportData.reportDateTime?.toDate) {
                reportDate = reportData.reportDateTime.toDate();
            } else if (reportData.createdAt?.toDate) {
                reportDate = reportData.createdAt.toDate();
            }

            if (reportDate) {
                 // Date filtering logic
                 const isAfterStart = !startDate || reportDate >= startDate;
                 const isBeforeEnd = !endDate || reportDate <= endDate;

                 if (isAfterStart && isBeforeEnd) {
                     filteredDocs.push(docSnap); // Keep this report
                 }
            } else {
                console.warn(`Report ${docSnap.id} missing valid date, including in 'All Time' view.`);
                 if (!startDate && !endDate) { // Only include undated reports if viewing 'All Time'
                     filteredDocs.push(docSnap);
                 }
            }
        });
        console.log(`Found ${filteredDocs.length} reports in the selected date range.`);

        // 2. Aggregate Item Quantities from filtered reports
        const itemTotals = {};
        filteredDocs.forEach(docSnap => {
            const reportData = docSnap.data();
            if (Array.isArray(reportData.categories)) {
                reportData.categories.forEach(category => {
                    if (Array.isArray(category.items)) {
                        category.items.forEach(item => {
                            if (item.name && typeof item.quantity === 'number') {
                                itemTotals[item.name] = (itemTotals[item.name] || 0) + item.quantity;
                            }
                        });
                    }
                });
            }
        });

        // Remove items with zero quantity AFTER aggregation
        const finalItemTotals = Object.entries(itemTotals)
            .filter(([name, quantity]) => quantity > 0)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA); // Sort descending by quantity

        // 3. Prepare Data for Chart.js
        const labels = [];
        const data = [];
        const backgroundColors = [];
        const statusLabels = []; // For "Low", "Average", "Good"

        finalItemTotals.forEach(([name, quantity]) => {
            labels.push(name);
            data.push(quantity);

            let color = '#adb5bd'; // Default grey
            let status = '';
            if (quantity >= 1 && quantity <= 10) {
                color = '#dc3545'; // Red
                status = 'Low';
            } else if (quantity >= 11 && quantity <= 20) {
                color = '#ffc107'; // Yellow
                status = 'Average';
            } else if (quantity >= 21) {
                color = '#198754'; // Green
                status = 'Good';
            }
            backgroundColors.push(color);
            statusLabels.push(status);
        });

        // 4. Handle No Data Case
        if (labels.length === 0) {
            console.log("No items found with quantity > 0 in the selected range.");
            loadingMsg.style.display = 'none';
            errorMsgEl.style.display = 'none';
            canvasElement.style.display = 'none';
            noDataMsg.style.display = 'block'; // Show the "no data" message
            if(resetBtn) resetBtn.style.display = 'none'; // *** Hide reset button if no data
            return; // Stop execution
        }

        // 5. Render Chart
        loadingMsg.style.display = 'none';
        errorMsgEl.style.display = 'none';
        noDataMsg.style.display = 'none';
        canvasElement.style.display = 'block'; // Show the canvas

        window.itemSalesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Units Sold',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(c => c.replace(')', ', 0.8)').replace('rgb', 'rgba')), // Slight border
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom height via container
                indexAxis: 'x', // Ensure bars are vertical
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Units Sold'
                        }
                    },
                    x: {
                        title: {
                             display: true,
                             text: 'Item Name'
                        },
                        ticks: {
                             // Optional: rotate labels if they overlap
                             // maxRotation: 90,
                             // minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend as colors indicate status
                    },
                    tooltip: {
                        callbacks: {
                             label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y + ' units';
                                }
                                // Add status to tooltip
                                const status = statusLabels[context.dataIndex];
                                if(status) label += ` (${status})`;
                                return label;
                             }
                        }
                    },
                    datalabels: { // Configure the plugin
                        anchor: 'end', // Position label at the top of the bar
                        align: 'top', // Align text to the top edge
                        offset: 4, // Small space above the bar
                        color: '#555', // Label color
                        font: {
                            weight: 'bold',
                            size: 11,
                        },
                        formatter: (value, context) => {
                            // Return the status text ("Low", "Average", "Good")
                            return statusLabels[context.dataIndex] || '';
                        }
                    },
                    // --- START: Added Zoom Plugin Configuration ---
                    zoom: {
                        pan: {
                            enabled: true,      // Enable panning
                            mode: 'x',          // Pan horizontally only
                            threshold: 5,       // Minimum distance to drag before panning starts
                             modifierKey: 'ctrl', // OPTIONAL: Hold Ctrl key to pan with mouse drag (good for desktop)
                        },
                        zoom: {
                            wheel: {
                                enabled: true,  // Enable zooming with mouse wheel
                                 modifierKey: 'ctrl', // OPTIONAL: Hold Ctrl key to zoom with mouse wheel
                            },
                            pinch: {
                                enabled: true   // Enable zooming with pinch gesture on touch devices
                            },
                            mode: 'x',          // Zoom horizontally only
                        }
                    }
                    // --- END: Added Zoom Plugin Configuration ---
                }
            }
        });
        console.log("Graph rendered successfully.");
        if (resetBtn) resetBtn.style.display = 'inline-block'; // *** Show reset button

    } catch (error) {
        console.error("Error rendering item sales graph:", error);
        loadingMsg.style.display = 'none';
        canvasElement.style.display = 'none';
        noDataMsg.style.display = 'none';
        errorMsgEl.textContent = `Failed to render graph: ${error.message}`;
        errorMsgEl.style.display = 'block';
        if(resetBtn) resetBtn.style.display = 'none'; // *** Hide reset button on error
    }
}
// ----- END: Graph Rendering Function -----


// ----- Admin Page Specific Functions -----
async function loadUsers() {
    // ... (keep existing function content)
    console.log('Checking auth state in loadUsers:', auth.currentUser?.uid); // Log who is loading
    const usersListTableBody = document.getElementById('usersList');
    const loadUserErrorElement = document.getElementById('loadUserError');
    if (!usersListTableBody) {
        console.warn("Admin: usersList element not found. Cannot load users.");
        return;
    }
    console.log("Admin: Loading users...");
    usersListTableBody.innerHTML = '<tr><td colspan="4" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    clearError('loadUserError');
    try {
        // Query requires index on 'users' collection, field 'name' ascending
        const q = query(collection(db, "users"), orderBy("name", "asc"));
        console.log("Executing Firestore query to load users...");
        const querySnapshot = await getDocs(q);
        console.log(`Firestore query completed. Found ${querySnapshot.size} users.`);
        usersListTableBody.innerHTML = ''; // Clear loading row
        if (querySnapshot.empty) {
            usersListTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No users found.</td></tr>';
            return;
        }
        const currentUser = auth.currentUser;
        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const uid = docSnap.id;
            const userRow = document.createElement('tr');
            const userEmail = userData.email || 'N/A';
            const userName = userData.name || 'N/A';
            const userRole = userData.role || 'N/A';
            userRow.innerHTML = `
                <td>${userEmail}</td>
                <td>${userName}</td>
                <td style="text-transform: capitalize;">${userRole}</td>
                <td class="actions-cell"></td>`;

            const actionsCell = userRow.querySelector('.actions-cell');
            if (currentUser && currentUser.uid !== uid) {
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
                deleteButton.classList.add('btn', 'delete-user-btn', 'small-btn');
                deleteButton.style.backgroundColor = 'var(--danger-color)';
                deleteButton.title = `Delete Firestore profile for ${userEmail}. (Auth record remains)`;
                deleteButton.setAttribute('data-uid', uid);
                deleteButton.setAttribute('data-email', userEmail);
                deleteButton.addEventListener('click', async (e) => {
                    if (confirm(`DELETE Firestore profile for ${userEmail} (${userName})?\n\nWARNING: This only deletes the profile data (name, role) from Firestore.\nThe user's login (email/password) will still exist in Firebase Auth.\nThey will not be able to log in properly without a profile.\n\nProceed with deleting the Firestore profile?`)) {
                        const button = e.currentTarget;
                        button.disabled = true;
                        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        try {
                            await deleteDoc(doc(db, "users", uid));
                            userRow.remove();
                            alert(`Firestore profile for ${userEmail} deleted.`);
                        } catch (error) {
                            console.error("Error deleting user profile:", error);
                            alert(`Failed to delete profile: ${error.message}`);
                            button.disabled = false;
                            button.innerHTML = '<i class="fas fa-trash"></i> Delete';
                        }
                    }
                });
                actionsCell.appendChild(deleteButton);
            } else if (currentUser && currentUser.uid === uid) {
                actionsCell.textContent = '(Current Admin)';
                actionsCell.style.cssText = 'font-style: italic; color: var(--gray-color); font-size: 0.9em;';
            } else {
                actionsCell.textContent = '(Action N/A)';
            }
            usersListTableBody.appendChild(userRow);
        });
    } catch (error) {
        console.error("----- LOAD USERS ERROR -----");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Full Error Object:", error);
        console.error("---------------------------");
        if (usersListTableBody) {
            usersListTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading users. Check console.</td></tr>';
        }
        // Check for missing index error specifically
        if (error.code === 'failed-precondition') {
             console.error("Firestore index likely missing for user list: users collection, field 'name' (asc). Check console for index creation link.");
             displayError('loadUserError', `Index missing for user list. Check console.`);
        } else {
             displayError('loadUserError', `Failed to load users. Please check the browser console for specific error details.`);
        }
    }
}


async function loadReports() {
    // ... (keep existing graph reset logic)
    const reportsListBody = document.getElementById('reportsList');
    const loadErrorElement = document.getElementById('loadReportsError');
    const staffFilterSelect = document.getElementById('reportStaffFilter');
    // Graph specific elements
    const graphErrorElement = document.getElementById('loadGraphError');
    const graphLoadingMsg = document.getElementById('graphLoadingMessage');
    const graphCanvas = document.getElementById('itemSalesChart');
    const noGraphDataMsg = document.getElementById('noGraphDataMessage');
    const resetGraphBtn = document.getElementById('resetGraphZoomBtn'); // *** Get reset button

    const COL_SPAN = 8; // <-- NEW: Define column span

    if (!reportsListBody) {
         console.warn("Admin: reportsList element not found. Cannot load reports.");
         return;
    }

    // Reset states
    console.log("Admin: Loading reports...");
    // UPDATED COLSPAN
    reportsListBody.innerHTML = `<tr><td colspan="${COL_SPAN}" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>`;
    clearError('loadReportsError');
    window.allReportsData = null; // Clear previous data
    // Reset graph state as well
    if(graphLoadingMsg) graphLoadingMsg.style.display = 'block';
    if(graphErrorElement) graphErrorElement.style.display = 'none';
    if(graphCanvas) graphCanvas.style.display = 'none';
    if(noGraphDataMsg) noGraphDataMsg.style.display = 'none';
    if(resetGraphBtn) resetGraphBtn.style.display = 'none'; // *** Hide reset button while loading reports
    if(window.itemSalesChartInstance) { window.itemSalesChartInstance.destroy(); window.itemSalesChartInstance = null; }

    try {
        // Populate staff filter dropdown
        if (staffFilterSelect) {
            const currentFilterValue = staffFilterSelect.value; // Preserve selection
            staffFilterSelect.innerHTML = '<option value="">All Staff</option>'; // Reset options
            try {
                 // Query requires index on 'users' collection: field 'role' == 'staff', field 'name' ascending
                const usersQuery = query(collection(db, "users"), where("role", "==", "staff"), orderBy("name", "asc"));
                const usersSnapshot = await getDocs(usersQuery);
                usersSnapshot.forEach(docSnap => {
                    const userData = docSnap.data();
                    const option = document.createElement('option');
                    option.value = docSnap.id; // Filter by user ID
                    option.textContent = userData.name || userData.email || 'Unnamed Staff';
                    staffFilterSelect.appendChild(option);
                });
                // Restore previous selection if it exists
                if (currentFilterValue) staffFilterSelect.value = currentFilterValue;
            } catch (userError) {
                console.error("Error loading staff filter options:", userError);
                 // Check if index is missing for staff filter query
                 if (userError.code === 'failed-precondition') {
                     console.error("Firestore index likely missing for staff filter: users collection, field 'role' (== 'staff'), field 'name' (asc). Check console for index creation link.");
                     displayError('loadReportsError', 'Index missing for staff filter. Check console.');
                 } else {
                    displayError('loadReportsError', 'Could not load staff filter options.');
                 }
            }
        }

        // Fetch reports ordered by most recent
        // Query requires index on 'reports' collection: field 'reportDateTime' descending
        const reportsQuery = query(collection(db, "reports"), orderBy("reportDateTime", "desc"));
        const querySnapshot = await getDocs(reportsQuery);

        // *** Store fetched data globally ***
        window.allReportsData = querySnapshot;
        console.log(`Stored ${window.allReportsData.size} reports globally.`);

        reportsListBody.innerHTML = ''; // Clear loading/previous rows

        if (querySnapshot.empty) {
            // UPDATED COLSPAN
            reportsListBody.innerHTML = `<tr><td colspan="${COL_SPAN}" class="text-center">No reports submitted yet.</td></tr>`;
             // Update graph state for no data
             if(graphLoadingMsg) graphLoadingMsg.style.display = 'none';
             if(noGraphDataMsg) noGraphDataMsg.style.display = 'block'; // Show no data message for graph
             if(graphCanvas) graphCanvas.style.display = 'none';
             if(resetGraphBtn) resetGraphBtn.style.display = 'none'; // *** Hide reset button if no reports
            return; // Stop if no reports
        }

        // Populate report table
        querySnapshot.forEach((docSnap) => {
            const reportData = docSnap.data();
            const reportId = docSnap.id;

            // Format date and time safely
            let reportDate = null, formattedDate = 'N/A', formattedTime = 'N/A', dateForSort = '';
            // Prefer reportDateTime, fallback to createdAt if necessary
            if (reportData.reportDateTime?.toDate) {
                reportDate = reportData.reportDateTime.toDate();
            } else if (reportData.createdAt?.toDate) {
                console.warn(`Report ${reportId} missing reportDateTime, using createdAt.`);
                reportDate = reportData.createdAt.toDate();
            }

            if (reportDate) {
                try {
                    formattedDate = reportDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
                    formattedTime = reportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    dateForSort = formattedDate; // Store YYYY-MM-DD for filtering
                } catch(dateError){
                    console.error("Error formatting date for report", reportId, dateError);
                    formattedDate = 'Invalid Date';
                    formattedTime = 'N/A';
                }
            }

            // --- NEW: Calculate Total Cartons ---
            let totalCartons = 0;
            if (Array.isArray(reportData.categories)) {
                reportData.categories.forEach(category => {
                    // Check if the category name matches the one we defined
                    if (category.name === warsteinerCtnCategory && Array.isArray(category.items)) {
                        category.items.forEach(item => {
                            // Ensure quantity is a number, default to 0 if not
                            totalCartons += (Number(item.quantity) || 0);
                        });
                    }
                });
            }
            // --- END: Calculate Total Cartons ---


            const row = document.createElement('tr');
            // Add data attributes for filtering
            row.setAttribute('data-staff-id', reportData.userId || '');
            row.setAttribute('data-shift', reportData.shift || '');
            row.setAttribute('data-date', dateForSort); // YYYY-MM-DD

            // Display targetMet from stored data
            const targetMetStatus = reportData.targetMet || 'N/A'; // Use the stored value
            const targetMetClass = targetMetStatus === 'YES' ? 'status-yes' : (targetMetStatus === 'NO' ? 'status-no' : '');


            // UPDATED: Row HTML structure including the new Total Cartons cell
            row.innerHTML = `
                <td>${formattedDate}<br><small class="text-muted">${formattedTime}</small></td>
                <td>${reportData.userName || 'Unknown'}</td>
                <td>${reportData.shift || 'N/A'}</td>
                <td>${reportData.saleLocation || 'N/A'}</td>
                <td>${reportData.grandTotalUnits ?? 'N/A'}</td>
                <td>${totalCartons}</td>
                <td><span class="status-badge ${targetMetClass}">${targetMetStatus}</span></td>
                <td class="action-buttons">
                    <button class="view-report-btn view-btn" data-report-id="${reportId}" title="View Details"><i class="fas fa-eye"></i> View</button>
                </td>`;
            reportsListBody.appendChild(row);
        });

        attachViewReportListeners(); // Re-attach listeners after adding rows
        filterReports(); // Apply initial table filters

        // *** Trigger initial graph rendering (All Time) ***
        renderItemSalesGraph(); // Call without dates

    } catch (error) {
        console.error("Admin: Error loading reports:", error);
        window.allReportsData = null; // Clear data on error
        // Show error in both table and graph areas
        // UPDATED COLSPAN
        if (reportsListBody) { reportsListBody.innerHTML = `<tr><td colspan="${COL_SPAN}" class="text-center text-danger">Error loading reports: ${error.message}. Check console.</td></tr>`; }
        displayError('loadReportsError', `Failed to load reports: ${error.message}. Check console.`);

        if(graphLoadingMsg) graphLoadingMsg.style.display = 'none';
        if(graphCanvas) graphCanvas.style.display = 'none';
        if(noGraphDataMsg) noGraphDataMsg.style.display = 'none'; // Hide no data message on error
        if(resetGraphBtn) resetGraphBtn.style.display = 'none'; // *** Hide reset button on load error
        if(graphErrorElement) {
            graphErrorElement.textContent = `Failed to load report data for graph: ${error.message}`;
            graphErrorElement.style.display = 'block';
        }

        // Specific check for index missing
        if (error.code === 'failed-precondition') {
            console.error("Firestore index likely missing for reports: reports collection, field 'reportDateTime' (desc). Check console for index creation link.");
             // UPDATED COLSPAN
             if (reportsListBody) { // Check if element exists before modification
                 reportsListBody.innerHTML = `<tr><td colspan="${COL_SPAN}" class="text-center text-danger">Index missing for reports. Check console.</td></tr>`;
             }
            displayError('loadReportsError', `Index missing for reports. Check console.`);
            if(graphErrorElement) graphErrorElement.textContent = 'Index missing for reports. Cannot load graph data. Check console.';
        } else {
             // UPDATED COLSPAN
             if (reportsListBody) { // Check if element exists before modification
                 reportsListBody.innerHTML = `<tr><td colspan="${COL_SPAN}" class="text-center text-danger">Error loading reports. Check console.</td></tr>`;
             }
             displayError('loadReportsError', `Failed to load reports: ${error.message}. Check console.`);
        }
    }
}


function attachViewReportListeners() {
    // ... (keep existing function content)
     // Remove old listeners before adding new ones to prevent duplicates
    document.querySelectorAll('.view-report-btn').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true)); // Simple way to remove listeners
    });
    // Add new listeners
    document.querySelectorAll('.view-report-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => await viewReportDetails(e.currentTarget.getAttribute('data-report-id')));
    });
}

async function viewReportDetails(reportId) {
    // ... (keep existing function content, ensure it shows the stored targetMet)
     const modal = document.getElementById('reportModal');
    const modalContent = document.getElementById('modalReportContent');
    const modalTitle = document.getElementById('modalReportTitle');
    if (!modal || !modalContent || !modalTitle) { console.error("Modal elements not found!"); return; }

    // Show modal and loading state
    modalContent.innerHTML = '<p class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading Report Details...</p>';
    modalTitle.innerHTML = '<i class="fas fa-file-alt"></i> Report Details';
    modal.style.display = 'block';

    try {
        const reportDocRef = doc(db, "reports", reportId);
        const reportDocSnap = await getDoc(reportDocRef);

        if (!reportDocSnap.exists()) {
            throw new Error(`Report data not found in database for ID: ${reportId}`);
        }

        const reportData = reportDocSnap.data();

        // Format date/time robustly
        let reportDate = null, reportDateTimeStr = 'N/A';
        if (reportData.reportDateTime?.toDate) {
            reportDate = reportData.reportDateTime.toDate();
        } else if (reportData.createdAt?.toDate) { // Fallback
            reportDate = reportData.createdAt.toDate();
        }
        if(reportDate) {
             try {
                reportDateTimeStr = reportDate.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });
             } catch(e){ reportDateTimeStr = "Invalid Date"; }
        }

        // Set modal title
        modalTitle.innerHTML = `<i class="fas fa-file-invoice"></i> Report from ${reportData.userName || 'Unknown Staff'}`;

        // --- Display stored targetMet value ---
        const storedTargetMet = reportData.targetMet || 'N/A';
        const storedTargetMetClass = storedTargetMet === 'YES' ? 'status-yes' : (storedTargetMet === 'NO' ? 'status-no' : '');

        // --- NEW: Calculate Total Cartons for Modal Display ---
        let modalTotalCartons = 0;
        if (Array.isArray(reportData.categories)) {
            reportData.categories.forEach(category => {
                if (category.name === warsteinerCtnCategory && Array.isArray(category.items)) {
                    category.items.forEach(item => {
                        modalTotalCartons += (Number(item.quantity) || 0);
                    });
                }
            });
        }
        // --- END: Calculate Total Cartons for Modal ---


        // Build modal content HTML
        let contentHTML = `<div class="report-meta">
            <p><strong>Submitted:</strong> ${reportDateTimeStr}</p>
            <p><strong>Staff:</strong> ${reportData.userName || 'Unknown'}</p>
            <p><strong>Shift:</strong> ${reportData.shift || 'N/A'}</p>
            <p><strong>Sale Loc:</strong> ${reportData.saleLocation || 'N/A'}</p>
            <p><strong>Target Met:</strong> <span class="status-badge ${storedTargetMetClass}">${storedTargetMet}</span></p>
            <p><strong>Total Units:</strong> ${reportData.grandTotalUnits ?? 'N/A'}</p>
            <p><strong>Total Cartons:</strong> ${modalTotalCartons}</p> 
        `;

        // Format GeoLocation link
        let locationLink = '<em>Not Provided</em>';
        if (reportData.userGeoLocation?.startsWith('http')) {
            locationLink = `<a href="${reportData.userGeoLocation}" target="_blank" rel="noopener noreferrer">View Map <i class="fas fa-external-link-alt fa-xs"></i></a>`;
        } else if (reportData.userGeoLocation && !reportData.userGeoLocation.startsWith('Error') && reportData.userGeoLocation !== 'Not Supported') {
            locationLink = `<em>${reportData.userGeoLocation}</em>`; // Display text if not a link/error
        } else if (reportData.userGeoLocation) {
             locationLink = `<em style="color:var(--danger-color);">${reportData.userGeoLocation}</em>`; // Show errors/unsupported in red
        }
        contentHTML += `<p><strong>GeoLocation:</strong> ${locationLink}</p></div>`; // Close report-meta


        // Display Notice
        contentHTML += `<h4><i class="fas fa-clipboard"></i> Notice</h4>`;
        if (reportData.notice) {
            // Basic escaping for safety, replace newlines with <br>
            const safeNotice = reportData.notice.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>'); // Use HTML entities
            contentHTML += `<p class="report-notice">${safeNotice}</p>`;
        } else {
            contentHTML += `<p><em>No notice provided.</em></p>`
        }

        // Display Sales Breakdown (Using Firestore Data Structure)
        contentHTML += `<div class="report-categories"><h4><i class="fas fa-boxes"></i> Sales Breakdown (Total: ${reportData.grandTotalUnits ?? 'N/A'} Units)</h4>`;
        if (Array.isArray(reportData.categories) && reportData.categories.length > 0) {
            // Handle Array Format (from Firestore)
            reportData.categories.forEach(category => {
                const safeCatName = category.name?.replace(/</g, "&lt;").replace(/>/g, "&gt;") || 'Unnamed Category'; // Use HTML entities
                const unitLabel = category.name === warsteinerCtnCategory ? 'Cartons' : 'Units'; // <-- NEW: Dynamic Unit Label
                contentHTML += `<div class="report-category">
                                    <h5>${safeCatName} (${category.totalUnits ?? 'N/A'} ${unitLabel})</h5> 
                                    <div class="report-items">`; // Start items div
                if (Array.isArray(category.items) && category.items.length > 0) {
                    contentHTML += category.items.map(item => {
                        const safeItemName = item.name?.replace(/</g, "&lt;").replace(/>/g, "&gt;") || 'Unnamed Item'; // Use HTML entities
                        // Use the same dynamic unit label for items within the category
                        return `<div class="report-item"><span>${safeItemName}</span><span>${item.quantity ?? 0} ${unitLabel}</span></div>`;
                    }).join('');
                } else {
                    contentHTML += '<p><em>No items reported in this category.</em></p>';
                }
                contentHTML += `</div></div>`; // Close items div and category div
            });
        } else {
             contentHTML += '<p><em>No sales items were reported.</em></p>';
        }
        contentHTML += `</div>`; // Close report-categories

        // Update modal content
        modalContent.innerHTML = contentHTML;

    } catch (error) {
        console.error(`Error loading details for report ${reportId}:`, error);
        modalContent.innerHTML = `<p class="error-message">Error loading details: ${error.message}. Please check the console.</p>`;
    }
}


function filterReports() {
    // ... (keep existing function content, update colspan for no-match row)
    const staffFilter = document.getElementById('reportStaffFilter')?.value || '';
    const shiftFilter = document.getElementById('reportShiftFilter')?.value || '';
    const dateFilter = document.getElementById('reportDateFilter')?.value || ''; // Expects YYYY-MM-DD
    const reportsListBody = document.getElementById('reportsList'); // Get the tbody element
    if (!reportsListBody) return; // Exit if tbody not found

    const rows = reportsListBody.querySelectorAll('tr'); // Select only rows within the tbody
    let visibleCount = 0;
    const noMatchRowId = 'no-filter-match-row';
    let noMatchRow = document.getElementById(noMatchRowId);
    const COL_SPAN = 8; // <-- NEW: Use same column span

    // Remove existing "no match" row if present
    if(noMatchRow) noMatchRow.remove();

    let hasDataRows = false; // Flag to check if there are any actual data rows

    rows.forEach(row => {
        // Ensure it's a data row (has data attributes)
        if (row.hasAttribute('data-staff-id')) {
            hasDataRows = true; // We found at least one data row
            const staffId = row.getAttribute('data-staff-id');
            const shift = row.getAttribute('data-shift');
            const date = row.getAttribute('data-date'); // YYYY-MM-DD format

            // Check if row matches all active filters
            const staffMatch = !staffFilter || staffId === staffFilter;
            const shiftMatch = !shiftFilter || shift === shiftFilter;
            const dateMatch = !dateFilter || date === dateFilter;

            // Show or hide based on match
            if (staffMatch && shiftMatch && dateMatch) {
                row.style.display = ''; // Show row
                visibleCount++;
            } else {
                row.style.display = 'none'; // Hide row
            }
        } else if (row.textContent.includes("Loading...") || row.textContent.includes("No reports submitted yet.")) {
             // Keep placeholder rows visible if they exist
             row.style.display = '';
        } else {
             // Hide any other unexpected rows within tbody
              row.style.display = 'none';
        }
    });

    // Add "no match" row only if there were data rows but none matched
    if (visibleCount === 0 && hasDataRows) {
        noMatchRow = document.createElement('tr');
        noMatchRow.id = noMatchRowId;
        // UPDATED COLSPAN
        noMatchRow.innerHTML = `<td colspan="${COL_SPAN}" class="text-center text-muted fst-italic">No reports match the selected filters.</td>`;
        reportsListBody.appendChild(noMatchRow);
    }
}


// ============================================================= //
// ===== REVISED checkAuthState Function (Version 2) ====== //
// ============================================================= //
async function checkAuthState() {
    // ... (keep existing function content)
    console.log("Auth Check Running...");

    onAuthStateChanged(auth, async (user) => {
        const path = window.location.pathname;
        const isLogin = path.endsWith('/') || path.endsWith('index.html');
        const isAdminPage = path.includes('admin.html');
        const isStaffPage = path.includes('staff.html');

        console.log(`Auth State Change Detected: User ${user?.uid || 'null'}, Current Page Path: ${path}`);

        if (!user) {
            // User is logged out
            console.log("User is null (logged out).");
            if (!isLogin) {
                console.log("Not on login page, redirecting to login.");
                redirectToLogin();
            } else {
                console.log("Already on login page.");
            }
            // No further processing needed if logged out
            return;
        }

        // --- User is Logged In ---
        console.log(`User ${user.uid} is logged in.`);

        if (isAdminPage) {
            console.log("Currently on Admin Page. Performing admin setup.");
            // Perform admin-specific setup *if needed* (consider flags to prevent redundant loads)
            if (!window.adminDataLoaded) { // Check flag
                 console.log("Calling loadUsers and loadReports for admin page...");
                 // loadReports now handles storing data and triggering initial graph render
                 await Promise.allSettled([loadUsers(), loadReports()])
                     .then(results => {
                         console.log("Finished loading admin data check:", results.map(r => r.status));
                         results.forEach((result, index) => {
                             if (result.status === 'rejected') {
                                console.error(`Error during admin data load (${index === 0 ? 'users' : 'reports'}):`, result.reason);
                             }
                         });
                         window.adminDataLoaded = true; // Set flag after attempting load
                     });
            } else {
                 console.log("Admin data likely already loaded, skipping reload on this auth change.");
            }
            // Update greeting for Admin page
            const adminGreetEl = document.getElementById('adminGreeting');
            if (adminGreetEl) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if(userDocSnap.exists()){
                         const name = userDocSnap.data().name || user.email?.split('@')[0] || 'Admin';
                         adminGreetEl.textContent = `Welcome back, ${name}`;
                    } else {
                        adminGreetEl.textContent = `Welcome back, Admin`;
                    }
                } catch(e){
                    console.warn("Could not fetch admin name for greeting", e);
                    adminGreetEl.textContent = `Welcome back, Admin`;
                }
            }
            // --- IMPORTANT: Exit the listener here for admin page ---
            return;
        }

        // --- If NOT on Admin Page, proceed with role check and redirection ---
        console.log("Not on Admin Page. Proceeding with role check for redirection/setup.");
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const role = userData.role;
                const name = userData.name || user.email?.split('@')[0] || 'User';
                console.log(`User profile found: ${name}, Role: ${role}`);

                // Update greeting (safe to do regardless of page)
                const greetId = isStaffPage ? 'staffGreeting' : null; // Only staff page has greeting here
                if (greetId) {
                    const greetEl = document.getElementById(greetId);
                    if (greetEl) greetEl.textContent = `Welcome, ${name}`;
                }

                // --- Redirection Logic (Only if NOT on Admin Page) ---
                if (isLogin) {
                    // On login page -> Redirect to correct dashboard
                    console.log("User is on login page. Redirecting based on role...");
                    window.location.href = role === 'admin' ? 'admin.html' : 'staff.html';
                } else if (isStaffPage) {
                    // On Staff Page
                    if (role === 'admin') {
                        // Admin on Staff page -> Redirect to Admin
                        console.log("Admin detected on Staff page. Redirecting to admin.html");
                        window.location.href = 'admin.html';
                    } else {
                        // Staff on Staff page -> CORRECT, Do specific setup
                        console.log("Staff on correct page (staff.html). Performing staff setup.");
                         const userInput = document.getElementById('staffUsername');
                         if (userInput && !userInput.value) { // Check if empty before filling
                             console.log("Pre-filling staff username.");
                             userInput.value = name;
                         }
                         // Potentially other staff page setup
                    }
                } else {
                    // On some other unexpected page? Log it.
                    console.warn(`User ${user.uid} (Role: ${role}) is on unexpected page: ${path}. Redirecting based on role.`);
                     window.location.href = role === 'admin' ? 'admin.html' : 'staff.html';
                }

            } else {
                // User authenticated but no profile doc in Firestore
                console.warn("User doc NOT found in Firestore:", user.uid);
                // Determine error element based on current page (can't be admin page here)
                let errId = isLogin ? 'loginError' : 'submitReportError'; // Assume staff if not login
                displayError(errId, 'User profile data missing. Contact admin.');
                await signOut(auth);
                console.log("Logged out user due to missing profile.");
                // Redirect will happen in the next auth state change
            }
        } catch (error) {
            console.error("Auth State Change - Firestore Check Error:", error);
            let errId = isLogin ? 'loginError' : 'submitReportError'; // Assume staff if not login
            displayError(errId, `Error accessing user data: ${error.message}. Try refreshing.`);
            if (error.code === 'permission-denied') {
                console.warn("Permission denied accessing user data, logging out.");
                await signOut(auth);
            }
        }
    }, (error) => { // Error object for the listener itself
        console.error("Auth State Listener Error:", error);
        displayError('loginError', 'Authentication check failed. Please refresh the page.');
    });
}
// ============================================================= //
// ===== END: REVISED checkAuthState Function (Version 2) ====== //
// ============================================================= //


// ----- DOMContentLoaded Event Listener -----
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initial setup.");
    window.adminDataLoaded = false; // Initialize flag
    checkAuthState(); // Check auth state immediately

    // Register Chart.js datalabels plugin globally
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
         console.log("Registering ChartDataLabels plugin.");
         Chart.register(ChartDataLabels);
     } else {
         console.error("Chart.js or ChartDataLabels plugin not loaded!");
     }
     // *** ADDED: Register Zoom Plugin (Optional but safe) ***
     if (typeof Chart !== 'undefined' && typeof window.Zoom !== 'undefined') {
         console.log("Registering chartjs-plugin-zoom.");
         Chart.register(window.Zoom);
     } else if (typeof Chart !== 'undefined' && typeof Chart.Zoom !== 'undefined'){
         console.log("Registering chartjs-plugin-zoom (found on Chart object).");
         Chart.register(Chart.Zoom);
     } else {
         console.error("chartjs-plugin-zoom not found for registration!");
     }


    // ===== Login Page Logic =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // ... (keep existing login form logic)
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('button[type="submit"]');
            clearError('loginError');
            if (!email || !password) {
                displayError('loginError', 'Please enter both email and password.');
                return;
            }
            if (!email.includes('@') || !email.includes('.')) { // Simple validation
                displayError('loginError', 'Please enter a valid email address.');
                return;
            }
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Success leads to page redirect via onAuthStateChanged listener
                console.log("Sign in successful, waiting for auth state change...");
            } catch (error) {
                let msg = 'Login failed. Please check your credentials.'; // Default message
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    msg = 'Invalid email or password.';
                } else if (error.code === 'auth/invalid-email') {
                    msg = 'Invalid email format.';
                } else if (error.code === 'auth/user-disabled') {
                    msg = 'This account has been disabled.';
                } else if (error.code === 'auth/too-many-requests') {
                    msg = 'Too many login attempts. Please try again later.';
                } else if (error.code === 'auth/network-request-failed') {
                    msg = 'Network error. Please check your internet connection.';
                } else {
                    console.error("Login Error:", error); // Log unexpected errors
                    msg = `An unexpected error occurred: ${error.code}`;
                }
                displayError('loginError', msg);
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            }
        });
    }

    // ===== Admin Dashboard Logic (Event Listeners & UI) =====
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        // ... (keep existing admin page listeners: logout, add user, refresh, filters, export, graph updates, zoom reset)
        console.log("Admin container found. Setting up UI listeners.");
        // Get references to all needed elements
        const logoutBtn = document.getElementById('logoutBtn');
        const addUserBtn = document.getElementById('addUserBtn');
        const addUserFormPopup = document.getElementById('addUserForm');
        const cancelAddUserBtn = document.getElementById('cancelAddUser');
        const newUserForm = document.getElementById('newUserForm');
        const refreshReportsBtn = document.getElementById('refreshReports');
        // Report Table Filters
        const staffFilter = document.getElementById('reportStaffFilter');
        const shiftFilter = document.getElementById('reportShiftFilter');
        const dateFilter = document.getElementById('reportDateFilter');
        // Export Controls
        const exportExcelBtn = document.getElementById('exportExcelBtn');
        const exportStartDateInput = document.getElementById('exportStartDate');
        const exportEndDateInput = document.getElementById('exportEndDate');
        const exportStatusElement = document.getElementById('exportStatus');
        // Graph Controls
        const updateGraphBtn = document.getElementById('updateGraphBtn');
        const graphStartDateInput = document.getElementById('graphStartDate');
        const graphEndDateInput = document.getElementById('graphEndDate');
        const resetGraphZoomBtn = document.getElementById('resetGraphZoomBtn'); // *** Get reset button

        // Logout Button
        if (logoutBtn) logoutBtn.addEventListener('click', async () => {
             window.adminDataLoaded = false; // Reset flag on logout
             window.allReportsData = null; // Clear stored report data
             logoutBtn.disabled = true;
             logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            try {
                await signOut(auth);
                console.log("Sign out successful, waiting for auth state change...");
                // Redirect happens via onAuthStateChanged
            } catch (error) {
                console.error("Logout Error:", error);
                alert('Logout failed: ' + error.message);
                logoutBtn.disabled = false;
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            }
        });

        // Add User Popup Handling
        if (addUserBtn && addUserFormPopup && cancelAddUserBtn && newUserForm) {
            const showAddUserPopup = () => {
                addUserFormPopup.style.display = 'block';
                newUserForm.reset();
                clearError('addUserError');
                document.getElementById('newUserEmail').focus(); // Focus first field
            };
            const hideAddUserPopup = () => {
                addUserFormPopup.style.display = 'none';
                newUserForm.reset();
                clearError('addUserError');
            };
            addUserBtn.addEventListener('click', showAddUserPopup);
            cancelAddUserBtn.addEventListener('click', hideAddUserPopup);

            // New User Form Submission LOGIC
            newUserForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('newUserEmail').value.trim();
                const name = document.getElementById('newUserName').value.trim();
                const password = document.getElementById('newPassword').value;
                const role = document.getElementById('userRole').value; // Gets 'staff' or 'admin'
                clearError('addUserError');

                // Validation
                if (!email || !name || !password || !role) {
                    displayError('addUserError', 'Please fill out all fields.'); return;
                }
                if (password.length < 6) {
                    displayError('addUserError', 'Password must be at least 6 characters.'); return;
                }
                 if (!email.includes('@') || !email.includes('.')) { // Basic email format check
                    displayError('addUserError', 'Invalid email format.'); return;
                }

                const adminUser = auth.currentUser; // Get current admin user
                if (!adminUser) {
                    displayError('addUserError', 'Admin authentication error. Please re-login.');
                    // Find the button again to re-enable it
                    const submitButtonInner = newUserForm.querySelector('button[type="submit"]');
                    if (submitButtonInner) {
                        submitButtonInner.disabled = false;
                        submitButtonInner.innerHTML = '<i class="fas fa-save"></i> Save User';
                    }
                    return;
                }

                const submitButton = newUserForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                let createdAuthUid = null; // To track if auth user was created
                try {
                    // 1. Create user in Firebase Auth
                    console.log(`Attempting to create Auth user: ${email}`);
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    createdAuthUid = userCredential.user.uid;
                    console.log(`User created in Auth: ${createdAuthUid} (Role selected: ${role})`);

                    // Prepare Firestore data
                    const userProfileData = {
                        email: email,
                        name: name,
                        role: role, // Use the value selected in the form ('staff' or 'admin')
                        uid: createdAuthUid,
                        createdAt: serverTimestamp(),
                        createdBy: adminUser.uid
                    };

                    // 2. Create user profile in Firestore
                    console.log(`Attempting to write Firestore profile for UID: ${createdAuthUid} by Admin: ${adminUser.uid}`);
                    console.log("Data to write:", JSON.stringify(userProfileData));
                    await setDoc(doc(db, "users", createdAuthUid), userProfileData);
                    console.log("Firestore setDoc call completed successfully.");

                    alert(`User ${name} (${role}) created successfully!`);
                    hideAddUserPopup(); // Close popup
                    await loadUsers(); // Refresh the user list

                } catch (error) {
                    console.error("----- ADD USER ERROR -----");
                    console.error(`Error occurred while trying to create user with role: ${role}`);
                    console.error("Error Code:", error.code);
                    console.error("Error Message:", error.message);
                    console.error("Full Error Object:", error);
                    console.error("--------------------------");

                    let errorMsg = `Error creating user (${name}, role: ${role}): ${error.message}`;
                    // Provide more specific feedback
                    if (error.code === 'auth/email-already-in-use') {
                        errorMsg = `This email address (${email}) is already registered.`;
                    } else if (error.code === 'auth/weak-password') {
                        errorMsg = 'Password is too weak (must be at least 6 characters).';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMsg = `Invalid email format: ${email}.`;
                    } else if (error.code === 'permission-denied') {
                         errorMsg = `Database Permission Denied. Cannot save user profile for ${name} (role: ${role}).`;
                         if (createdAuthUid) {
                             console.warn(`Firestore profile creation failed for ${createdAuthUid}. Auth user might still exist and need manual cleanup in Firebase Console.`);
                             errorMsg += " (Auth user might need manual cleanup)";
                         }
                    } else if (error.message.includes('firestore') || error.message.includes('Firestore')) { // Generic Firestore error check
                        errorMsg = `Error saving user profile to database for ${name} (role: ${role}): ${error.message}`;
                    }
                    if (createdAuthUid) {
                        console.error(`Error occurred after Auth user ${createdAuthUid} was potentially created.`);
                    }
                    displayError('addUserError', errorMsg);

                } finally {
                    // Re-enable the button regardless of success or failure
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-save"></i> Save User';
                }
            });
        }

        // Refresh Reports Button (Also refreshes graph data)
        if (refreshReportsBtn) refreshReportsBtn.addEventListener('click', async () => {
            refreshReportsBtn.disabled = true;
            refreshReportsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            clearError('loadReportsError');
            clearError('loadGraphError'); // Clear previous graph errors

            // Reset graph date filters to show "All Time" after refresh
            if(graphStartDateInput) graphStartDateInput.value = '';
            if(graphEndDateInput) graphEndDateInput.value = '';

            window.adminDataLoaded = false; // Ensure reload happens via checkAuthState
            await loadReports(); // Reloads reports and triggers initial graph render
            // Flag (window.adminDataLoaded) will be set inside checkAuthState/loadReports if successful

            refreshReportsBtn.disabled = false;
            refreshReportsBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        });

        // Report TABLE Filters Listeners
        if (staffFilter) staffFilter.addEventListener('change', filterReports); // Filters the table
        if (shiftFilter) shiftFilter.addEventListener('change', filterReports); // Filters the table
        if (dateFilter) dateFilter.addEventListener('change', filterReports);   // Filters the table


        // Excel Export Functionality Listener
        if (exportExcelBtn && exportStartDateInput && exportEndDateInput && exportStatusElement) {
            // ... (MODIFIED Excel export logic)
            exportExcelBtn.addEventListener('click', async () => {
                const startDateString = exportStartDateInput.value;
                const endDateString = exportEndDateInput.value;

                // 1. Validation (same as before)
                if (!startDateString || !endDateString) {
                    exportStatusElement.textContent = 'Error: Please select both Start and End dates.';
                    exportStatusElement.style.color = 'var(--danger-color)';
                    return;
                }
                const startDate = new Date(Date.UTC(
                    parseInt(startDateString.substring(0, 4)),
                    parseInt(startDateString.substring(5, 7)) - 1,
                    parseInt(startDateString.substring(8, 10)),
                    0, 0, 0, 0 // UTC start of day
                ));
                 const endDate = new Date(Date.UTC(
                    parseInt(endDateString.substring(0, 4)),
                    parseInt(endDateString.substring(5, 7)) - 1,
                    parseInt(endDateString.substring(8, 10)),
                    23, 59, 59, 999 // UTC end of day
                ));
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    exportStatusElement.textContent = 'Error: Invalid date selected.';
                    exportStatusElement.style.color = 'var(--danger-color)'; return;
                }
                if (endDate < startDate) {
                    exportStatusElement.textContent = 'Error: End date cannot be before Start date.';
                    exportStatusElement.style.color = 'var(--danger-color)'; return;
                }

                exportStatusElement.textContent = 'Exporting... Please wait.';
                exportStatusElement.style.color = 'var(--primary-color)';
                exportExcelBtn.disabled = true;
                exportExcelBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';

                try {
                    // 2. Firestore Query (same as before)
                     console.log(`Querying reports for export from ${startDate.toISOString()} to ${endDate.toISOString()}`);
                    const startTimestamp = Timestamp.fromDate(startDate);
                    const endTimestamp = Timestamp.fromDate(endDate);
                    const reportsQuery = query(
                        collection(db, "reports"),
                        where("reportDateTime", ">=", startTimestamp),
                        where("reportDateTime", "<=", endTimestamp),
                        orderBy("reportDateTime", "asc") // Order by date within the export
                    );
                    const querySnapshot = await getDocs(reportsQuery);

                    if (querySnapshot.empty) {
                        exportStatusElement.textContent = 'No reports found for the selected date range.';
                        exportStatusElement.style.color = 'var(--gray-color)';
                        exportExcelBtn.disabled = false;
                        exportExcelBtn.innerHTML = '<i class="fas fa-download"></i> Export to Excel';
                        return;
                    }

                    console.log(`Found ${querySnapshot.size} reports for export.`);
                    exportStatusElement.textContent = `Found ${querySnapshot.size} reports. Preparing Excel file...`;

                    // 3. Data Transformation for Excel (Wider format - MODIFIED)
                    const exportData = [];
                    const allItemHeaders = new Set();

                    // First pass to gather all unique item headers (same as before)
                    querySnapshot.forEach((docSnap) => {
                        const report = docSnap.data();
                        if (Array.isArray(report.categories)) {
                            report.categories.forEach(cat => {
                                if (Array.isArray(cat.items)) {
                                    cat.items.forEach(item => {
                                        if (item.name) allItemHeaders.add(item.name);
                                    });
                                }
                            });
                        }
                    });
                    const sortedItemHeaders = Array.from(allItemHeaders).sort(); // Sort headers alphabetically

                    // Second pass to build the export data array (MODIFIED)
                    querySnapshot.forEach((docSnap) => {
                        const report = docSnap.data();
                        let reportDate = null;
                        let formattedDate = 'N/A';
                        let formattedTime = 'N/A';

                        if (report.reportDateTime?.toDate) { reportDate = report.reportDateTime.toDate(); }
                        else if (report.createdAt?.toDate) { reportDate = report.createdAt.toDate(); } // Fallback

                        if (reportDate) {
                             try {
                                formattedDate = reportDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
                                formattedTime = reportDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                             } catch (e) { console.error("Date formatting error", e); }
                        }

                        // --- NEW: Calculate Total Cartons for Export Row ---
                        let totalCartonsForRow = 0;
                        if (Array.isArray(report.categories)) {
                            report.categories.forEach(category => {
                                if (category.name === warsteinerCtnCategory && Array.isArray(category.items)) {
                                    category.items.forEach(item => {
                                        totalCartonsForRow += (Number(item.quantity) || 0);
                                    });
                                }
                            });
                        }
                        // --- END: Calculate Total Cartons for Export Row ---

                        // Prepare row data with standard columns first (MODIFIED to include Total Cartons)
                        const rowData = {
                            'Date': formattedDate,
                            'Time': formattedTime,
                            'Staff': report.userName ?? 'N/A',
                            'Shift': report.shift ?? 'N/A',
                            'Sale Location': report.saleLocation ?? 'N/A',
                            'Total Units': report.grandTotalUnits ?? 0,
                            'Total Cartons': totalCartonsForRow, // <<< ADDED
                            'Target Met': report.targetMet ?? 'N/A', // Use stored overall target
                            'Notice': report.notice ?? '',
                            'GeoLocation': report.userGeoLocation ?? 'N/A',
                        };

                        // Add item quantities for this specific report (same as before)
                        const itemQuantities = {};
                         if (Array.isArray(report.categories)) {
                            report.categories.forEach(cat => {
                                if (Array.isArray(cat.items)) {
                                    cat.items.forEach(item => {
                                        if (item.name) {
                                            itemQuantities[item.name] = (itemQuantities[item.name] || 0) + (item.quantity ?? 0);
                                        }
                                    });
                                }
                            });
                        }

                        // Populate the item columns for this row (same as before)
                        sortedItemHeaders.forEach(header => {
                            rowData[header] = itemQuantities[header] ?? 0; // Use 0 if item not in this report
                        });

                        exportData.push(rowData);
                    });


                    // 4. Excel Generation (using SheetJS/xlsx library - MODIFIED Header Order)
                    console.log("Generating worksheet...");
                    if (typeof XLSX === 'undefined') {
                        throw new Error("SheetJS library (XLSX) not loaded. Cannot export.");
                    }
                    const worksheet = XLSX.utils.json_to_sheet(exportData, {
                         // MODIFIED: Define header order including 'Total Cartons'
                        header: ['Date', 'Time', 'Staff', 'Shift', 'Sale Location', 'Total Units', 'Total Cartons', 'Target Met', 'Notice', 'GeoLocation', ...sortedItemHeaders]
                    });

                    // Optional: Auto-fit columns (same as before)
                     try {
                         const columnWidths = [];
                         // Use the header array directly now since it's defined
                         const currentHeaders = ['Date', 'Time', 'Staff', 'Shift', 'Sale Location', 'Total Units', 'Total Cartons', 'Target Met', 'Notice', 'GeoLocation', ...sortedItemHeaders];
                         currentHeaders.forEach((header, i) => {
                             let maxWidth = header.length;
                             exportData.forEach(row => {
                                 const cellValue = row[header];
                                 const cellLength = cellValue != null ? String(cellValue).length : 0;
                                 if (cellLength > maxWidth) { maxWidth = cellLength; }
                             });
                             // Ensure minimum width for readability, max width to prevent overly wide columns
                             columnWidths[i] = { wch: Math.max(8, Math.min(maxWidth + 2, 50)) };
                         });
                         worksheet['!cols'] = columnWidths;
                     } catch (widthError) {
                         console.warn("Error calculating column widths (optional):", widthError);
                     }

                    console.log("Creating workbook...");
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Reports");

                    // 5. File Download (same as before)
                    const filename = `Sales_Report_${startDateString}_to_${endDateString}.xlsx`;
                    console.log(`Triggering download for: ${filename}`);
                    XLSX.writeFile(workbook, filename);

                    exportStatusElement.textContent = `Export successful! File: ${filename}`;
                    exportStatusElement.style.color = 'var(--success-color)';

                } catch (error) {
                    console.error("Export Error:", error);
                     // Check for missing index error specifically
                     if (error.code === 'failed-precondition') {
                         console.error("Firestore index likely missing for export query: reports collection, field 'reportDateTime' (range filter), field 'reportDateTime' (asc). Check console for index creation link.");
                         exportStatusElement.textContent = `Error: Index missing for date range export. Check console.`;
                    } else {
                        exportStatusElement.textContent = `Error during export: ${error.message}`;
                    }
                    exportStatusElement.style.color = 'var(--danger-color)';
                } finally {
                    // Re-enable button (same as before)
                    exportExcelBtn.disabled = false;
                    exportExcelBtn.innerHTML = '<i class="fas fa-download"></i> Export to Excel';
                    setTimeout(() => {
                        if (exportStatusElement.textContent.includes('successful') || exportStatusElement.textContent.includes('No reports')) {
                           exportStatusElement.textContent = '';
                        }
                    }, 6000);
                }
            });
        } else {
             console.warn("Export related elements not all found in the DOM.");
             if(exportStatusElement) exportStatusElement.textContent = "Export UI failed to initialize.";
        }

        // *** Graph Update Button Listener *** (same as before)
        if (updateGraphBtn && graphStartDateInput && graphEndDateInput) {
              updateGraphBtn.addEventListener('click', () => {
                 const startDateString = graphStartDateInput.value;
                 const endDateString = graphEndDateInput.value;
                 let startDate = null;
                 let endDate = null;
                 const errorEl = document.getElementById('loadGraphError'); // Use graph specific error element
                 clearError('loadGraphError'); // Clear previous graph errors

                 if (startDateString) {
                     startDate = new Date(Date.UTC(
                         parseInt(startDateString.substring(0, 4)),
                         parseInt(startDateString.substring(5, 7)) - 1,
                         parseInt(startDateString.substring(8, 10)),
                         0, 0, 0, 0 // Start of day UTC
                     ));
                     if (isNaN(startDate.getTime())) { displayError('loadGraphError', 'Invalid Start Date selected.'); return; }
                 }
                 if (endDateString) {
                     endDate = new Date(Date.UTC(
                         parseInt(endDateString.substring(0, 4)),
                         parseInt(endDateString.substring(5, 7)) - 1,
                         parseInt(endDateString.substring(8, 10)),
                         23, 59, 59, 999 // End of day UTC
                     ));
                     if (isNaN(endDate.getTime())) { displayError('loadGraphError', 'Invalid End Date selected.'); return; }
                 }
                 if (startDate && endDate && endDate < startDate) { displayError('loadGraphError', 'End Date cannot be before Start Date.'); return; }

                 console.log(`Updating graph with dates: Start=${startDate ? startDate.toISOString() : 'null'}, End=${endDate ? endDate.toISOString() : 'null'}`);
                 renderItemSalesGraph(startDate, endDate);
             });
         } else {
              console.warn("Graph filter elements not all found.");
         }

        // *** ADDED: Graph Reset Zoom Button Listener *** (same as before)
        if (resetGraphZoomBtn) {
             resetGraphZoomBtn.addEventListener('click', () => {
                if (window.itemSalesChartInstance) {
                     console.log("Resetting graph zoom/pan.");
                     window.itemSalesChartInstance.resetZoom();
                 } else {
                     console.warn("Reset zoom called but no chart instance found.");
                 }
            });
        } else {
            console.warn("Reset Graph Zoom button not found.");
        }

    } // End of adminContainer check

    // ===== Staff Report Form Logic =====
    const staffContainer = document.querySelector('.staff-container');
    if (staffContainer) {
        console.log("Staff container found.");
        const staffLogoutBtn = document.getElementById('staffLogoutBtn'); // <-- Correct
        const salesReportForm = document.getElementById('salesReportForm');

        // Get common form elements
        const morningShiftBtn = document.getElementById('morningShift');
        const eveningShiftBtn = document.getElementById('eveningShift');
        const selectedShiftInput = document.getElementById('selectedShift');
        const dearManagementBtn = document.getElementById('dearManagementBtn'); // Keep reference if used elsewhere (e.g., template button)
        const categoriesContainer = document.getElementById('categoriesContainer'); // <-- Correct
        const userLocationInput = document.getElementById('userLocation');
        const locationStatusDiv = document.getElementById('locationStatus');
        const categoryTemplate = document.getElementById('categoryTemplate');
        const itemTemplate = document.getElementById('itemTemplate');
        const staffUsernameInput = document.getElementById('staffUsername');
        const saleLocationInput = document.getElementById('saleLocation');
        const noticeInput = document.getElementById('notice');
        // const targetSelect = document.getElementById('target'); // *** REMOVED ***
        const submitReportBtn = salesReportForm?.querySelector('button[type="submit"]');
        const retryLocationBtn = document.getElementById('retryLocationBtn');
        // +++ Target Display/Storage Elements +++
        const overallTargetStatusDisplay = document.getElementById('overallTargetStatusDisplay');
        const calculatedOverallTargetInput = document.getElementById('calculatedOverallTarget');
        // *** NEW: Get Category Selection Modal Elements ***
        const openCategoryModalBtn = document.getElementById('openCategoryModalBtn'); // Main button to open modal
        const categorySelectionModal = document.getElementById('categorySelectionModal');
        const categoryListContainer = document.getElementById('categoryListContainer');
        const addSelectedCategoriesBtn = document.getElementById('addSelectedCategoriesBtn');
        const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
        const cancelCategorySelectionBtn = document.getElementById('cancelCategorySelectionBtn');


        // *** NEW: Get Summary Modal Elements ***
        const viewSummaryBtn = document.getElementById('viewSummaryBtn');
        const summaryModal = document.getElementById('summaryModal');
        const summaryModalContent = document.getElementById('summaryModalContent');
        const closeSummaryModalBtn = document.getElementById('closeSummaryModal');

        if (staffLogoutBtn) {
            // ... (keep existing logout logic)
            staffLogoutBtn.addEventListener('click', async () => {
                staffLogoutBtn.disabled = true;
                staffLogoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
                try {
                    await signOut(auth);
                     console.log("Staff sign out successful, waiting for auth state change...");
                     // Redirect happens via onAuthStateChanged
                } catch (error) {
                     console.error("Staff Logout Error:", error);
                    alert('Logout failed: ' + error.message);
                    staffLogoutBtn.disabled = false;
                    staffLogoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                }
            });
        }

        if (salesReportForm) {
            console.log("Sales report form found. Setting up helpers and listeners.");

            // ----- START: Helper Functions for Staff Form -----
            function populateCategorySelect(selectElement) {
                 // ... (keep existing function content)
                if (!selectElement) return;
                selectElement.innerHTML = '<option value="" disabled selected>-- Select Category --</option>';
                Object.keys(predefinedItems).sort().forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat;
                    opt.textContent = cat;
                    selectElement.appendChild(opt);
                });
            }

            function populateItemSelect(itemSelectElement, categoryName) {
                 // ... (keep existing function content)
                if (!itemSelectElement) return;
                itemSelectElement.innerHTML = '<option value="" disabled selected>-- Select Item --</option>';
                itemSelectElement.disabled = true;
                const items = predefinedItems[categoryName] || [];
                if (!categoryName || items.length === 0) {
                    itemSelectElement.innerHTML = categoryName ? '<option value="" disabled>-- No items --</option>' : '<option value="" disabled>-- Select Category First --</option>';
                    return;
                }
                items.sort().forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item;
                    opt.textContent = item;
                    itemSelectElement.appendChild(opt);
                });
                itemSelectElement.disabled = false;
            }

            // +++ NEW FUNCTION: Calculate and Update Overall Target Status +++
            function updateOverallTargetStatus() {
                 console.log("Updating target status...");
                 if (!categoriesContainer || !overallTargetStatusDisplay || !calculatedOverallTargetInput) {
                     console.warn("Target display elements not found, cannot update status.");
                     return;
                 }

                 let oilGroupTotal = 0;
                 let chiaGroupTotal = 0;
                 let natureCharmGroupTotal = 0;
                 let warsteinerBeerGroupTotal = 0;
                 let warsteinerCtnGroupTotal = 0;
                 let hasAnySales = false; // Check if any quantity > 0 exists

                 categoriesContainer.querySelectorAll('.category').forEach((catEl) => {
                     const catSel = catEl.querySelector('.category-name');
                     const catName = catSel?.value;
                     if (!catName) return;

                     let currentCategoryTotal = 0;
                     catEl.querySelectorAll('.item .item-qty').forEach(inp => {
                         const qty = Number(inp.value) || 0;
                         currentCategoryTotal += qty;
                         if (qty > 0) hasAnySales = true;
                     });

                     // Add to the correct group total
                     if (oilCategories.includes(catName)) {
                         oilGroupTotal += currentCategoryTotal;
                     } else if (catName === chiaCategory) {
                         chiaGroupTotal += currentCategoryTotal;
                     } else if (catName === natureCharmCategory) {
                         natureCharmGroupTotal += currentCategoryTotal;
                     } else if (catName === warsteinerBeerCategory) {
                         warsteinerBeerGroupTotal += currentCategoryTotal;
                     } else if (catName === warsteinerCtnCategory) { // Match exact category name
                         warsteinerCtnGroupTotal += currentCategoryTotal;
                     }
                 });

                 // Determine target status for each group
                 const oilTargetMet = oilGroupTotal >= oilTargetThreshold;
                 const chiaTargetMet = chiaGroupTotal >= chiaTargetThreshold;
                 const natureCharmTargetMet = natureCharmGroupTotal >= natureCharmTargetThreshold;
                 const warsteinerBeerTargetMet = warsteinerBeerGroupTotal >= warsteinerBeerTargetThreshold;
                 const warsteinerCtnTargetMet = warsteinerCtnGroupTotal >= warsteinerCtnTargetThreshold;

                 // Determine overall target status
                 const overallTargetMet = oilTargetMet || chiaTargetMet || natureCharmTargetMet || warsteinerBeerTargetMet || warsteinerCtnTargetMet;
                 const overallTargetStatusText = overallTargetMet ? 'YES' : 'NO';

                 console.log(`Oil: ${oilGroupTotal}/${oilTargetThreshold} (${oilTargetMet}), Chia: ${chiaGroupTotal}/${chiaTargetThreshold} (${chiaTargetMet}), Charm: ${natureCharmGroupTotal}/${natureCharmTargetThreshold} (${natureCharmTargetMet}), Beer: ${warsteinerBeerGroupTotal}/${warsteinerBeerTargetThreshold} (${warsteinerBeerTargetMet}), CTN: ${warsteinerCtnGroupTotal}/${warsteinerCtnTargetThreshold} (${warsteinerCtnTargetMet}) -> Overall: ${overallTargetStatusText}`);

                 // Update UI
                 overallTargetStatusDisplay.textContent = overallTargetStatusText;
                 overallTargetStatusDisplay.className = `target-status-display ${overallTargetStatusText === 'YES' ? 'status-yes' : 'status-no'}`;
                 calculatedOverallTargetInput.value = overallTargetStatusText; // Store for submission

                 // Optionally, reset if no sales have been entered
                 if (!hasAnySales && categoriesContainer.querySelectorAll('.item').length === 0) {
                     overallTargetStatusDisplay.textContent = 'Not Calculated';
                     overallTargetStatusDisplay.className = 'target-status-display status-not-calculated';
                     calculatedOverallTargetInput.value = 'NO'; // Default to NO if nothing entered
                 }
            }

            function calculateCategoryTotal(categoryElement) {
                // ... (keep existing function content, but ALSO call target update)
                if (!categoryElement) return 0;
                const itemsCont = categoryElement.querySelector('.items-container');
                const totalSpan = categoryElement.querySelector('.total-value');
                if (!itemsCont || !totalSpan) return 0;
                let total = 0;
                itemsCont.querySelectorAll('.item .item-qty').forEach(inp => {
                    total += Number(inp.value) || 0;
                });
                 const finalTotal = Math.max(0, Math.floor(total));
                 const categoryName = categoryElement.querySelector('.category-name')?.value; // Get category name
                 const unitLabel = categoryName === warsteinerCtnCategory ? 'Cartons' : 'Units'; // Set label based on name
                 totalSpan.textContent = `${finalTotal} ${unitLabel}`; // Display total with correct unit

                 // +++ Trigger overall target update whenever a category total changes +++
                 updateOverallTargetStatus();

                 return finalTotal;
            }

            function addItem(itemsContainerElement, categoryName, preselectedItemName = null) {
                // ... (keep existing function content, but ensure qty input listener calls calculateCategoryTotal)
                if (!itemTemplate || !itemsContainerElement) { console.error("Item template or container missing"); return; }
                const clone = itemTemplate.content.cloneNode(true);
                const itemEl = clone.querySelector('.item');
                if (!itemEl) { console.error("Cloned item element not found"); return; }
                const itemSel = itemEl.querySelector('.item-name');
                const remBtn = itemEl.querySelector('.remove-item-btn');
                const qtyInp = itemEl.querySelector('.item-qty');
                const parentCat = itemsContainerElement.closest('.category');
                if (!itemSel || !remBtn || !qtyInp) { console.error("Required elements within item template not found"); return; }

                populateItemSelect(itemSel, categoryName);

                if (preselectedItemName) {
                    itemSel.value = preselectedItemName;
                    if (itemSel.value !== preselectedItemName) {
                         console.warn(`Could not preselect item "${preselectedItemName}" in category "${categoryName}". Item might not exist in dropdown.`);
                    }
                }

                remBtn.addEventListener('click', () => {
                    itemEl.remove();
                    if (parentCat) calculateCategoryTotal(parentCat); // Recalculate on remove
                });
                qtyInp.addEventListener('input', () => {
                    qtyInp.value = Math.max(0, Math.floor(Number(qtyInp.value) || 0));
                    if (parentCat) calculateCategoryTotal(parentCat); // Recalculate on input
                });
                itemsContainerElement.appendChild(itemEl);

                // Initial calculation after adding
                 if (parentCat) calculateCategoryTotal(parentCat);

                if (preselectedItemName) qtyInp.focus();
            }

             function addCategory(preselectCategory = null) {
                 // ... (keep existing function content, ensure change event calls calculateCategoryTotal)
                if (!categoryTemplate || !categoriesContainer) { console.error("Category template or container missing"); return; }
                const clone = categoryTemplate.content.cloneNode(true);
                const catEl = clone.querySelector('.category');
                if (!catEl) { console.error("Cloned category element not found"); return; }
                const catSel = catEl.querySelector('.category-name');
                const remBtn = catEl.querySelector('.remove-category-btn');
                const addBtn = catEl.querySelector('.add-item-btn');
                const itemsCont = catEl.querySelector('.items-container');
                const noItemsHint = catEl.querySelector('.no-items-hint');
                const addAnotherCatBtn = catEl.querySelector('.add-another-category-btn');

                if (!catSel || !remBtn || !addBtn || !itemsCont || !noItemsHint || !addAnotherCatBtn) {
                    console.error("Required elements within category template not found"); return;
                }

                populateCategorySelect(catSel);

                catSel.addEventListener('change', () => {
                    const selCat = catSel.value;
                    itemsCont.innerHTML = ''; // Clear previous items
                    noItemsHint.style.display = 'none';

                    if (selCat && predefinedItems[selCat]) {
                        const itemsForCategory = predefinedItems[selCat];
                        if (itemsForCategory.length > 0) {
                            itemsForCategory.forEach(itemName => {
                                addItem(itemsCont, selCat, itemName); // Add all predefined items for this cat
                            });
                            noItemsHint.style.display = 'none';
                        } else {
                            noItemsHint.textContent = 'No predefined items for this category. Use "Add Item" button.';
                            noItemsHint.style.display = 'block';
                        }
                        addBtn.disabled = false;
                    } else {
                         noItemsHint.textContent = 'Select a category first or use the button below to add items.';
                         noItemsHint.style.display = 'block';
                         addBtn.disabled = true;
                    }
                     // Initial calculation for the category after selection/population
                     calculateCategoryTotal(catEl); // This will now set the correct unit label
                });
                addBtn.disabled = true; // Initially disable "Add Item"

                remBtn.addEventListener('click', () => {
                    if (confirm("Remove this category and all its items?")) {
                         catEl.remove();
                         updateOverallTargetStatus(); // Recalculate overall target after removing a category
                    }
                });

                addBtn.addEventListener('click', () => {
                    const curCat = catSel.value;
                     if (!curCat) {
                         alert("Please select a category first before adding an item."); catSel.focus(); return;
                     }
                     addItem(itemsCont, curCat); // Add a single blank item
                     noItemsHint.style.display = 'none';
                     // calculateCategoryTotal is called within addItem
                });

                addAnotherCatBtn.addEventListener('click', () => { addCategory(); });

                categoriesContainer.appendChild(catEl);

                // If preselecting, trigger the change event to populate items and calculate
                if (preselectCategory && predefinedItems[preselectCategory]) {
                    catSel.value = preselectCategory;
                    catSel.dispatchEvent(new Event('change')); // Triggers item population and calculation
                } else {
                    noItemsHint.textContent = 'Select a category first or use the button below to add items.';
                    noItemsHint.style.display = 'block';
                     // Initial calculation for empty category
                     calculateCategoryTotal(catEl); // Sets initial unit label
                }


                if (!preselectCategory) catSel.focus();
            }

            function requestAutoLocation() {
                 // ... (keep existing function content)
                const setStatus = (message, statusClass = '', showRetry = false) => {
                     if (locationStatusDiv) {
                         locationStatusDiv.innerHTML = message; // Use innerHTML for potential icons
                         locationStatusDiv.className = `location-status ${statusClass}`;
                     }
                     if (retryLocationBtn) {
                         retryLocationBtn.style.display = showRetry ? 'inline-block' : 'none';
                     }
                 };

                if (!navigator.geolocation) {
                    setStatus('<i class="fas fa-times-circle"></i> Geolocation not supported.', 'status-error');
                    if (userLocationInput) userLocationInput.value = 'Not Supported';
                    return;
                }

                console.log("Requesting geolocation...");
                 // Show spinner icon while fetching
                setStatus('<i class="fas fa-spinner fa-spin"></i> Getting location...', '', false);
                if (userLocationInput) userLocationInput.value = 'Fetching...';

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude: lat, longitude: lon, accuracy: acc } = position.coords;
                        const url = `https://www.google.com/maps?q=${lat},${lon}`;
                        console.log(`Location obtained: ${url} (Accuracy: ${acc}m)`);
                        if (userLocationInput) userLocationInput.value = url;
                        // Show success icon
                        setStatus(`<i class="fas fa-check-circle"></i> Location captured (Acc: ${acc.toFixed(0)}m).`, 'status-success', false);
                    },
                    (error) => {
                        console.error("Geolocation Error:", error);
                        let errorMsg = `Geolocation Error: ${error.message}`;
                        let userLocationVal = `Error: ${error.message}`;
                        let showRetryButton = true;

                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMsg = "<i class='fas fa-ban'></i> Location Permission Denied.";
                                userLocationVal = "Error: Permission Denied";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMsg = "<i class='fas fa-map-marker-slash'></i> Location Info Unavailable.";
                                userLocationVal = "Error: Position Unavailable";
                                break;
                            case error.TIMEOUT:
                                errorMsg = "<i class='fas fa-clock'></i> Location Request Timed Out.";
                                userLocationVal = "Error: Timeout";
                                break;
                        }
                        setStatus(errorMsg, 'status-error', showRetryButton);
                        if (userLocationInput) userLocationInput.value = userLocationVal;
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
                );
            }

             // Helper function to simplify oil item names
             function simplifyOilItemName(fullName) {
                 // ... (keep existing function content)
                if (!fullName) return 'Unknown Item';
                let simplified = fullName.trim();
                // Make replacements case-insensitive
                simplified = simplified.replace(/^1629-?\s*/i, '');
                simplified = simplified.replace(/^PALAMIDAS\s+Glass\s+Bottle\s+/i, '');
                simplified = simplified.replace(/^Cambodian\s+Premium\s+/i, '');
                // Remove type part if present after stripping prefix
                simplified = simplified.replace(/-(Extra\s+Virgin\s+Olive\s+Oil|Virgin\s+Olive\s+Oil|Olive\s+Pomace\s+Oil|Peanut\s+Oil)/i, '');
                return simplified.trim();
             }

            // ----- END: Helper Functions for Staff Form -----


            // ----- START: REVISED Data Gathering and Formatting -----

            // Function to get all data from the form and process it (ENHANCED FOR TARGETS)
            function getReportDataFromForm() {
                const username = staffUsernameInput?.value || 'Unknown Staff';
                const shift = selectedShiftInput?.value || 'N/A';
                const saleLocation = saleLocationInput?.value.trim();
                const notice = noticeInput?.value.trim() || '';
                // const targetMet = targetSelect?.value; // *** REMOVED MANUAL TARGET ***
                const location = userLocationInput?.value || 'Not Provided';

                let grandTotalUnits = 0; // Still calculate for backend data
                const categoriesData = []; // For Firestore structure & processing
                const itemQuantitiesForSheet = {}; // For Google Sheets wide format

                // +++ Variables for target group totals +++
                let oilGroupTotal = 0;
                let chiaGroupTotal = 0;
                let natureCharmGroupTotal = 0;
                let warsteinerBeerGroupTotal = 0;
                let warsteinerCtnGroupTotal = 0;


                categoriesContainer?.querySelectorAll('.category').forEach((catEl) => {
                    const catSel = catEl.querySelector('.category-name');
                    const catName = catSel?.value;
                    if (!catName) return; // Skip empty categories

                    const itemsCont = catEl.querySelector('.items-container');
                    let catTotal = 0; // Calculate here
                    const itemsData = []; // For this category's items

                    itemsCont?.querySelectorAll('.item').forEach((itemEl) => {
                        const itemSel = itemEl.querySelector('.item-name');
                        const itemQtyInput = itemEl.querySelector('.item-qty');
                        const itemName = itemSel?.value;
                        const quantity = Number(itemQtyInput?.value) || 0;

                        if (itemName) {
                            itemsData.push({ name: itemName, quantity: quantity });
                            itemQuantitiesForSheet[itemName] = (itemQuantitiesForSheet[itemName] || 0) + quantity;
                            catTotal += quantity;
                        }
                    });

                    // Add category data if name exists
                    categoriesData.push({ name: catName, totalUnits: catTotal, items: itemsData });
                     // Accumulate grand total (only units, not cartons explicitly here unless logic changes)
                     // If 'Warsteiner CTN' should NOT count towards 'Total Units' display/target, adjust here:
                     if (catName !== warsteinerCtnCategory) {
                        grandTotalUnits += catTotal;
                     }

                    // +++ Accumulate target group totals +++
                    if (oilCategories.includes(catName)) {
                        oilGroupTotal += catTotal;
                    } else if (catName === chiaCategory) {
                        chiaGroupTotal += catTotal;
                    } else if (catName === natureCharmCategory) {
                        natureCharmGroupTotal += catTotal;
                    } else if (catName === warsteinerBeerCategory) {
                        warsteinerBeerGroupTotal += catTotal;
                    } else if (catName === warsteinerCtnCategory) {
                        warsteinerCtnGroupTotal += catTotal;
                    }
                });

                 // +++ Calculate individual and overall target status +++
                 const oilTargetMetStatus = oilGroupTotal >= oilTargetThreshold ? 'YES' : 'NO';
                 const chiaTargetMetStatus = chiaGroupTotal >= chiaTargetThreshold ? 'YES' : 'NO';
                 const natureCharmTargetMetStatus = natureCharmGroupTotal >= natureCharmTargetThreshold ? 'YES' : 'NO';
                 const warsteinerBeerTargetMetStatus = warsteinerBeerGroupTotal >= warsteinerBeerTargetThreshold ? 'YES' : 'NO';
                 const warsteinerCtnTargetMetStatus = warsteinerCtnGroupTotal >= warsteinerCtnTargetThreshold ? 'YES' : 'NO';

                 const overallTargetMetStatus = (oilGroupTotal >= oilTargetThreshold ||
                                               chiaGroupTotal >= chiaTargetThreshold ||
                                               natureCharmGroupTotal >= natureCharmTargetThreshold ||
                                               warsteinerBeerGroupTotal >= warsteinerBeerTargetThreshold ||
                                               warsteinerCtnGroupTotal >= warsteinerCtnTargetThreshold) ? 'YES' : 'NO';


                return {
                    username,
                    shift,
                    saleLocation,
                    notice,
                    // targetMet, // No longer needed from form
                    location,
                    categoriesData, // Array of { name, totalUnits, items: [{ name, quantity }] }
                    grandTotalUnits, // Keep for backend (primarily non-carton units if desired)
                    itemQuantitiesForSheet, // Object { "item name": quantity } for sheets
                    // +++ Return target details +++
                    targetGroupTotals: {
                        oil: oilGroupTotal,
                        chia: chiaGroupTotal,
                        natureCharm: natureCharmGroupTotal,
                        warsteinerBeer: warsteinerBeerGroupTotal,
                        warsteinerCtn: warsteinerCtnGroupTotal, // Specifically the carton category total
                    },
                    targetGroupStatus: {
                        oil: oilTargetMetStatus,
                        chia: chiaTargetMetStatus,
                        natureCharm: natureCharmTargetMetStatus,
                        warsteinerBeer: warsteinerBeerTargetMetStatus,
                        warsteinerCtn: warsteinerCtnTargetMetStatus,
                    },
                    overallTargetMet: overallTargetMetStatus, // The final YES/NO for the report
                };
            }

            // Function to format data for Telegram (REVISED FOR NEW FORMAT)
            function formatDataForTelegram(reportDetails) {
                const { username, shift, saleLocation, notice, location, categoriesData, targetGroupTotals, targetGroupStatus, overallTargetMet } = reportDetails;
                const reportDate = new Date(); // Use current date for formatting
                const fmtDateTelegram = reportDate.toLocaleDateString('en-GB'); // DD/MM/YYYY

                let tgMsg = `*PG DAILY SOLD OUT*\n`
                          + `*Date:* ${fmtDateTelegram}\n\n`
                          + `*Shift:* ${shift}\n`
                          + `*Report Sale at:* ${saleLocation || '_N/A_'}\n\n` // Handle empty sale location
                          + `*Dear Management Team!* :\n`;

                 // --- Category Group 1: Oils ---
                 tgMsg += `\n*Category-01. *:\n`;
                 const oilData = categoriesData.filter(cat => oilCategories.includes(cat.name));
                 if (oilData.length > 0) {
                     oilData.forEach(cat => {
                         tgMsg += `*${cat.name}*:\n`;
                         let itemCounter = 1;
                         if (cat.items.length > 0) {
                             cat.items.forEach((item) => {
                                 const simplifiedName = simplifyOilItemName(item.name); // Use simplified name
                                 tgMsg += `${itemCounter}. ${simplifiedName}: *${item.quantity}* Units\n`;
                                 itemCounter++;
                             });
                         } else {
                             tgMsg += ` - _No items reported_\n`;
                         }
                     });
                 } else {
                      tgMsg += ` - _No oil categories reported_\n`;
                 }
                 tgMsg += `=> *Total Sale : ${targetGroupTotals.oil}* Units\n`;
                 tgMsg += `*Target : ${targetGroupStatus.oil}*\n`;

                 // --- Category Group 2: Chia Seeds ---
                 tgMsg += `\n*Category-02. ${chiaCategory}*\nItems:\n`;
                 const chiaData = categoriesData.find(cat => cat.name === chiaCategory);
                 let chiaItemCounter = 1;
                 if (chiaData && chiaData.items.length > 0) {
                     chiaData.items.forEach((item) => {
                         tgMsg += `${chiaItemCounter}. ${item.name}: *${item.quantity}* Units\n`;
                         chiaItemCounter++;
                     });
                 } else {
                     tgMsg += ` - _No items reported_\n`;
                 }
                 tgMsg += `=> *Total Sale : ${targetGroupTotals.chia}* Units\n`;
                 tgMsg += `*Target : ${targetGroupStatus.chia}*\n`;

                 // --- Category Group 3: Nature's Charm ---
                 tgMsg += `\n*Category-03. ${natureCharmCategory}*\nItems:\n`;
                 const natureCharmData = categoriesData.find(cat => cat.name === natureCharmCategory);
                 let natureCharmItemCounter = 1;
                 if (natureCharmData && natureCharmData.items.length > 0) {
                     natureCharmData.items.forEach((item) => {
                         tgMsg += `${natureCharmItemCounter}. ${item.name}: *${item.quantity}* Units\n`;
                         natureCharmItemCounter++;
                     });
                 } else {
                     tgMsg += ` - _No items reported_\n`;
                 }
                 tgMsg += `=> *Total Sale : ${targetGroupTotals.natureCharm}* Units\n`;
                 tgMsg += `*Target : ${targetGroupStatus.natureCharm}*\n`;

                 // --- Category Group 4: Warsteiner Beer ---
                 tgMsg += `\n*Category-04. ${warsteinerBeerCategory}*\nItems:\n`;
                 const warsteinerBeerData = categoriesData.find(cat => cat.name === warsteinerBeerCategory);
                 let warsteinerBeerItemCounter = 1;
                 if (warsteinerBeerData && warsteinerBeerData.items.length > 0) {
                     warsteinerBeerData.items.forEach((item) => {
                         tgMsg += `${warsteinerBeerItemCounter}. ${item.name}: *${item.quantity}* Units\n`;
                         warsteinerBeerItemCounter++;
                     });
                 } else {
                     tgMsg += ` - _No items reported_\n`;
                 }
                 tgMsg += `=> *Total Sale : ${targetGroupTotals.warsteinerBeer}* Units\n`;
                 tgMsg += `*Target : ${targetGroupStatus.warsteinerBeer}*\n`;

                 // --- Category Group 5: Warsteiner CTN ---
                 tgMsg += `\n*Category-05. ${warsteinerCtnCategory}*\nItems:\n`;
                 const warsteinerCtnData = categoriesData.find(cat => cat.name === warsteinerCtnCategory);
                 let warsteinerCtnItemCounter = 1;
                 if (warsteinerCtnData && warsteinerCtnData.items.length > 0) {
                     warsteinerCtnData.items.forEach((item) => {
                         // Use "Carton" unit here
                         tgMsg += `${warsteinerCtnItemCounter}. ${item.name}: *${item.quantity}* Carton\n`;
                         warsteinerCtnItemCounter++;
                     });
                 } else {
                     tgMsg += ` - _No items reported_\n`;
                 }
                 // Use "Cartons" for total unit display here
                 tgMsg += `=> *Total Sale : ${targetGroupTotals.warsteinerCtn}* Cartons\n`;
                 tgMsg += `*Target : ${targetGroupStatus.warsteinerCtn}*\n`;


                // --- Footer ---
                tgMsg += `\n*Notice:* ${notice || '_N/A_'}\n`
                       + `*Staff:* ${username}\n`
                       + `*Target:* *${overallTargetMet}*\n`; // Display the overall YES/NO

                let mapLink = '_N/A_';
                if (location && location.startsWith('http')) { mapLink = `[Map](${location})`; }
                else if (location && !location.startsWith('Error') && location !== 'Not Supported' && location !== 'Not Provided' && location !== 'Fetching...') { mapLink = `_${location}_`; }
                else if (location) { mapLink = `_${location}_`; }
                tgMsg += `*Location:* ${mapLink}\n`;

                return tgMsg;
            }


            // Function to format data for the Summary Modal (REVISED)
            function formatDataForSummaryModal(reportDetails) {
                const { username, shift, saleLocation, notice, location, categoriesData, targetGroupTotals, targetGroupStatus, overallTargetMet } = reportDetails;
                const reportDate = new Date(); // Use current date for preview
                const fmtDate = reportDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

                // Basic HTML escaping function
                const escapeHtml = (unsafe) => {
                     // ... (keep existing escape function)
                    if (!unsafe) return '';
                    return unsafe
                         .replace(/&/g, "&amp;")
                         .replace(/</g, "&lt;")
                         .replace(/>/g, "&gt;")
                         .replace(/"/g, "&quot;")
                         .replace(/'/g, "&#039;");
                };


                let summaryHtml = `<div class="meta-info">
                                    <p><strong>Date:</strong> ${fmtDate}</p>
                                    <p><strong>Staff:</strong> ${escapeHtml(username)}</p>
                                    <p><strong>Shift:</strong> ${escapeHtml(shift)}</p>
                                    <p><strong>Sale Location:</strong> ${escapeHtml(saleLocation) || '<em>N/A</em>'}</p>
                                  </div>`;

                summaryHtml += `<h4>Sales Breakdown & Targets</h4>`;

                 // --- Oils Group ---
                 summaryHtml += `<div class="category-block"><strong>Oils Group:</strong><br>`;
                 const oilDataModal = categoriesData.filter(cat => oilCategories.includes(cat.name));
                 if (oilDataModal.length > 0) {
                     oilDataModal.forEach(cat => {
                         summaryHtml += `<span class="item-line"><em>${escapeHtml(cat.name)}:</em></span>`;
                         let itemCounter = 1;
                         if (cat.items.length > 0) {
                             cat.items.forEach(item => {
                                 const simplifiedName = simplifyOilItemName(item.name);
                                 summaryHtml += `<span class="item-line" style="padding-left: 15px;">${itemCounter}. ${escapeHtml(simplifiedName)}: <strong>${item.quantity}</strong> Units</span>`;
                                 itemCounter++;
                             });
                         } else {
                              summaryHtml += `<span class="item-line" style="padding-left: 15px;"><em>- No items</em></span>`;
                         }
                     });
                 } else {
                      summaryHtml += `<span class="item-line"><em>- No oil categories reported</em></span>`;
                 }
                 summaryHtml += `<span class="item-line total-line">=> Total: <strong>${targetGroupTotals.oil}</strong> Units | Target: <strong>${targetGroupStatus.oil}</strong></span></div>`;

                 // --- Chia Group ---
                 summaryHtml += `<div class="category-block"><strong>${chiaCategory}:</strong><br>`;
                 const chiaDataModal = categoriesData.find(cat => cat.name === chiaCategory);
                 let chiaItemCounterModal = 1;
                 if (chiaDataModal && chiaDataModal.items.length > 0) {
                     chiaDataModal.items.forEach(item => {
                         summaryHtml += `<span class="item-line">${chiaItemCounterModal}. ${escapeHtml(item.name)}: <strong>${item.quantity}</strong> Units</span>`;
                         chiaItemCounterModal++;
                     });
                 } else {
                     summaryHtml += `<span class="item-line"><em>- No items reported</em></span>`;
                 }
                 summaryHtml += `<span class="item-line total-line">=> Total: <strong>${targetGroupTotals.chia}</strong> Units | Target: <strong>${targetGroupStatus.chia}</strong></span></div>`;

                 // --- Nature's Charm Group ---
                 summaryHtml += `<div class="category-block"><strong>${natureCharmCategory}:</strong><br>`;
                 const natureCharmDataModal = categoriesData.find(cat => cat.name === natureCharmCategory);
                 let natureCharmItemCounterModal = 1;
                 if (natureCharmDataModal && natureCharmDataModal.items.length > 0) {
                     natureCharmDataModal.items.forEach(item => {
                         summaryHtml += `<span class="item-line">${natureCharmItemCounterModal}. ${escapeHtml(item.name)}: <strong>${item.quantity}</strong> Units</span>`;
                         natureCharmItemCounterModal++;
                     });
                 } else {
                     summaryHtml += `<span class="item-line"><em>- No items reported</em></span>`;
                 }
                 summaryHtml += `<span class="item-line total-line">=> Total: <strong>${targetGroupTotals.natureCharm}</strong> Units | Target: <strong>${targetGroupStatus.natureCharm}</strong></span></div>`;

                 // --- Warsteiner Beer Group ---
                 summaryHtml += `<div class="category-block"><strong>${warsteinerBeerCategory}:</strong><br>`;
                 const warsteinerBeerDataModal = categoriesData.find(cat => cat.name === warsteinerBeerCategory);
                 let warsteinerBeerItemCounterModal = 1;
                 if (warsteinerBeerDataModal && warsteinerBeerDataModal.items.length > 0) {
                     warsteinerBeerDataModal.items.forEach(item => {
                         summaryHtml += `<span class="item-line">${warsteinerBeerItemCounterModal}. ${escapeHtml(item.name)}: <strong>${item.quantity}</strong> Units</span>`;
                         warsteinerBeerItemCounterModal++;
                     });
                 } else {
                     summaryHtml += `<span class="item-line"><em>- No items reported</em></span>`;
                 }
                 summaryHtml += `<span class="item-line total-line">=> Total: <strong>${targetGroupTotals.warsteinerBeer}</strong> Units | Target: <strong>${targetGroupStatus.warsteinerBeer}</strong></span></div>`;

                 // --- Warsteiner CTN Group ---
                 summaryHtml += `<div class="category-block"><strong>${warsteinerCtnCategory}:</strong><br>`;
                 const warsteinerCtnDataModal = categoriesData.find(cat => cat.name === warsteinerCtnCategory);
                 let warsteinerCtnItemCounterModal = 1;
                 if (warsteinerCtnDataModal && warsteinerCtnDataModal.items.length > 0) {
                     warsteinerCtnDataModal.items.forEach(item => {
                         summaryHtml += `<span class="item-line">${warsteinerCtnItemCounterModal}. ${escapeHtml(item.name)}: <strong>${item.quantity}</strong> Cartons</span>`; // Use Carton
                         warsteinerCtnItemCounterModal++;
                     });
                 } else {
                     summaryHtml += `<span class="item-line"><em>- No items reported</em></span>`;
                 }
                 summaryHtml += `<span class="item-line total-line">=> Total: <strong>${targetGroupTotals.warsteinerCtn}</strong> Cartons | Target: <strong>${targetGroupStatus.warsteinerCtn}</strong></span></div>`; // Use Cartons


                // --- Footer ---
                summaryHtml += `<hr>
                                <p class="total-line"><strong>Overall Target Status:</strong> <strong class="${overallTargetMet === 'YES' ? 'text-success' : 'text-danger'}">${escapeHtml(overallTargetMet)}</strong></p>
                                <hr>
                                <h4>Additional Info</h4>
                                <p><strong>Notice:</strong> ${notice ? escapeHtml(notice).replace(/\n/g, '<br>') : '<em>N/A</em>'}</p>`;

                // Location formatting for HTML
                let locationHtml = '<em>N/A</em>';
                 // ... (keep existing location formatting logic)
                if (location && location.startsWith('http')) {
                    locationHtml = `<a href="${escapeHtml(location)}" target="_blank" rel="noopener noreferrer">View Map <i class="fas fa-external-link-alt fa-xs"></i></a>`;
                } else if (location && !location.startsWith('Error') && location !== 'Not Supported' && location !== 'Not Provided' && location !== 'Fetching...') {
                    locationHtml = `<em>${escapeHtml(location)}</em>`;
                } else if (location) {
                    locationHtml = `<em style="color:var(--danger-color);">${escapeHtml(location)}</em>`;
                }
                 summaryHtml += `<p><strong>Location:</strong> ${locationHtml}</p>`;

                return summaryHtml;
            }

            // ----- END: REVISED Data Gathering and Formatting -----


            // ----- Event Listeners for Staff Form -----
            morningShiftBtn?.addEventListener('click', () => {
                morningShiftBtn.classList.add('active');
                eveningShiftBtn?.classList.remove('active');
                if(selectedShiftInput) selectedShiftInput.value = 'Morning';
            });
            eveningShiftBtn?.addEventListener('click', () => {
                eveningShiftBtn.classList.add('active');
                morningShiftBtn?.classList.remove('active');
                if(selectedShiftInput) selectedShiftInput.value = 'Evening';
            });
            // The main "Add Category" button (#openCategoryModalBtn) listener is added below
            if (retryLocationBtn) {
                retryLocationBtn.addEventListener('click', requestAutoLocation);
            }

            // Initial setup on load for Staff Form
            requestAutoLocation();
            updateOverallTargetStatus(); // Calculate initial target status (likely NO)

            // ========================================================== //
            // ===== START: Category Selection Modal Logic ===== //
            // ========================================================== //

            function populateCategoryModal() {
                if (!categoryListContainer) return;
                categoryListContainer.innerHTML = ''; // Clear previous list
                const sortedCategories = Object.keys(predefinedItems).sort();

                if (sortedCategories.length === 0) {
                    categoryListContainer.innerHTML = '<p>No categories defined.</p>';
                    return;
                }

                sortedCategories.forEach((catName, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'category-select-item';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `cat_check_${index}`;
                    checkbox.value = catName;
                    checkbox.className = 'category-checkbox';

                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = catName;

                    itemDiv.appendChild(checkbox);
                    itemDiv.appendChild(label);
                    categoryListContainer.appendChild(itemDiv);
                });
            }

            function showCategoryModal() {
                if (categorySelectionModal) {
                    populateCategoryModal(); // Repopulate each time to ensure it's fresh
                    categorySelectionModal.style.display = 'block';
                }
            }

            function hideCategoryModal() {
                 if (categorySelectionModal) {
                     categorySelectionModal.style.display = 'none';
                     // Optionally clear checkboxes after closing
                     categoryListContainer?.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
                 }
            }

            function handleAddSelectedCategories() {
                const selectedCheckboxes = categoryListContainer?.querySelectorAll('.category-checkbox:checked');
                if (!selectedCheckboxes || selectedCheckboxes.length === 0) {
                    alert("Please select at least one category to add.");
                    return;
                }

                selectedCheckboxes.forEach(checkbox => {
                    addCategory(checkbox.value); // Use the existing addCategory function
                });

                hideCategoryModal(); // Close modal after adding
            }

            // ========================================================== //
            // ===== END: Category Selection Modal Logic ===== //
            // ========================================================== //


            // ========================================================== //
            // ===== START: View Summary Button Logic (Uses REVISED functions) ===== //
            // ========================================================== //
            if (viewSummaryBtn && summaryModal && summaryModalContent && closeSummaryModalBtn) {
                viewSummaryBtn.addEventListener('click', () => {
                    console.log("View Summary clicked");
                    clearError('submitReportError'); // Clear any previous submit errors

                    // 1. Get data directly from form using the REVISED function
                    const reportDetails = getReportDataFromForm();

                    // Basic validation check before showing summary
                     if (!reportDetails.username || reportDetails.username === 'Unknown Staff') { displayError('submitReportError', 'Username not set. Please wait or re-login.'); return; }
                     if (!reportDetails.shift || (reportDetails.shift !== 'Morning' && reportDetails.shift !== 'Evening')) { displayError('submitReportError', 'Please select a valid shift (Morning/Evening).'); return; }
                     if (!reportDetails.saleLocation) { displayError('submitReportError', 'Please enter the Sale Location.'); saleLocationInput?.focus(); return; }

                     // Simple check if any categories have missing names or items have missing names
                     let itemValidationError = false;
                     reportDetails.categoriesData.forEach(cat => {
                         if (!cat.name) itemValidationError = true;
                         cat.items.forEach(item => { if (!item.name) itemValidationError = true; });
                     });
                      if (itemValidationError) {
                          displayError('submitReportError', 'Please ensure all added categories and items have a selection.');
                          return;
                      }


                    // 2. Format data for HTML display using the REVISED function
                    const summaryHtml = formatDataForSummaryModal(reportDetails);

                    // 3. Display in modal
                    summaryModalContent.innerHTML = summaryHtml;
                    summaryModal.style.display = 'block';
                    summaryModalContent.scrollTop = 0; // Scroll to top
                });

                // Close modal listeners
                closeSummaryModalBtn.addEventListener('click', () => {
                    summaryModal.style.display = 'none';
                });

            } else {
                 console.error("Summary modal elements not found!");
             }
             // Close summary modal on outside click & Escape key
             window.addEventListener('click', (event) => {
                  if (summaryModal && event.target === summaryModal) {
                      summaryModal.style.display = 'none';
                  }
              });
             window.addEventListener('keydown', (event) => {
                  if (event.key === 'Escape' && summaryModal && summaryModal.style.display === 'block') {
                      summaryModal.style.display = 'none';
                  }
              });

            // ========================================================== //
            // ===== START: Category Selection Modal Event Listeners ===== //
            // ========================================================== //

            if (openCategoryModalBtn) {
                 openCategoryModalBtn.addEventListener('click', showCategoryModal);
            }
             if (addSelectedCategoriesBtn) {
                 addSelectedCategoriesBtn.addEventListener('click', handleAddSelectedCategories);
             }
             if (closeCategoryModalBtn) {
                 closeCategoryModalBtn.addEventListener('click', hideCategoryModal);
             }
             if (cancelCategorySelectionBtn) {
                 cancelCategorySelectionBtn.addEventListener('click', hideCategoryModal);
             }
              // Close category modal on outside click
              window.addEventListener('click', (event) => {
                  if (categorySelectionModal && event.target === categorySelectionModal) {
                      hideCategoryModal();
                  }
              });

            // ========================================================== //
            // ===== END: View Summary Button Logic ===== //
            // ========================================================== //


            // ========================================================== //
            // ===== START: Staff Report Form Submission Logic (REVISED) ===== //
            // ========================================================== //
            salesReportForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log("Submitting report...");
                clearError('submitReportError');

                // 1. Get and Validate Data using REVISED Function
                const reportDetails = getReportDataFromForm();
                // Destructure the necessary parts, including the overall calculated target and carton total
                const {
                    username, shift, saleLocation, notice, location,
                    categoriesData, grandTotalUnits, itemQuantitiesForSheet,
                    overallTargetMet, targetGroupTotals // Need carton total from here
                } = reportDetails;
                const totalCartonsSubmitted = targetGroupTotals.warsteinerCtn || 0; // Extract carton total


                 // --- Re-run Full Validation on Submit ---
                if (!username || username === 'Unknown Staff') { displayError('submitReportError', 'Username not set. Please wait or re-login.'); return; }
                if (!shift || (shift !== 'Morning' && shift !== 'Evening')) { displayError('submitReportError', 'Please select a valid shift (Morning/Evening). Click the button.'); return; }
                if (!saleLocation) { displayError('submitReportError', 'Please enter the Sale Location.'); saleLocationInput?.focus(); return; }
                if (location === 'Fetching...') { displayError('submitReportError', 'Still fetching location. Please wait or submit again.'); return; }
                if (location === 'Error: Permission Denied') { if (!confirm("Location permission was denied. Submit report without location?")) { requestAutoLocation(); return; } }
                else if (location.startsWith('Error:')) { if (!confirm(`Location capture failed (${location}). Submit anyway?`)) { return; } }
                else if (location === 'Not Supported' || location === 'Not Provided') { if (!confirm("Location data is unavailable or was not provided. Submit report anyway?")) { return; } }

                let validationPassed = true;
                let firstInvalidElement = null;
                let hasItemsWithQuantity = false;
                let hasAnyItemsDefined = false;

                if (!categoriesData || categoriesData.length === 0) {
                    if (!confirm("No sales items added. Are you sure you want to submit a zero sales report?")) { validationPassed = false; openCategoryModalBtn?.focus(); } // Focus on the add category button
                 } else {
                     // Validation for added categories
                    categoriesData.forEach((catData) => {
                        const catEl = Array.from(categoriesContainer.querySelectorAll('.category')).find(el => el.querySelector('.category-name')?.value === catData.name);
                        if (!catData.name) { displayError('submitReportError', 'Please select a category name for all added category blocks.'); if (!firstInvalidElement && catEl) firstInvalidElement = catEl.querySelector('.category-name'); validationPassed = false; }

                        catData.items.forEach(itemData => {
                            hasAnyItemsDefined = true;
                            const itemEl = Array.from(catEl?.querySelectorAll('.item') || []).find(el => el.querySelector('.item-name')?.value === itemData.name);
                            if (!itemData.name) { displayError('submitReportError', `Please select an item name for all added items in category: ${catData.name || 'Unnamed'}.`); if (!firstInvalidElement && itemEl) firstInvalidElement = itemEl.querySelector('.item-name'); validationPassed = false; }
                            if (itemData.quantity > 0) { hasItemsWithQuantity = true; }
                        });
                    });
                    if (validationPassed && hasAnyItemsDefined && !hasItemsWithQuantity) {
                        // Only ask confirmation if items were actually added but all have 0 quantity
                        if (!confirm("You have added items, but all quantities are zero. Submit a zero sales report?")) { validationPassed = false; const firstQtyInput = categoriesContainer?.querySelector('.item-qty'); if(firstQtyInput && !firstInvalidElement) firstInvalidElement = firstQtyInput; }
                    }
                }
                if (!validationPassed) { firstInvalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstInvalidElement?.focus(); return; }

                // Check if any category blocks are present but still have the default "-- Select Category --" option selected
                 const unselectedCategories = categoriesContainer?.querySelectorAll('.category-name option[value=""]:checked');
                 if (unselectedCategories && unselectedCategories.length > 0) {
                     displayError('submitReportError', 'Please select a valid category name for all added category blocks.');
                     unselectedCategories[0].closest('.category-name')?.focus();
                     return;
                 }
                // --- End Validation ---


                const currentUser = auth.currentUser;
                if (!currentUser) { displayError('submitReportError', 'Authentication error. Please refresh and log in again.'); return; }

                submitReportBtn.disabled = true;
                submitReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                let firestoreSuccess = false;
                let sheetsSuccess = false;
                let telegramSuccess = false;

                try {
                    const reportTimestamp = Timestamp.now();
                    const reportDate = reportTimestamp.toDate(); // JavaScript Date Object

                    // 1. Data for Firestore (Use overallTargetMet and include totalCartons)
                    const reportDataFirestore = {
                        userId: currentUser.uid,
                        userName: username,
                        shift,
                        saleLocation,
                        notice,
                        targetMet: overallTargetMet, // *** Use the calculated overall target ***
                        userGeoLocation: location,
                        reportDateTime: reportTimestamp,
                        categories: categoriesData, // Already structured correctly
                        grandTotalUnits, // Keep grand total (represents non-carton units if calculation adjusted)
                        totalCartons: totalCartonsSubmitted, // <-- NEW: Store total cartons separately
                        createdAt: serverTimestamp()
                    };

                    console.log("Saving to Firestore:", JSON.stringify(reportDataFirestore));
                    const docRef = await addDoc(collection(db, "reports"), reportDataFirestore);
                    console.log("Saved to Firestore with ID:", docRef.id);
                    firestoreSuccess = true;

                    // 2. Prepare and Send Telegram Message (using REVISED function - already includes cartons)
                    console.log("Formatting Telegram message...");
                    const tgMsg = formatDataForTelegram(reportDetails); // Pass the full details object
                    console.log("Sending to Telegram...");
                    await sendToTelegram(tgMsg);
                    telegramSuccess = true;

                    // 3. Data for Google Sheets (Use overallTargetMet and include totalCartons)
                    const formattedDate = reportDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
                    const formattedTime = reportDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second:'2-digit', hour12: true }); // HH:MM:SS AM/PM
                    const sheetsData = {
                        date: formattedDate,
                        time: formattedTime,
                        staff_name: username,
                        shift: shift,
                        sale_location: saleLocation,
                        total_units: grandTotalUnits, // Total non-carton units (if calc adjusted) or all units
                        total_cartons: totalCartonsSubmitted, // <-- NEW: Add total cartons to Sheets
                        target_met: overallTargetMet, // *** Use the calculated overall target ***
                        notice: notice || '',
                        location: location,
                        timestamp: `${formattedDate} ${formattedTime}`, // Combined date and time strings
                        ...itemQuantitiesForSheet // Spread the item quantities
                    };

                    console.log("Sending to Google Sheets (wide format)...");
                    await sendToGoogleSheets(sheetsData);
                    sheetsSuccess = true;


                    // --- Report Submission Success ---
                    alert('Report submitted successfully!');

                    // Reset Form
                    salesReportForm.reset();
                    if (categoriesContainer) categoriesContainer.innerHTML = '';
                    if (locationStatusDiv) locationStatusDiv.textContent = ''; // Clear status
                    if (locationStatusDiv) locationStatusDiv.className = 'location-status'; // Reset class
                    if (retryLocationBtn) retryLocationBtn.style.display = 'none'; // Hide retry
                    if (userLocationInput) userLocationInput.value = '';
                    // Reset target display
                    if (overallTargetStatusDisplay) {
                        overallTargetStatusDisplay.textContent = 'Not Calculated';
                        overallTargetStatusDisplay.className = 'target-status-display status-not-calculated';
                    }
                     if (calculatedOverallTargetInput) calculatedOverallTargetInput.value = 'NO'; // Reset hidden input

                    // Reset shift button
                    if (selectedShiftInput) selectedShiftInput.value = 'Morning';
                    morningShiftBtn?.classList.add('active');
                    eveningShiftBtn?.classList.remove('active');

                    if (staffUsernameInput && currentUser) { // Re-fill username after reset
                         try {
                            const userDocRef = doc(db, "users", currentUser.uid);
                            const userDocSnap = await getDoc(userDocRef);
                            staffUsernameInput.value = userDocSnap.exists() ? (userDocSnap.data().name || currentUser.email?.split('@')[0] || 'User') : (currentUser.email?.split('@')[0] || 'User');
                         } catch (err) { console.warn("Could not refetch username on reset:", err); staffUsernameInput.value = username; }
                    }
                    requestAutoLocation(); // Request location again for the next report
                    updateOverallTargetStatus(); // Update target status after reset

                } catch (error) { // Catch errors (from Firestore, Sheets, or Telegram)
                    console.error("----- REPORT SUBMIT ERROR -----");
                    console.error("Error Code:", error.code);
                    console.error("Error Message:", error.message);
                    console.error("Full Error Object:", error);
                    console.error("-----------------------------");

                    let message = `Submit Error: ${error.message}`;
                    if (error.code === 'permission-denied') {
                        message = 'Database Permission Denied. Cannot save report. Please check Firestore rules.';
                    } else if (!firestoreSuccess) {
                        message = `CRITICAL: Failed to save report to database: ${error.message}`;
                         if (error.message?.includes('quota')) { message = 'Error: Database quota potentially exceeded.'; }
                    } else if (!telegramSuccess) {
                         const telegramErrMsg = `Report saved to DB, but failed to send Telegram notification. Error: ${error.message || 'Unknown Telegram Error'}`;
                         alert(telegramErrMsg); // Alert non-critical failure
                         console.error("Telegram Specific Error:", error);
                         message = `Report saved, but Telegram failed. Check console.`; // Update main error display
                    } else if (!sheetsSuccess) {
                        const sheetsErrMsg = `Report saved & sent to Telegram, but failed to send to Google Sheets. Error: ${error.message || 'Unknown Sheets Error'}`;
                        alert(sheetsErrMsg); // Alert non-critical failure
                        console.error("Google Sheets Specific Error:", error);
                        message = `Report sent, but Sheets failed. Check console.`; // Update main error display
                    } else {
                        console.warn("Unexpected error state in submission catch block.", error);
                        message = `An unexpected error occurred during submission: ${error.message}`;
                    }

                    if (message) { displayError('submitReportError', message); }

                } finally {
                    // Always re-enable the button
                    submitReportBtn.disabled = false;
                    submitReportBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Daily Report';
                }
            }); // End of submit event listener
            // ======================================================== //
            // ===== END: Staff Report Form Submission Logic ===== //
            // ======================================================== //

        } // End of salesReportForm check
    } // End of staffContainer check


    // ----- Modal Close Logic (Admin Report Details Modal) -----
    const closeModalBtn = document.querySelector('#reportModal .close-modal'); // Be specific
    if (closeModalBtn) {
        // ... (keep existing close logic)
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('reportModal');
            if (modal) modal.style.display = 'none';
        });
    }
    // Close admin modal on outside click
    window.addEventListener('click', (e) => {
        // ... (keep existing close logic)
        const adminModal = document.getElementById('reportModal');
        if (adminModal && e.target === adminModal) { adminModal.style.display = 'none'; }
    });
    // Close admin modal on Escape key
    window.addEventListener('keydown', (e) => {
        // ... (keep existing close logic)
        const adminModal = document.getElementById('reportModal');
        if (adminModal?.style.display === 'block' && e.key === 'Escape') { adminModal.style.display = 'none'; }
    });
    // Close category modal on Escape key
     window.addEventListener('keydown', (e) => {
         const categoryModal = document.getElementById('categorySelectionModal');
         // Use the hide function if category modal logic is active
         if (categoryModal?.style.display === 'block' && e.key === 'Escape' && typeof hideCategoryModal === 'function') {
             hideCategoryModal();
         }
     });


}); // End DOMContentLoaded