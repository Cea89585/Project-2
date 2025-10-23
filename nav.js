
let totalSilver = 0;
let userId = null;

document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            loadNavSilver();
        } else {
            // If the user is not logged in, redirect them to the auth page,
            // unless they are already on it.
            if (!window.location.href.includes('auth.html')) {
                window.location.href = 'auth.html';
            }
        }
    });
});

function loadNavSilver() {
    if (db && userId) {
        const userRef = db.collection("users").doc(userId);
        userRef.onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                totalSilver = data.totalSilver || 0;
                console.log("Nav silver updated.");
            } else {
                console.log("No player data found for nav silver.");
            }
            updateNavUI();
        });
    }
}

function updateNavUI() {
    const silverDisplay = document.getElementById("nav-silver");
    if (silverDisplay) {
        silverDisplay.textContent = `Silver: ${totalSilver}`;
    }
}
