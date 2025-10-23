
let woodCount = 0;
let stoneCount = 0;
let totalSilver = 0; // Keep track of silver locally for now.

document.addEventListener("DOMContentLoaded", () => {
    // No auth check for now.
    updateUI();
});

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
        // saveItems(); // Removed Firebase call
    } else {
        displayMessage("You explored the area but found nothing.");
        showDiscoveryImage('Assets/no_item.png');
    }
    updateUI();
}

const exploreBtn = document.getElementById("exploreButton");
if (exploreBtn) {
    exploreBtn.addEventListener("click", goExploring);
}
