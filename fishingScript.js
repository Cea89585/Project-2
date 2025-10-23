
let yellowPerchCount = 0;
let troutCount = 0;
let totalSilver = 0;

document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            loadUserSilver(user.uid);
            loadFish(user.uid);
        } else {
            updateUI();
        }
    });
});

function loadUserSilver(uid) {
    const userRef = db.collection('users').doc(uid);
    userRef.get().then(doc => {
        if (doc.exists) {
            totalSilver = doc.data().silver || 0;
            updateUI();
        }
    });
}

function loadFish(uid) {
    const userRef = db.collection('users').doc(uid);
    userRef.get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            yellowPerchCount = data.yellowPerchCount || 0;
            troutCount = data.troutCount || 0;
            updateUI();
        }
    });
}

function updateUI() {
    document.getElementById("yellowPerchCount").textContent = yellowPerchCount;
    document.getElementById("troutCount").textContent = troutCount;
    const silverElement = document.getElementById("nav-silver");
    if (silverElement) {
        silverElement.textContent = "Silver: " + totalSilver;
    }
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

function catchFish() {
    const random = Math.random();
    let message = "Congratulations, you have caught a ";

    if (random < 0.6) { // 60% chance to catch a fish
        if (random < 0.4) { // 40% chance for Yellow Perch
            message += "Yellow Perch";
            yellowPerchCount++;
            showFishImage('Assets/yellow_perch.png');
        } else { // 20% chance for Trout
            message += "Trout";
            troutCount++;
            showFishImage('Assets/trout.png');
        }
        displayMessage(message);
        saveFish();
    } else {
        displayMessage("You fished for a while but didn't catch anything.");
        showFishImage('Assets/no_item.png');
    }
    updateUI();
}

function saveFish() {
    const user = auth.currentUser;
    if (user) {
        const userRef = db.collection('users').doc(user.uid);
        userRef.set({
            yellowPerchCount: yellowPerchCount,
            troutCount: troutCount
        }, { merge: true });
    }
}

function sellYellowPerch() {
    if (yellowPerchCount > 0) {
        yellowPerchCount--;
        totalSilver += 10;
        alert("You sold 1 yellow perch for 10 silver.");
        updateUI();
        saveFish();
        saveSilver();
    } else {
        alert("You have no yellow perch to sell.");
    }
}

function sellTrout() {
    if (troutCount > 0) {
        troutCount--;
        totalSilver += 25;
        alert("You sold 1 trout for 25 silver.");
        updateUI();
        saveFish();
        saveSilver();
    } else {
        alert("You have no trout to sell.");
    }
}

function saveSilver() {
    const user = auth.currentUser;
    if (user) {
        const userRef = db.collection('users').doc(user.uid);
        userRef.set({
            silver: totalSilver
        }, { merge: true });
    }
}

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
