// aboutus.js

// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {

        const isOpen = item.classList.contains("active");

        // Close every item first (accordion style: only one open at a time)
        faqItems.forEach((otherItem) => {

            otherItem.classList.remove("active");
            otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            otherItem.querySelector(".faq-answer").style.maxHeight = null;

        });

        // Then reopen the clicked item, unless it was already open
        if (!isOpen) {

            item.classList.add("active");
            question.setAttribute("aria-expanded", "true");
            answer.style.maxHeight = answer.scrollHeight + "px";

        }

    });

});