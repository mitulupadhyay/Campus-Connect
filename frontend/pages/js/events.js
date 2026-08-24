// events.js
// This file powers the search box, sort dropdown, category filter chips,


// Turns text like "24/08/26, 12:00 PM" into a real JavaScript Date
// so we can compare and sort events by when they happen.
function parseEventDate(text) {

    const parts = text.split(",");
    const datePart = parts[0].trim();

    let timePart = "";
    if (parts[1]) {
        timePart = parts[1].trim();
    }

    const dateNumbers = datePart.split("/");
    const day = Number(dateNumbers[0]);
    const month = Number(dateNumbers[1]);
    const year = Number(dateNumbers[2]);
    const fullYear = 2000 + year;

    let hours = 0;
    let minutes = 0;

    if (timePart !== "") {

        const timeWords = timePart.split(" ");
        const clock = timeWords[0];

        let period = "";
        if (timeWords[1]) {
            period = timeWords[1].toUpperCase();
        }

        const clockParts = clock.split(":");
        hours = Number(clockParts[0]);
        minutes = Number(clockParts[1]);

        if (period === "PM" && hours !== 12) {
            hours = hours + 12;
        }

        if (period === "AM" && hours === 12) {
            hours = 0;
        }

    }

    return new Date(fullYear, month - 1, day, hours, minutes);

}

// Pulls the number out of text like "24 seats left -> 24 is the number here"
function parseSeats(text) {

    const words = text.split(" ");
    const seats = Number(words[0]);

    if (isNaN(seats)) {
        return 0;
    }

    return seats;

}

const eventCards = document.querySelectorAll(".events-grid .event-card");

// Only run this code if there are event cards on the page

if (eventCards.length > 0) {

    const searchInput = document.getElementById("event-search");
    const sortSelect = document.getElementById("event-sort");
    const filterChips = document.querySelectorAll(".events-filters .filter-chip");
    const paginationNumbers = document.querySelector(".pagination-numbers");
    const prevPageBtn = document.querySelector(".pagination .page-btn[aria-label='Previous page']");
    const nextPageBtn = document.querySelector(".pagination .page-btn[aria-label='Next page']");
    const noResults = document.querySelector(".no-results");

    const EVENTS_PER_PAGE = 6;

    let activeCategory = "All Events";
    let currentPage = 1;

    // Build a simple array of event info, one object per card

    const events = [];

    eventCards.forEach((card) => {

        const event = {
            card: card,
            title: card.querySelector("h3").textContent.trim(),
            club: card.querySelector(".badge-gray").textContent.trim(),
            category: card.querySelector(".event-type-badge").textContent.trim(),
            venue: card.querySelector(".card-venue").textContent.trim(),
            date: parseEventDate(card.querySelector(".card-date").textContent.trim()),
            seats: parseSeats(card.querySelector(".seat-status").textContent.trim())
        };

        events.push(event);

    });

    // Returns only the events that match the search box and filter chip

    function getVisibleEvents() {

        let searchTerm = "";
        if (searchInput) {
            searchTerm = searchInput.value.trim().toLowerCase();
        }

        const filtered = [];

        events.forEach((event) => {

            let matchesCategory = false;
            if (activeCategory === "All Events" || event.category === activeCategory) {
                matchesCategory = true;
            }

            let matchesSearch = false;
            if (searchTerm === "") {
                matchesSearch = true;
            } else if (event.title.toLowerCase().includes(searchTerm)) {
                matchesSearch = true;
            } else if (event.club.toLowerCase().includes(searchTerm)) {
                matchesSearch = true;
            } else if (event.venue.toLowerCase().includes(searchTerm)) {
                matchesSearch = true;
            }

            if (matchesCategory && matchesSearch) {
                filtered.push(event);
            }

        });

        let sortValue = "date";
        if (sortSelect) {
            sortValue = sortSelect.value;
        }

        // .sort() function that compares two items at one time  a and b

        if (sortValue === "seats") {
            filtered.sort((a, b) => b.seats - a.seats);
        } else if (sortValue === "az") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filtered.sort((a, b) => a.date - b.date);
        }

        return filtered;

    }

    // Shows only the events that belong on the current page and hide the rest using hidden class
    function renderEvents() {

        const filtered = getVisibleEvents();

        let totalPages = Math.ceil(filtered.length / EVENTS_PER_PAGE);
        if (totalPages < 1) {
            totalPages = 1;
        }

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const start = (currentPage - 1) * EVENTS_PER_PAGE;
        const end = start + EVENTS_PER_PAGE;
        const pageEvents = filtered.slice(start, end);

        // Move the cards in the grid so they appear in the sorted order

        const grid = eventCards[0].parentElement;
        filtered.forEach((event) => {
            grid.appendChild(event.card);
        });

        // Hide every card first
        events.forEach((event) => {
            event.card.classList.add("hidden-card");
        });

        // then show only the ones that belong on this page
        pageEvents.forEach((event) => {
            event.card.classList.remove("hidden-card");
        });

        if (noResults) {
            if (filtered.length === 0) {
                noResults.classList.add("show");
            } else {
                noResults.classList.remove("show");
            }
        }

        renderPagination(totalPages);

    }

    // Builds the row of page number buttons (pagination)
    function renderPagination(totalPages) {

        if (paginationNumbers) {

            paginationNumbers.innerHTML = "";

            for (let page = 1; page <= totalPages; page++) {

                const pageBtn = document.createElement("button");
                pageBtn.type = "button";
                pageBtn.className = "page-btn";
                pageBtn.textContent = page;

                if (page === currentPage) {
                    pageBtn.classList.add("active");
                }

                pageBtn.addEventListener("click", () => {
                    currentPage = page;
                    renderEvents();
                });

                paginationNumbers.appendChild(pageBtn);

            }

        }

        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
        }

        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === totalPages;
        }

    }

    // Re-run the search every time the user types
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderEvents();
        });
    }

    // Re-sort whenever the dropdown changes
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            renderEvents();
        });
    }

    // Switch category when a filter chip is clicked
    filterChips.forEach((chip) => {

        chip.addEventListener("click", () => {

            filterChips.forEach((otherChip) => {
                otherChip.classList.remove("active");
                otherChip.setAttribute("aria-pressed", "false");
            });

            chip.classList.add("active");
            chip.setAttribute("aria-pressed", "true");

            activeCategory = chip.textContent.trim();
            currentPage = 1;

            renderEvents();

        });

    });

    // Go to the previous page
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage = currentPage - 1;
                renderEvents();
            }
        });
    }

    // Go to the next page
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            currentPage = currentPage + 1;
            renderEvents();
        });
    }

    // Show the events when the page loads
    renderEvents();

}