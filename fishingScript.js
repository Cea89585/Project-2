
let yellowPerchCount = 0;
let troutCount = 0;
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
function loadItems() {
    if (db && userId) {
        db.collection("users").doc(userId).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.inventory) {
                    yellowPerchCount = data.inventory.yellowPerch || 0;
                    troutCount = data.inventory.trout || 0;
                }
                console.log("Player data updated.");
            } else {
                console.log("No player data found, starting new.");
            }
            updateUI();
        });
    }
}

// --- UI Functions ---
function updateUI() {
    document.getElementById("yellowPerchCount").textContent = yellowPerchCount;
    document.getElementById("troutCount").textContent = troutCount;
}

function showFishImage(imageSrc) {
    const fishIconsContainer = document.getElementById('fishIcons');
    fishIconsContainer.style.display = 'flex';
    fishIconsContainer.innerHTML = ''; // Clear previous fish icons

    const fishIcon = document.createElement('img');
    fishIcon.src = imageSrc;
    fishIcon.alt = 'Caught Fish';
    fishIcon.style.width = '50px';
    fishIcon.style.height = '50px';
    fishIconsContainer.appendChild(fishIcon);
}

function displayMessage(message) {
    document.getElementById("message").textContent = message;
}

// --- Game Logic ---
function catchFish() {
    const random = Math.random();
    let message = "Congratulations, you have caught a ";

    if (random < 0.6) { // 60% chance to catch a fish
        let itemCaught = null;
        if (random < 0.4) { // 40% chance for Yellow Perch
            message += "Yellow Perch";
            itemCaught = "yellowPerch";
            showFishImage('Assets/yellow_perch.png');
        } else { // 20% chance for Trout
            message += "Trout";
            itemCaught = "trout";
            showFishImage('Assets/trout.png');
        }
        displayMessage(message);

        if (itemCaught && db && userId) {
            db.collection("users").doc(userId).update({
                [`inventory.${itemCaught}`]: firebase.firestore.FieldValue.increment(1)
            });
        }
    } else {
        displayMessage("You fished for a while but didn't catch anything.");
        showFishImage('Assets/no_item.png');
    }
}

function sellYellowPerch() {
    if (yellowPerchCount > 0) {
        db.collection("users").doc(userId).update({
            "inventory.yellowPerch": firebase.firestore.FieldValue.increment(-1),
            "totalSilver": firebase.firestore.FieldValue.increment(10)
        });
        alert("You sold 1 yellow perch for 10 silver.");
    } else {
        alert("You have no yellow perch to sell.");
    }
}

function sellTrout() {
    if (troutCount > 0) {
        db.collection("users").doc(userId).update({
            "inventory.trout": firebase.firestore.FieldValue.increment(-1),
            "totalSilver": firebase.firestore.FieldValue.increment(25)
        });
        alert("You sold 1 trout for 25 silver.");
    } else {
        alert("You have no trout to sell.");
    }
}


// --- Event Listeners ---
const catchFishBtn = document.getElementById("catchFishButton");
if (catchFishBtn) {
    catchFishBtn.addEventListener("click", catchFish);
}

const sellYellowPerchBtn = document.getElementById("sellYellowPerchBtn");
if (sellYellowPerchBtn) {
    sellYellowPerchBtn.addEventListener("click", sellYellowPerch);
}

const sellTroutBtn = document.getElementById("sellTroutBtn");
if (sellTroutBtn) {
    sellTroutBtn.addEventListener("click", sellTrout);
}
