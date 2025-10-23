
let yellowPerchCount = 0;
let troutCount = 0;
let userId = null; // Will be set on authentication

// --- Authentication Check ---
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            userId = user.uid;
            loadItems(); // Load user's inventory
        } else {
            // No user is signed in.
            // Redirect to the login page if not already on it
            if (window.location.pathname !== '/auth.html') {
                window.location.href = 'auth.html';
            }
        }
    });
});

// --- Firestore Functions ---

// Function to save items to Firestore
function saveItems() {
    if (db && userId) {
        db.collection("users").doc(userId).set({
            inventory: {
                yellowPerch: yellowPerchCount,
                trout: troutCount
            }
        }, { merge: true })
        .then(() => {
            console.log("Inventory saved to Firestore for user: ", userId);
        })
        .catch((error) => {
            console.error("Error writing document to Firestore: ", error);
        });
    }
}

// Function to load items from Firestore
function loadItems() {
    if (db && userId) {
        db.collection("users").doc(userId).get().then((doc) => {
            if (doc.exists && doc.data().inventory) {
                const inventory = doc.data().inventory;
                yellowPerchCount = inventory.yellowPerch || 0;
                troutCount = inventory.trout || 0;
                console.log("Inventory loaded from Firestore for user: ", userId);
            } else {
                console.log("No inventory found in Firestore for this user, starting new.");
                yellowPerchCount = 0;
                troutCount = 0;
            }
            updateUI(); // Update UI after loading data
        }).catch((error) => {
            console.error("Error getting document from Firestore:", error);
        });
    }
}


// --- UI Functions ---

// Function to display a discovery image
function showDiscoveryImage(imageSrc) {
    let itemIconsContainer = document.getElementById('itemIconsContainer');
    itemIconsContainer.style.display = 'flex';

    let itemIcons = document.getElementById('fishIcons');
    itemIcons.style.display = 'flex';
    itemIcons.innerHTML = ''; // Clear previous icon

    let itemIcon = document.createElement('img');
    itemIcon.src = imageSrc;
    itemIcon.alt = 'Discovery Image';
    itemIcon.style.width = '50px';
    itemIcon.style.height = '50px';
    itemIcons.appendChild(itemIcon);
}

// Function to update the UI
function updateUI() {
    updateItemIcon('yellowPerchCount', yellowPerchCount);
    updateItemIcon('troutCount', troutCount);
}

// Function to display a message to the user
function displayMessage(message) {
    document.getElementById("message").textContent = message;
}

// Function to update the count of a specific item icon
function updateItemIcon(countId, count) {
    let itemCountDisplay = document.getElementById(countId);
    if (itemCountDisplay) {
        itemCountDisplay.textContent = count;
    }
}

// --- Game Logic ---

// Function to handle the fishing action
function goFishing() {
    let random = Math.random();

    if (random <= 0.5) {
        let message = "Congratulations, you have caught a ";
        if (random < 0.25) {
            message += "Yellow Perch";
            yellowPerchCount++;
            showDiscoveryImage('Assets/yellow_perch.png');
        } else {
            message += "Trout";
            troutCount++;
            showDiscoveryImage('Assets/trout.png');
        }
        displayMessage(message);
        saveItems(); // Save the new inventory to Firestore
    } else {
        displayMessage("You have fished in this area but found nothing.");
        showDiscoveryImage('Assets/no_item.png');
    }

    updateUI();
}

// --- Event Listeners ---

// Add event listener for the catch fish button
const catchFishBtn = document.getElementById("catchFishButton");
if (catchFishBtn) {
    catchFishBtn.addEventListener("click", goFishing);
}
