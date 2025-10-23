
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signupButton = document.getElementById('signupButton');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const authMessage = document.getElementById('authMessage');

    // --- Event Listeners ---
    signupButton.addEventListener('click', handleSignUp);
    loginButton.addEventListener('click', handleLogin);
    logoutButton.addEventListener('click', handleLogout);

    // --- Authentication Handlers ---

    // Handle user sign-up
    function handleSignUp() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Please enter both email and password.", true);
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // Create a user document in Firestore
                db.collection("users").doc(user.uid).set({
                    email: user.email,
                    role: "player", // Assign default role
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    showMessage(`User created successfully! Welcome ${user.email}.`, false);
                    updateAuthState(true);
                })
                .catch((error) => {
                    showMessage(`Error creating user profile: ${error.message}`, true);
                });
            })
            .catch((error) => {
                showMessage(`Error: ${error.message}`, true);
            });
    }

    // Handle user login
    function handleLogin() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Please enter both email and password.", true);
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                showMessage(`Logged in successfully! Welcome back, ${user.email}.`, false);
                updateAuthState(true);
            })
            .catch((error) => {
                showMessage(`Error: ${error.message}`, true);
            });
    }

    // Handle user logout
    function handleLogout() {
        auth.signOut().then(() => {
            showMessage("You have been logged out.", false);
            updateAuthState(false);
        }).catch((error) => {
            showMessage(`Error logging out: ${error.message}`, true);
        });
    }

    // --- UI and State Management ---

    // Display messages to the user
    function showMessage(message, isError = false) {
        authMessage.textContent = message;
        authMessage.style.color = isError ? '#dc3545' : '#28a745'; // Red for error, green for success
    }

    // Update UI based on authentication state
    function updateAuthState(isLoggedIn) {
        if (isLoggedIn) {
            loginButton.classList.add('hidden');
            signupButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
        } else {
            loginButton.classList.remove('hidden');
            signupButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
            emailInput.value = '';
            passwordInput.value = '';
        }
    }

    // Check initial authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            showMessage(`Welcome back, ${user.email}`, false);
            updateAuthState(true);
        } else {
            updateAuthState(false);
        }
    });
});
