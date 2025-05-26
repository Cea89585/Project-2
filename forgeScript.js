// Get references to the wood and stone counts
let woodCount = parseInt(localStorage.getItem("woodCount")) || 0;
let stoneCount = parseInt(localStorage.getItem("stoneCount")) || 0;

// Function to handle forging process
function forgePickaxe() {
    const requiredWood = 10;
    const requiredStone = 15;

    // Check if there is enough wood and stone
    if (woodCount >= requiredWood && stoneCount >= requiredStone) {
        // Subtract required wood and stone
        woodCount -= requiredWood;
        stoneCount -= requiredStone;

        // Update localStorage with new wood and stone counts
        localStorage.setItem("woodCount", woodCount);
        localStorage.setItem("stoneCount", stoneCount);

        // Add or update pickaxe in inventory (this is just an example)
        // You might want to store inventory items differently
        let pickaxeCount = parseInt(localStorage.getItem("pickaxeCount")) || 0;
        pickaxeCount++;
        localStorage.setItem("pickaxeCount", pickaxeCount);

        // Update UI with new wood and stone counts
        document.getElementById("woodAmount").textContent = woodCount;
        document.getElementById("stoneAmount").textContent = stoneCount;

        // Display success message to user
        alert("You have successfully forged a pickaxe!");
    } else {
        // Display error message to user if there are not enough resources
        alert("You do not have enough resources to forge a pickaxe. Collect more wood and stone.");
    }
}

// Add click event listener to Forge button
const forgeBtn = document.querySelector("#forge-button button");
if (forgeBtn) {
    forgeBtn.addEventListener("click", forgePickaxe);
}
