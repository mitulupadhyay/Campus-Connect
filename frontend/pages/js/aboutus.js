const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close every item first
        faqItems.forEach(other => {
            other.classList.remove("active");
            other.querySelector(".faq-answer").style.maxHeight = null;
        });
        // Re-open the clicked one if it wasn't already open
        if (!isOpen) {
            item.classList.add("active");
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
    });
});
