// navbar.js

// Mobile Menu Toggle

(() => {
    const toggleBtn = document.querySelector(".menu-toggle");
    const navLinks = document.getElementById("primary-navigation");

    if (!toggleBtn || !navLinks) return;

    const icon = toggleBtn.querySelector("i");

    const openMenu = () => {
        navLinks.classList.add("active");
        toggleBtn.classList.add("active");
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.setAttribute("aria-label", "Close navigation menu");
        icon.classList.replace("fa-bars", "fa-xmark");
    };

    const closeMenu = () => {
        navLinks.classList.remove("active");
        toggleBtn.classList.remove("active");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "Open navigation menu");
        icon.classList.replace("fa-xmark", "fa-bars");
    };

    toggleBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("active");
        isOpen ? closeMenu() : openMenu();
    });

    // Close the menu when a nav link is tapped
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close when tapping outside the open menu
    document.addEventListener("click", (event) => {
        const isOpen = navLinks.classList.contains("active");
        if (!isOpen) return;

        const clickedInsideMenu = navLinks.contains(event.target);
        const clickedToggle = toggleBtn.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });

    // Close on Escape, and return focus to the toggle button
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navLinks.classList.contains("active")) {
            closeMenu();
            toggleBtn.focus();
        }
    });

    // If the viewport grows back to desktop size, reset the mobile menu
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
            closeMenu();
        }
    });
})();


// TODO: Sticky Navbar on Scroll

// TODO: Hero Scroll Indicator

// TODO: Hero Carousel
