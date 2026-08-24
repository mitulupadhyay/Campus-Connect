// navbar.js


// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("primary-navigation");

if (menuToggle && navLinks) {

    // hamburger icon
    const menuIcon = menuToggle.querySelector("i");


    // Open / close menu
    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");

        // Change hamburger to X
        if (navLinks.classList.contains("active")) {

            menuIcon.classList.replace("fa-bars", "fa-xmark");

        } else {

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        }

    });


    // Close menu when navigation link is clicked
    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        });

    });


    // Close menu when clicking outside
    document.addEventListener("click", (event) => {

        const clickedInsideMenu = navLinks.contains(event.target);
        const clickedMenuButton = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {

            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        }

    });


    // Close menu with Escape
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        }

    });


    // Close menu when switching to desktop
    window.addEventListener("resize", () => {

        if (window.innerWidth > 1023) {

            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        }

    });

}


// Sticky Navbar on Scroll
const siteNavbar = document.querySelector(".navbar");

if (siteNavbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 20) {
            siteNavbar.classList.add("scrolled");
        } else {
            siteNavbar.classList.remove("scrolled");
        }

    });

}


// Hero Scroll Indicator
const scrollIndicator = document.querySelector(".scroll-indicator");

if (scrollIndicator) {

    scrollIndicator.addEventListener("click", () => {

        // Scroll down to whatever section comes right after the hero
        const heroSection = scrollIndicator.closest("section");
        const nextSection = heroSection ? heroSection.nextElementSibling : null;

        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }

    });

}


// Hero Carousel
const heroCarousel = document.querySelector(".hero-carousel");

if (heroCarousel) {

    const slides = heroCarousel.querySelectorAll(".carousel-slide");
    const dots = heroCarousel.querySelectorAll(".carousel-dot");
    const prevArrow = heroCarousel.querySelector(".carousel-arrow-prev");
    const nextArrow = heroCarousel.querySelector(".carousel-arrow-next");

    let currentSlide = 0;
    let autoPlayTimer = null;

    function goToSlide(index) {

        // Wrap the index around so it loops both ways
        const newIndex = (index + slides.length) % slides.length;

        slides[currentSlide].classList.remove("active");
        if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

        currentSlide = newIndex;

        slides[currentSlide].classList.add("active");
        if (dots[currentSlide]) dots[currentSlide].classList.add("active");

    }

    function startAutoPlay() {

        autoPlayTimer = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);

    }

    function restartAutoPlay() {

        clearInterval(autoPlayTimer);
        startAutoPlay();

    }

    if (nextArrow) {

        nextArrow.addEventListener("click", () => {
            goToSlide(currentSlide + 1);
            restartAutoPlay();
        });

    }

    if (prevArrow) {

        prevArrow.addEventListener("click", () => {
            goToSlide(currentSlide - 1);
            restartAutoPlay();
        });

    }

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {
            goToSlide(index);
            restartAutoPlay();
        });

    });

    // Pause auto play while the user is hovering over the carousel
    heroCarousel.addEventListener("mouseenter", () => clearInterval(autoPlayTimer));
    heroCarousel.addEventListener("mouseleave", startAutoPlay);

    if (slides.length > 1) {
        startAutoPlay();
    }

}


// Show a signed-in state in the navbar demo
const loggedInUser = JSON.parse(localStorage.getItem("campusConnectUser") || "null");

if (loggedInUser) {

    const authAreas = document.querySelectorAll(".auth-btn, .mobile-auth");

    // take the first letter of the user's name to put inside the avatar circle
    const firstLetter = loggedInUser.name.charAt(0).toUpperCase();

    authAreas.forEach((area) => {

        area.innerHTML = "";

        // Wraps the avatar circle and the greeting text
        const userInfo = document.createElement("div");
        userInfo.className = "nav-user-info";
        userInfo.style.display = "flex";
        userInfo.style.alignItems = "center";
        userInfo.style.gap = "10px";



        const avatar = document.createElement("span");
        avatar.className = "nav-avatar";
        avatar.textContent = firstLetter;
        avatar.style.display = "flex";
        avatar.style.alignItems = "center";
        avatar.style.justifyContent = "center";
        avatar.style.flexShrink = "0";
        avatar.style.width = "36px";
        avatar.style.height = "36px";
        avatar.style.borderRadius = "50%";
        avatar.style.backgroundColor = "#FF2600";
        avatar.style.color = "#ffffff";
        avatar.style.fontSize = "14px";
        avatar.style.fontWeight = "700";
        avatar.style.textTransform = "uppercase";

        const greeting = document.createElement("span");
        greeting.className = "nav-greeting";
        greeting.textContent = "Hi, " + loggedInUser.name;
        greeting.style.color = "#ffffff";
        greeting.style.fontSize = "14px";
        greeting.style.fontWeight = "600";
        greeting.style.whiteSpace = "nowrap";

        userInfo.appendChild(avatar);
        userInfo.appendChild(greeting);

        const signOutBtn = document.createElement("button");
        signOutBtn.type = "button";
        signOutBtn.className = "btn-secondary";
        signOutBtn.textContent = "Sign Out";

        signOutBtn.addEventListener("click", () => {
            localStorage.removeItem("campusConnectUser");
            window.location.href = "home.html";
        });

        area.appendChild(userInfo);
        area.appendChild(signOutBtn);

    });

}