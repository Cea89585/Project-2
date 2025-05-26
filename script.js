// Define variables
let itemCount = 0;
let woodCount = 0;
let stoneCount = 0;

// Function to display a discovery image
function showDiscoveryImage(imageSrc) {
    let itemIconsContainer = document.getElementById('itemIconsContainer');
    itemIconsContainer.style.display = 'flex';

    let itemIcons = document.getElementById('itemIcons');
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
    document.getElementById("itemCount").textContent = "Discoveries: " + itemCount;
    updateItemIcon('woodCountRect', woodCount);
    updateItemIcon('stoneCountRect', stoneCount);
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

// Function to handle exploring
function goExploring() {
    let random = Math.random();

    if (random <= 0.4) {
        itemCount++;
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

// Function to save items to local/session storage
function saveItems() {
    sessionStorage.setItem("itemCount", itemCount);
    localStorage.setItem("woodCount", woodCount);
    localStorage.setItem("stoneCount", stoneCount);
}

// Function to load items from local/session storage
function loadItems() {
    let isFirstTime = sessionStorage.getItem("isFirstTime") === null;

    if (isFirstTime) {
        itemCount = 0;
        sessionStorage.setItem("itemCount", itemCount);
        sessionStorage.setItem("isFirstTime", "false");
    } else {
        itemCount = parseInt(sessionStorage.getItem("itemCount")) || 0;
    }

    woodCount = parseInt(localStorage.getItem("woodCount")) || 0;
    stoneCount = parseInt(localStorage.getItem("stoneCount")) || 0;
    updateUI();
}

// Function to clear exploration data
function clearExplorationData() {
    itemCount = 0;
    sessionStorage.removeItem("itemCount");
    sessionStorage.removeItem("isFirstTime");
    updateUI();
}

// Add event listeners
const exploreBtn = document.getElementById("exploreButton");
if (exploreBtn) {
    exploreBtn.addEventListener("click", goExploring);
}

// Load items when the document is ready
document.addEventListener("DOMContentLoaded", loadItems);
