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


// Mock notifications stored in localStorage for signed-in users

function getNotifications() {
    return JSON.parse(localStorage.getItem("campusConnectNotifications") || "[]");
}

function saveNotifications(notifs) {
    localStorage.setItem("campusConnectNotifications", JSON.stringify(notifs));
}

function addNotification(message) {

    const notifs = getNotifications();

    notifs.push({
        id: Date.now() + "-" + Math.floor(Math.random() * 1000),
        message: message,
        read: false
    });

    saveNotifications(notifs);

}

// Give the demo a few starting notifications the very first time anyone visits
if (getNotifications().length === 0) {
    addNotification("Welcome to CampusConnect!");
    addNotification("CodeStorm Hackathon registration is now open!");
    addNotification("AI Workshop starts tomorrow at 10 AM!");
}

// Keep all notification badges in sync
function updateAllNotificationBadges() {

    const unreadCount = getNotifications().filter((notif) => !notif.read).length;
    const badges = document.querySelectorAll(".notification-badge");

    badges.forEach((badge) => {

        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = "flex";
        } else {
            badge.style.display = "none";
        }

    });

}

function markAllNotificationsRead() {

    const notifs = getNotifications();
    notifs.forEach((notif) => {
        notif.read = true;
    });

    saveNotifications(notifs);
    updateAllNotificationBadges();

}

// Fills one dropdown's list with the current notifications, newest first
function renderNotificationList(listEl) {

    const notifs = getNotifications();
    listEl.innerHTML = "";

    if (notifs.length === 0) {

        const empty = document.createElement("p");
        empty.textContent = "No notifications yet";
        empty.style.cssText = "padding:24px 20px;text-align:center;color:#64748B;font-size:13px;";
        listEl.appendChild(empty);

        return;

    }

    notifs.slice().reverse().forEach((notif) => {

        const item = document.createElement("div");
        item.textContent = notif.message;
        item.style.cssText =
            "padding:12px 20px;font-size:13px;color:#1E293B;border-bottom:1px solid #E2E8F0;" +
            (notif.read ? "" : "background-color:#FFF3F2;font-weight:600;");

        listEl.appendChild(item);

    });

}

// Build the notification bell, badge, and dropdown
function buildNotificationBell() {

    const container = document.createElement("div");
    container.className = "nav-notification";
    container.style.cssText = "position:relative;display:inline-flex;align-items:center;";

    const bellBtn = document.createElement("button");
    bellBtn.type = "button";
    bellBtn.setAttribute("aria-label", "Notifications");
    bellBtn.style.cssText =
        "position:relative;background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;padding:8px;border-radius:50%;transition:background-color 0.2s ease;";
    bellBtn.innerHTML = '<i class="fa-regular fa-bell" aria-hidden="true"></i>';

    bellBtn.addEventListener("mouseenter", () => {
        bellBtn.style.backgroundColor = "rgba(255,255,255,0.15)";
    });
    bellBtn.addEventListener("mouseleave", () => {
        bellBtn.style.backgroundColor = "transparent";
    });

    const badge = document.createElement("span");
    badge.className = "notification-badge";
    badge.style.cssText =
        "position:absolute;top:2px;right:2px;min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#FF2600;color:#fff;font-size:10px;font-weight:700;display:none;align-items:center;justify-content:center;";

    bellBtn.appendChild(badge);
    container.appendChild(bellBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "notification-dropdown";
    dropdown.style.cssText =
        "position:absolute;top:calc(100% + 10px);right:0;width:300px;max-width:calc(100vw - 40px);max-height:360px;overflow-y:auto;background:#fff;border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,0.2);border:1px solid #E2E8F0;display:none;z-index:1001;";

    const header = document.createElement("div");
    header.style.cssText =
        "display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #E2E8F0;";

    const headerTitle = document.createElement("h4");
    headerTitle.textContent = "Notifications";
    headerTitle.style.cssText = "margin:0;font-size:15px;font-weight:700;color:#1E293B;";

    const markReadBtn = document.createElement("button");
    markReadBtn.type = "button";
    markReadBtn.textContent = "Mark all as read";
    markReadBtn.style.cssText =
        "background:none;border:none;color:#FF2600;font-size:12px;font-weight:600;cursor:pointer;padding:0;";

    header.appendChild(headerTitle);
    header.appendChild(markReadBtn);

    const list = document.createElement("div");

    dropdown.appendChild(header);
    dropdown.appendChild(list);
    container.appendChild(dropdown);

    // Toggle the dropdown open / closed
    bellBtn.addEventListener("click", (clickEvent) => {

        clickEvent.stopPropagation();

        const isOpen = dropdown.style.display === "block";

        // Close any other open dropdown first (desktop + mobile nav both exist in the DOM)
        document.querySelectorAll(".notification-dropdown").forEach((otherDropdown) => {
            otherDropdown.style.display = "none";
        });

        if (!isOpen) {
            dropdown.style.display = "block";
            renderNotificationList(list);
        }

    });

    markReadBtn.addEventListener("click", () => {
        markAllNotificationsRead();
        renderNotificationList(list);
    });

    // Close this dropdown when clicking anywhere outside it
    document.addEventListener("click", (clickEvent) => {

        if (!container.contains(clickEvent.target)) {
            dropdown.style.display = "none";
        }

    });

    return container;

}


// Show a signed-in state in the navbar demo
const loggedInUser = JSON.parse(localStorage.getItem("campusConnectUser") || "null");

if (loggedInUser) {

    const authAreas = document.querySelectorAll(".auth-btn, .mobile-auth");

    // take the first letter of the user's name to put inside the avatar circle
    const firstLetter = loggedInUser.name.charAt(0).toUpperCase();

    authAreas.forEach((area) => {

        area.innerHTML = "";

        // Bell comes first, then who's signed in, then the sign out button
        area.appendChild(buildNotificationBell());

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

    updateAllNotificationBadges();

}