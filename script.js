
let woodCount = 0;
let stoneCount = 0;
let totalSilver = 0;
let userId = null;

// --- Authentication Check ---
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            loadItems();
        } else {
            if (window.location.pathname !== '/auth.html') {
                window.location.href = 'auth.html';
            }
        }
    });
});

// --- Firestore Functions ---
function saveItems() {
    if (db && userId) {
        db.collection("users").doc(userId).set({
            inventory: {
                wood: woodCount,
                stone: stoneCount
            }
        }, { merge: true })
        .then(() => console.log("Inventory saved to Firestore"))
        .catch(error => console.error("Error saving inventory: ", error));
    }
}

function loadItems() {
    if (db && userId) {
        db.collection("users").doc(userId).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.inventory) {
                    woodCount = data.inventory.wood || 0;
                    stoneCount = data.inventory.stone || 0;
                }
                totalSilver = data.totalSilver || 0;
                console.log("Player data loaded from Firestore.");
            } else {
                console.log("No player data found, starting new.");
            }
            updateUI();
        }).catch(error => console.error("Error loading data: ", error));
    }
}

// --- UI Functions ---
function showDiscoveryImage(imageSrc) {
    const itemIconsContainer = document.getElementById('itemIconsContainer');
    itemIconsContainer.style.display = 'flex';

    const itemIcons = document.getElementById('itemIcons');
    itemIcons.style.display = 'flex';
    itemIcons.innerHTML = '';

    const itemIcon = document.createElement('img');
    itemIcon.src = imageSrc;
    itemIcon.alt = 'Discovery Image';
    itemIcon.style.width = '50px';
    itemIcon.style.height = '50px';
    itemIcons.appendChild(itemIcon);
}

function updateUI() {
    updateItemIcon('woodCountRect', woodCount);
    updateItemIcon('stoneCountRect', stoneCount);
    const silverElement = document.getElementById("nav-silver");
    if (silverElement) {
        silverElement.textContent = "Silver: " + totalSilver;
    }
}

function displayMessage(message) {
    document.getElementById("message").textContent = message;
}

function updateItemIcon(countId, count) {
    const itemCountDisplay = document.getElementById(countId);
    if (itemCountDisplay) {
        itemCountDisplay.textContent = count;
    }
}

// --- Game Logic ---
function goExploring() {
    const random = Math.random();

    if (random <= 0.4) {
        let message = "Congratulations, you have discovered a ";
        if (random < 0.3) {
            message += "Wood";
            woodCount++;
            showDiscoveryImage('Assets/Wood.png');
        } else {
            message += "Stone";
            stoneCount++;
            showDiscoveryImage('Assets/Stone.png');
        }
        displayMessage(message);
        saveItems();
    } else {
        displayMessage("You explored the area but found nothing.");
        showDiscoveryImage('Assets/no_item.png');
    }
    updateUI();
}

// --- Event Listeners ---
const exploreBtn = document.getElementById("exploreButton");
if (exploreBtn) {
    exploreBtn.addEventListener("click", goExploring);
}
