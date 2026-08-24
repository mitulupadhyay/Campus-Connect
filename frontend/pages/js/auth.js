// auth.js

// Password Visibility Toggle
const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

        const input = toggle.previousElementSibling;
        const icon = toggle.querySelector("i");

        if (input.type === "password") {

            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
            toggle.setAttribute("aria-pressed", "true");
            toggle.setAttribute("aria-label", "Hide password");

        } else {

            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
            toggle.setAttribute("aria-pressed", "false");
            toggle.setAttribute("aria-label", "Show password");

        }

    });

});


// Small helpers shared by both the sign in and sign up forms

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, message) {

    const input = document.getElementById(fieldId);
    const errorText = document.getElementById(fieldId + "-error");

    if (input) input.classList.add("input-error");
    if (errorText) errorText.textContent = message;

}

function clearFieldError(fieldId) {

    const input = document.getElementById(fieldId);
    const errorText = document.getElementById(fieldId + "-error");

    if (input) input.classList.remove("input-error");
    if (errorText) errorText.textContent = "";

}


// Password Strength Meter
function getPasswordScore(password) {

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;

}

function updatePasswordStrength(password) {

    const bar = document.getElementById("password-strength-bar");
    const text = document.getElementById("password-strength-text");

    if (!bar || !text) return;

    if (!password) {
        bar.style.width = "0%";
        text.textContent = "";
        return;
    }

    const score = getPasswordScore(password);

    let label = "Weak";
    let widthPercent = "33%";

    if (score >= 4) {
        label = "Strong";
        widthPercent = "100%";
    } else if (score >= 2) {
        label = "Medium";
        widthPercent = "66%";
    }

    bar.style.width = widthPercent;
    bar.className = "password-strength-bar strength-" + label.toLowerCase();
    text.textContent = "Password strength: " + label;

}


// SIGN IN FORM
const signinEmail = document.getElementById("signin-email");
const signinPassword = document.getElementById("signin-password");

if (signinEmail && signinPassword) {

    const signinForm = signinEmail.closest("form");

    signinForm.addEventListener("submit", (event) => {

        event.preventDefault();

        let isValid = true;

        if (!isValidEmail(signinEmail.value.trim())) {
            showFieldError("signin-email", "Enter a valid email address.");
            isValid = false;
        } else {
            clearFieldError("signin-email");
        }

        if (!signinPassword.value) {
            showFieldError("signin-password", "Password is required.");
            isValid = false;
        } else {
            clearFieldError("signin-password");
        }

        if (!isValid) return;

        // No backend yet, so we simulate a successful sign in for the demo
        const selectedRole = signinForm.querySelector('input[name="role"]:checked');

        const user = {
            name: signinEmail.value.split("@")[0],
            email: signinEmail.value.trim(),
            role: selectedRole ? selectedRole.value : "student"
        };

        localStorage.setItem("campusConnectUser", JSON.stringify(user));
        window.location.href = "home.html";

    });

}


// SIGN UP FORM
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById("signup-confirm-password");

if (signupName && signupEmail && signupPassword && signupConfirmPassword) {

    signupPassword.addEventListener("input", () => {
        updatePasswordStrength(signupPassword.value);
    });

    const signupForm = signupName.closest("form");
    const termsCheckbox = document.getElementById("signup-terms");

    signupForm.addEventListener("submit", (event) => {

        event.preventDefault();

        let isValid = true;

        if (!signupName.value.trim()) {
            showFieldError("signup-name", "Full name is required.");
            isValid = false;
        } else {
            clearFieldError("signup-name");
        }

        if (!isValidEmail(signupEmail.value.trim())) {
            showFieldError("signup-email", "Enter a valid email address.");
            isValid = false;
        } else {
            clearFieldError("signup-email");
        }

        if (signupPassword.value.length < 8) {
            showFieldError("signup-password", "Password must be at least 8 characters.");
            isValid = false;
        } else {
            clearFieldError("signup-password");
        }

        if (!signupConfirmPassword.value || signupConfirmPassword.value !== signupPassword.value) {
            showFieldError("signup-confirm-password", "Passwords do not match.");
            isValid = false;
        } else {
            clearFieldError("signup-confirm-password");
        }

        const termsError = document.getElementById("signup-terms-error");

        if (termsCheckbox && !termsCheckbox.checked) {
            if (termsError) termsError.textContent = "You must agree to the Terms & Privacy Policy.";
            isValid = false;
        } else if (termsError) {
            termsError.textContent = "";
        }

        if (!isValid) return;

        // No backend  we simulate a successful sign up for the demo
        
        const selectedRole = signupForm.querySelector('input[name="role"]:checked');

        const user = {
            name: signupName.value.trim(),
            email: signupEmail.value.trim(),
            role: selectedRole ? selectedRole.value : "student"
        };

        localStorage.setItem("campusConnectUser", JSON.stringify(user));
        window.location.href = "home.html";

    });

}