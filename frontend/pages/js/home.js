const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const navbar = document.querySelector(".navbar");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

navItems.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// NAVBAR SCROLLED STATE
if (navbar) {
    const toggleScrolled = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
    };

    toggleScrolled();
    window.addEventListener("scroll", toggleScrolled);
}

// HERO SCROLL INDICATOR — jumps to the section named in data-target
document.querySelectorAll(".scroll-indicator").forEach(indicator => {
    indicator.addEventListener("click", () => {
        const target = document.querySelector(indicator.dataset.target || "");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// HERO CAROUSEL — auto-rotating slides with dot navigation, used on
// Events and Clubs hero sections. Pauses on hover.
document.querySelectorAll(".hero-carousel").forEach(carousel => {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const prevBtn = carousel.querySelector(".carousel-arrow-prev");
    const nextBtn = carousel.querySelector(".carousel-arrow-next");

    if (slides.length <= 1) return;

    let current = 0;
    let timer = null;

    const goTo = index => {
        slides[current].classList.remove("active");
        dots[current]?.classList.remove("active");

        current = (index + slides.length) % slides.length;

        slides[current].classList.add("active");
        dots[current]?.classList.add("active");
    };

    const start = () => {
        timer = setInterval(() => goTo(current + 1), 4500);
    };

    const stop = () => clearInterval(timer);

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            goTo(i);
            stop();
            start();
        });
    });

    prevBtn?.addEventListener("click", () => {
        goTo(current - 1);
        stop();
        start();
    });

    nextBtn?.addEventListener("click", () => {
        goTo(current + 1);
        stop();
        start();
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    start();
});
