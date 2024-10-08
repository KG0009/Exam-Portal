// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHiNT1bNwJIRQA2xpxfHYmSwWi_YWfsAM",
    authDomain: "examnexus-4b46c.firebaseapp.com",
    databaseURL: "https://examnexus-4b46c-default-rtdb.firebaseio.com",
    projectId: "examnexus-4b46c",
    storageBucket: "examnexus-4b46c.appspot.com",
    messagingSenderId: "889907228722",
    appId: "1:889907228722:web:606ee1b0e185a2c15c8c2b",
    measurementId: "G-35EV53YEE5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();  // Initialize Firestore
const googleProvider = new firebase.auth.GoogleAuthProvider();  // Google Auth Provider

// Function to show messages with fade-in/out animation
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type} show`;

    // Hide the message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('hide');
        setTimeout(() => {
            messageDiv.className = 'message';  // Reset the class after fade-out
        }, 1000);
    }, 3000);
}

// Redirect after successful login or registration
function redirectToGoogle() {
    window.location.href = "https://www.google.com";
}

// Toggle between login, register, and reset password forms
document.getElementById('show-register').addEventListener('click', function() {
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('reset-password-section').classList.remove('active');
    document.getElementById('register-section').classList.add('active');
});

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('register-section').classList.remove('active');
    document.getElementById('reset-password-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');
});

document.getElementById('show-login-from-reset').addEventListener('click', function() {
    document.getElementById('reset-password-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');
});

document.getElementById('show-reset-password').addEventListener('click', function() {
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('reset-password-section').classList.add('active');
});

// Register function
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const profession = document.getElementById('register-profession').value;

    if (!name || !email || !password || !profession) {
        showMessage("Please fill in all fields!", "error");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;

            // Save additional user data to Firestore
            return db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                profession: profession
            });
        })
        .then(() => {
            showMessage("User registered successfully!", "success");
            setTimeout(redirectToGoogle, 2000);  // Redirect after 2 seconds
        })
        .catch(error => {
            showMessage(error.message, "error");
        });
});

// Login function
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            showMessage("Logged in successfully!", "success");
            setTimeout(redirectToGoogle, 2000);  // Redirect after 2 seconds
        })
        .catch(error => {
            showMessage(error.message, "error");
        });
});

// Password Reset function
document.getElementById('reset-password-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('reset-password-email').value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            showMessage("Password reset email sent!", "success");
        })
        .catch(error => {
            showMessage(error.message, "error");
        });
});

// Google Sign-In function
document.getElementById('google-signin-btn').addEventListener('click', function() {
    auth.signInWithPopup(googleProvider)
        .then(result => {
            showMessage("Signed in with Google successfully!", "success");
            setTimeout(redirectToGoogle, 2000);  // Redirect after 2 seconds
        })
        .catch(error => {
            showMessage(error.message, "error");
        });
});
