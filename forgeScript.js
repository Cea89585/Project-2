
let woodCount = 0;
let stoneCount = 0;
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
        db.collection("users").doc(userId).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.inventory) {
                    woodCount = data.inventory.wood || 0;
                    stoneCount = data.inventory.stone || 0;
                    pickaxeCount = data.inventory.pickaxe || 0;
                }
                console.log("Player data updated.");
            } else {
                console.log("No player data found, starting new.");
            }
            updateUI();
        });
    }
}

function saveInventory() {
    if (db && userId) {
        db.collection("users").doc(userId).set({
            inventory: {
                wood: woodCount,
                stone: stoneCount,
                pickaxe: pickaxeCount
            }
        }, { merge: true })
        .then(() => console.log("Inventory saved to Firestore"))
        .catch(error => console.error("Error saving data: ", error));
    }
}

// --- UI Functions ---
function updateUI() {
    document.getElementById("woodAmount").textContent = woodCount;
    document.getElementById("stoneAmount").textContent = stoneCount;
    document.getElementById("pickaxeAmount").textContent = pickaxeCount;
}

// --- Game Logic ---
function forgePickaxe() {
    const requiredWood = 10;
    const requiredStone = 15;

    if (woodCount >= requiredWood && stoneCount >= requiredStone) {
        woodCount -= requiredWood;
        stoneCount -= requiredStone;
        pickaxeCount++;

        saveInventory();
        alert("You have successfully forged a pickaxe!");
    } else {
        alert("You do not have enough resources to forge a pickaxe. Collect more wood and stone.");
    }
}

function sellWood() {
    if (woodCount > 0) {
        db.collection("users").doc(userId).update({
            "inventory.wood": firebase.firestore.FieldValue.increment(-1),
            "totalSilver": firebase.firestore.FieldValue.increment(5)
        });
        alert("You sold 1 wood for 5 silver.");
    } else {
        alert("You have no wood to sell.");
    }
}

function sellStone() {
    if (stoneCount > 0) {
        db.collection("users").doc(userId).update({
            "inventory.stone": firebase.firestore.FieldValue.increment(-1),
            "totalSilver": firebase.firestore.FieldValue.increment(2)
        });
        alert("You sold 1 stone for 2 silver.");
    } else {
        alert("You have no stone to sell.");
    }
}


// --- Event Listeners ---
const forgeBtn = document.querySelector("#forge-button button");
if (forgeBtn) {
    forgeBtn.addEventListener("click", forgePickaxe);
}

const sellWoodBtn = document.getElementById("sellWoodBtn");
if (sellWoodBtn) {
    sellWoodBtn.addEventListener("click", sellWood);
}

const sellStoneBtn = document.getElementById("sellStoneBtn");
if (sellStoneBtn) {
    sellStoneBtn.addEventListener("click", sellStone);
}
