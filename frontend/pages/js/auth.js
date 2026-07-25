// PASSWORD VISIBILITY TOGGLE
const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        const targetInput = document.getElementById(toggle.dataset.target);
        if (!targetInput) return;

        const isHidden = targetInput.type === "password";
        targetInput.type = isHidden ? "text" : "password";

        toggle.classList.toggle("fa-eye", !isHidden);
        toggle.classList.toggle("fa-eye-slash", isHidden);
    });
});

// FORM SUBMIT (UI ONLY — ready for backend integration)
const signinForm = document.getElementById("signin-form");
const signupForm = document.getElementById("signup-form");

if (signinForm) {
    signinForm.addEventListener("submit", e => {
        e.preventDefault();
        // TODO: connect to authentication backend
    });
}

if (signupForm) {
    signupForm.addEventListener("submit", e => {
        e.preventDefault();

        const password = document.getElementById("signup-password");
        const confirmPassword = document.getElementById("signup-confirm-password");

        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
            confirmPassword.reportValidity();
            return;
        }

        confirmPassword.setCustomValidity("");
        // TODO: connect to authentication backend
    });

    const confirmPassword = document.getElementById("signup-confirm-password");
    confirmPassword.addEventListener("input", () => {
        confirmPassword.setCustomValidity("");
    });
}
