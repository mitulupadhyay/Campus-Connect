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
            seats: parseSeats(card.querySelector(".seat-status").textContent.trim()),
            dateText: card.querySelector(".card-date").textContent.trim(),
            seatsText: card.querySelector(".seat-status").textContent.trim(),
            eligibility: card.querySelector(".card-eligibility").textContent.trim(),
            image: card.querySelector(".card-image img").src,
            imageAlt: card.querySelector(".card-image img").alt,
            viewBtn: card.querySelector(".btn-outline"),
            registerBtn: card.querySelector(".btn-solid")
        };

        events.push(event);

    });

    // Mark cards that are almost full or completely full so the seat
    // count stands out (still shown even if the event isn't on the
    // current page/filter, since it's just a style hint on the card).
    events.forEach((event) => {

        const seatStatus = event.card.querySelector(".seat-status");

        if (seatStatus && event.seats <= 10) {
            seatStatus.classList.add("almost-full");
        }

    });


    // SAVED / BOOKMARKED EVENTS
    // No backend yet, so saved events live in localStorage for now.

    function getSavedEvents() {
        return JSON.parse(localStorage.getItem("campusConnectSavedEvents") || "[]");
    }

    function saveSavedEvents(savedList) {
        localStorage.setItem("campusConnectSavedEvents", JSON.stringify(savedList));
    }

    // Adds or removes one event from the saved list and updates the button
    function toggleBookmark(event, button) {

        const savedEvents = getSavedEvents();
        const index = savedEvents.indexOf(event.title);

        if (index === -1) {
            savedEvents.push(event.title);
            button.classList.add("bookmarked");
            button.setAttribute("aria-pressed", "true");
        } else {
            savedEvents.splice(index, 1);
            button.classList.remove("bookmarked");
            button.setAttribute("aria-pressed", "false");
        }

        saveSavedEvents(savedEvents);

        // If the "Saved" filter is active, the list on screen needs to
        // update right away since this event might no longer belong there
        if (activeCategory === "Saved") {
            renderEvents();
        }

    }

    // Adds a heart-shaped bookmark button to every event card
    events.forEach((event) => {

        const cardBadges = event.card.querySelector(".card-badges");
        if (!cardBadges) return;

        const bookmarkBtn = document.createElement("button");
        bookmarkBtn.type = "button";
        bookmarkBtn.className = "bookmark-btn";
        bookmarkBtn.setAttribute("aria-label", "Save event");
        bookmarkBtn.innerHTML = '<i class="fa-solid fa-heart" aria-hidden="true"></i>';

        if (getSavedEvents().includes(event.title)) {
            bookmarkBtn.classList.add("bookmarked");
            bookmarkBtn.setAttribute("aria-pressed", "true");
        } else {
            bookmarkBtn.setAttribute("aria-pressed", "false");
        }

        bookmarkBtn.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            toggleBookmark(event, bookmarkBtn);
        });

        cardBadges.appendChild(bookmarkBtn);

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
            } else if (activeCategory === "Saved" && getSavedEvents().includes(event.title)) {
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

                const noResultsText = noResults.querySelector("p");

                if (noResultsText) {
                    if (activeCategory === "Saved") {
                        noResultsText.textContent = "No saved events yet. Bookmark events you want to attend using the heart icon on a card.";
                    } else {
                        noResultsText.textContent = "No events match your search. Try a different keyword or filter.";
                    }
                }

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

    // EVENT DETAILS MODAL

    const modalOverlay = document.getElementById("event-modal-overlay");
    const modalClose = document.getElementById("event-modal-close");
    const modalImg = document.getElementById("event-modal-img");
    const modalCategory = document.getElementById("event-modal-category");
    const modalClub = document.getElementById("event-modal-club");
    const modalTitle = document.getElementById("event-modal-title");
    const modalDate = document.getElementById("event-modal-date");
    const modalVenue = document.getElementById("event-modal-venue");
    const modalEligibility = document.getElementById("event-modal-eligibility");
    const modalSeats = document.getElementById("event-modal-seats");
    const modalRegisterBtn = document.getElementById("event-modal-register");

    // Keeps track of which event is currently open in the modal
    let currentModalEvent = null;

    // Remembers what was focused before the modal opened, so we can
    // put focus back there once the modal closes
    let lastFocusedElement = null;

    // Fills the modal with one event's info and shows it
    function openEventModal(event) {

        if (!modalOverlay) return;

        currentModalEvent = event;

        modalImg.src = event.image;
        modalImg.alt = event.imageAlt;
        modalCategory.textContent = event.category;
        modalClub.textContent = event.club;
        modalTitle.textContent = event.title;
        modalDate.textContent = event.dateText;
        modalVenue.textContent = event.venue;
        modalEligibility.textContent = event.eligibility;
        modalSeats.textContent = event.seatsText;

        updateRegisterButton(modalRegisterBtn, event);

        lastFocusedElement = document.activeElement;

        modalOverlay.classList.add("show");
        modalClose.focus();

    }

    // Hides the modal
    function closeEventModal() {

        if (!modalOverlay) return;

        modalOverlay.classList.remove("show");
        currentModalEvent = null;

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

    }

    // Open the modal whenever "View Details" is clicked on an event card
    events.forEach((event) => {

        if (event.viewBtn) {

            event.viewBtn.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();
                openEventModal(event);
            });

        }

    });

    if (modalClose) {
        modalClose.addEventListener("click", closeEventModal);
    }

    // Close the modal when clicking the dark overlay outside the box
    if (modalOverlay) {

        modalOverlay.addEventListener("click", (clickEvent) => {
            if (clickEvent.target === modalOverlay) {
                closeEventModal();
            }
        });

    }

    // Close the modal with the Escape key
    document.addEventListener("keydown", (keyEvent) => {

        if (keyEvent.key === "Escape" && modalOverlay && modalOverlay.classList.contains("show")) {
            closeEventModal();
        }

    });


    // REGISTER BUTTON LOGIC
    // No backend yet, so "signed in" and "registered" both live in
    // localStorage for now. Later, registerForEvent() below is the
    // one place that should be swapped for a real
    // POST /events/:eventId/register call.

    function getRegisteredEvents() {
        return JSON.parse(localStorage.getItem("campusConnectRegistrations") || "[]");
    }

    function saveRegisteredEvents(registeredList) {
        localStorage.setItem("campusConnectRegistrations", JSON.stringify(registeredList));
    }

    // Turns a Register button into the green "Registered" state
    function markButtonRegistered(button) {

        if (!button) return;

        button.textContent = "Registered ✓";
        button.classList.remove("is-closed");
        button.classList.add("is-registered");
        button.removeAttribute("aria-disabled");

    }

    // Turns a Register button into the disabled "Registration Closed" state
    function markButtonClosed(button) {

        if (!button) return;

        button.textContent = "Registration Closed";
        button.classList.remove("is-registered");
        button.classList.add("is-closed");
        button.setAttribute("aria-disabled", "true");

    }

    // Makes a Register button show the right state when the page loads
    // or the modal opens (Register vs Registered vs Registration Closed)
    function updateRegisterButton(button, event) {

        if (!button) return;

        const registeredEvents = getRegisteredEvents();

        if (registeredEvents.includes(event.title)) {
            markButtonRegistered(button);
        } else if (event.seats === 0) {
            markButtonClosed(button);
        } else {
            button.textContent = "Register";
            button.classList.remove("is-registered", "is-closed");
            button.removeAttribute("aria-disabled");
        }

    }

    // Shows the "successfully registered" toast on the right side of the screen
    let toastTimer = null;

    function showRegisterToast(eventTitle) {

        const toast = document.getElementById("register-toast");
        const toastText = document.getElementById("register-toast-text");

        if (!toast || !toastText) return;

        toastText.textContent = "Successfully registered for " + eventTitle;
        toast.classList.add("show");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);

    }

    // Runs when a visitor clicks Register, either on a card or inside the modal
    function registerForEvent(event) {

        // No seats left, so there's nothing to register for
        if (event.seats === 0) {
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem("campusConnectUser") || "null");

        if (!loggedInUser) {
            window.location.href = "signin.html";
            return;
        }

        const registeredEvents = getRegisteredEvents();

        // Already registered, so there is nothing more to do
        if (registeredEvents.includes(event.title)) {
            return;
        }

        registeredEvents.push(event.title);
        saveRegisteredEvents(registeredEvents);

        markButtonRegistered(event.registerBtn);

        // Keep the modal's button in sync if this event is the one open right now
        if (currentModalEvent && currentModalEvent.title === event.title) {
            markButtonRegistered(modalRegisterBtn);
        }

        showRegisterToast(event.title);

    }

    // Wire up the Register button on every event card and show the
    // correct starting state in case the visitor already registered before
    events.forEach((event) => {

        updateRegisterButton(event.registerBtn, event);

        if (event.registerBtn) {

            event.registerBtn.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();
                registerForEvent(event);
            });

        }

    });

    // Wire up the Register button inside the modal
    if (modalRegisterBtn) {

        modalRegisterBtn.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();

            if (currentModalEvent) {
                registerForEvent(currentModalEvent);
            }

        });

    }


    // Show the events when the page loads
    renderEvents();

}