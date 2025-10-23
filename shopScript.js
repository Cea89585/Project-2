
let totalSilver = 0;
let pickaxeCount = 0;
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
        db.collection("users").doc(userId).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.inventory) {
                    pickaxeCount = data.inventory.pickaxe || 0;
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

function saveItems() {
    if (db && userId) {
        db.collection("users").doc(userId).set({
            inventory: {
                pickaxe: pickaxeCount
            },
            totalSilver: totalSilver
        }, { merge: true })
        .then(() => console.log("Inventory and silver saved to Firestore"))
        .catch(error => console.error("Error saving data: ", error));
    }
}

// --- UI Functions ---
function updateUI() {
    document.getElementById("silverEarned").textContent = totalSilver;
}

// --- Game Logic ---
function buyPickaxe() {
    const pickaxeCost = 100;

    if (totalSilver >= pickaxeCost) {
        totalSilver -= pickaxeCost;
        pickaxeCount++;

        saveItems();
        updateUI();

        alert("You have successfully purchased a pickaxe!");
    } else {
        alert("You do not have enough silver to purchase a pickaxe.");
    }
}

// --- Event Listeners ---
const buyPickaxeBtn = document.getElementById("buyPickaxeBtn");
if (buyPickaxeBtn) {
    buyPickaxeBtn.addEventListener("click", buyPickaxe);
}
