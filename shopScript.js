
document.addEventListener("DOMContentLoaded", () => {
    const inventoryItemsContainer = document.getElementById("inventoryItems");
    const sellAllButton = document.getElementById("sellAllButton");

    let items = [
        { name: "Wood", count: 0, price: 5, locked: false },
        { name: "Stone", count: 0, price: 2, locked: false },
        { name: "Yellow Perch", count: 0, price: 10, locked: false },
        { name: "Trout", count: 0, price: 15, locked: false }
    ];

    function loadInventory() {
        items.forEach(item => {
            const itemCount = parseInt(localStorage.getItem(`${item.name.toLowerCase()}Count`)) || 0;
            item.count = itemCount;
        });
        renderInventory();
    }

    function renderInventory() {
        inventoryItemsContainer.innerHTML = "";
        items.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("inventory-item");
            if (item.locked) {
                itemDiv.classList.add("locked");
            }

            const itemName = document.createElement("span");
            itemName.textContent = `${item.name}: ${item.count}`;

            const lockButton = document.createElement("button");
            lockButton.textContent = item.locked ? "Unlock" : "Lock";
            lockButton.addEventListener("click", () => toggleLock(index));

            itemDiv.appendChild(itemName);
            itemDiv.appendChild(lockButton);
            inventoryItemsContainer.appendChild(itemDiv);
        });
    }

    function toggleLock(index) {
        items[index].locked = !items[index].locked;
        renderInventory();
    }

    function sellAllUnlockedItems() {
        let totalSilver = parseInt(localStorage.getItem("totalSilver")) || 0;
        let silverEarned = 0;

        items.forEach(item => {
            if (!item.locked) {
                silverEarned += item.count * item.price;
                localStorage.setItem(`${item.name.toLowerCase()}Count`, 0);
                item.count = 0;
            }
        });

        totalSilver += silverEarned;
        localStorage.setItem("totalSilver", totalSilver);
        renderInventory();
    }

    sellAllButton.addEventListener("click", sellAllUnlockedItems);

    loadInventory();
});
