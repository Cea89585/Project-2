
let yellowPerchCount = 0;
let troutCount = 0;
let totalSilver = 0; // Keep track of silver locally for now.

document.addEventListener("DOMContentLoaded", () => {
    // No auth check for now.
    updateUI();
});

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
    } else {
        displayMessage("You fished for a while but didn't catch anything.");
        showFishImage('Assets/no_item.png');
    }
    updateUI();
}

function sellYellowPerch() {
    if (yellowPerchCount > 0) {
        yellowPerchCount--;
        totalSilver += 10;
        alert("You sold 1 yellow perch for 10 silver.");
        updateUI();
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
    } else {
        alert("You have no trout to sell.");
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
