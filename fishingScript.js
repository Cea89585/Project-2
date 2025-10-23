
// Define variables
let fishCount = 0;
let yellowPerchCount = 0;
let troutCount = 0;

// Function to display a discovery image
function showDiscoveryImage(imageSrc) {
    let itemIconsContainer = document.getElementById('itemIconsContainer');
    itemIconsContainer.style.display = 'flex';

    let itemIcons = document.getElementById('fishIcons');
    itemIcons.style.display = 'flex';

    // Clear previous item icons
    itemIcons.innerHTML = '';

    let itemIcon = document.createElement('img');
    itemIcon.src = imageSrc;
    itemIcon.alt = 'Discovery Image';
    itemIcon.style.width = '50px';
    itemIcon.style.height = '50px';
    itemIcons.appendChild(itemIcon);
}

// Function to update the UI
function updateUI() {
    document.getElementById("fishCount").textContent = "Discoveries: " + fishCount;
    updateItemIcon('yellowPerchCount', yellowPerchCount);
    updateItemIcon('troutCount', troutCount);
}

// Function to display a message
function displayMessage(message) {
    document.getElementById("message").textContent = message;
}

// Function to update the count of a specific item
function updateItemIcon(countId, count) {
    let itemCountDisplay = document.getElementById(countId);
    if (itemCountDisplay) {
        itemCountDisplay.textContent = count;
    }
}

// Function to handle fishing
function goFishing() {
    let random = Math.random();

    if (random <= 0.5) {
        fishCount++;
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
        saveItems();
    } else {
        displayMessage("You have fished in this area but found nothing.");
        showDiscoveryImage('Assets/no_item.png');
    }

    updateUI();
}

// Function to sell all fish
function sellFish() {
    let yellowPerchPrice = 2; 
    let troutPrice = 4; 

    let silverEarned = (yellowPerchCount * yellowPerchPrice) + (troutCount * troutPrice);

    if (silverEarned > 0) {
        let totalSilver = parseInt(localStorage.getItem("totalSilver")) || 0;
        totalSilver += silverEarned;
        localStorage.setItem("totalSilver", totalSilver);

        yellowPerchCount = 0;
        troutCount = 0;
        fishCount = 0;
        
        saveItems();
        updateUI();
        displayMessage(`You sold all your fish for ${silverEarned} silver!`);
    } else {
        displayMessage("You have no fish to sell.");
    }
}


// Function to save items to local/session storage
function saveItems() {
    sessionStorage.setItem("fishCount", fishCount);
    localStorage.setItem("yellowPerchCount", yellowPerchCount);
    localStorage.setItem("troutCount", troutCount);
}

// Function to load items from local/session storage
function loadItems() {
    let isFirstTime = sessionStorage.getItem("fishFirstTime") === null;

    if (isFirstTime) {
        fishCount = 0;
        sessionStorage.setItem("fishCount", fishCount);
        sessionStorage.setItem("fishFirstTime", "false");
    } else {
        fishCount = parseInt(sessionStorage.getItem("fishCount")) || 0;
    }

    yellowPerchCount = parseInt(localStorage.getItem("yellowPerchCount")) || 0;
    troutCount = parseInt(localStorage.getItem("troutCount")) || 0;
    updateUI();
}

// Function to clear fishing data
function clearFishingData() {
    fishCount = 0;
    yellowPerchCount = 0;
    troutCount = 0;
    sessionStorage.removeItem("fishCount");
    sessionStorage.removeItem("fishFirstTime");
    localStorage.removeItem("yellowPerchCount");
    localStorage.removeItem("troutCount");
    updateUI();
}

// Add event listeners
const catchFishBtn = document.getElementById("catchFishButton");
if (catchFishBtn) {
    catchFishBtn.addEventListener("click", goFishing);
}

const sellFishBtn = document.getElementById("sellFishButton");
if (sellFishBtn) {
    sellFishBtn.addEventListener("click", sellFish);
}


// Load items when the document is ready
document.addEventListener("DOMContentLoaded", loadItems);
