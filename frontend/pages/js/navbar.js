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


// TODO: Sticky Navbar on Scroll

// TODO: Hero Scroll Indicator

// TODO: Hero Carousel
