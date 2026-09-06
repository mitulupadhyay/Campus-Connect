// animations.js

// Scroll Reveal Animation

const revealElements = document.querySelectorAll("[data-reveal]");


const STAGGER_STEP_MS = 90;


const MAX_STAGGERED_ITEMS = 6;


const revealGroups = new Map();

revealElements.forEach((el) => {

    const parent = el.parentElement;

    if (!revealGroups.has(parent)) {
        revealGroups.set(parent, []);
    }

    revealGroups.get(parent).push(el);

});

revealGroups.forEach((siblings) => {

    siblings.forEach((el, index) => {

        const step = Math.min(index, MAX_STAGGERED_ITEMS);
        el.style.setProperty("--reveal-delay", (step * STAGGER_STEP_MS) + "ms");

    });

});

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

    // No IntersectionObserver
    
    revealElements.forEach((el) => el.classList.add("is-visible"));

}