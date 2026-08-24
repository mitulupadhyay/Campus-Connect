// animations.js

// Scroll Reveal Animation

const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length > 0 && "IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Only need to reveal an element once
                revealObserver.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15
    });

    revealElements.forEach((el) => revealObserver.observe(el));

} else {

    // No IntersectionObserver support show everything
    revealElements.forEach((el) => el.classList.add("is-visible"));

}