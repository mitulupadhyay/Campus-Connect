// clubs.js
// This file contain search box, category filter chips, and pagination

const clubCards = document.querySelectorAll(".clubs-grid .club-card");

// Only run this code if there are club cards on the page
if (clubCards.length > 0) {

    const searchInput = document.getElementById("club-search");
    const filterChips = document.querySelectorAll(".clubs-filters .filter-chip");
    const paginationNumbers = document.querySelector(".pagination-numbers");
    const prevPageBtn = document.querySelector(".pagination .page-btn[aria-label='Previous page']");
    const nextPageBtn = document.querySelector(".pagination .page-btn[aria-label='Next page']");
    const noResults = document.querySelector(".no-results");

    const CLUBS_PER_PAGE = 6;

    let activeCategory = "All Clubs";
    let currentPage = 1;

    // Build a simple array of club info  one object per card

    const clubs = [];

    clubCards.forEach((card) => {

        const tagElements = card.querySelectorAll(".club-tags span");
        let tagsText = "";

        tagElements.forEach((tag) => {
            tagsText = tagsText + tag.textContent.trim().toLowerCase() + " ";
        });

        const club = {
            card: card,
            name: card.querySelector("h3").textContent.trim(),
            description: card.querySelector(".club-description").textContent.trim(),
            category: card.querySelector(".club-category").textContent.trim(),
            tags: tagsText,
            tagList: Array.from(card.querySelectorAll(".club-tags span")).map((tag) => tag.textContent.trim()),
            members: card.querySelector(".club-stats .club-stat:nth-child(1) span").textContent.trim(),
            events: card.querySelector(".club-stats .club-stat:nth-child(2) span").textContent.trim(),
            rating: card.querySelector(".club-stats .club-stat:nth-child(3) span").textContent.trim(),
            logoIcon: card.querySelector(".club-logo i").className,
            learnMoreBtn: card.querySelector(".club-btn")
        };

        clubs.push(club);

    });

    // Returns only the clubs that match the current search box text

    function getVisibleClubs() {

        let searchTerm = "";
        if (searchInput) {
            searchTerm = searchInput.value.trim().toLowerCase();
        }

        const visibleClubs = [];

        clubs.forEach((club) => {

            let matchesCategory = false;
            if (activeCategory === "All Clubs" || club.category === activeCategory) {
                matchesCategory = true;
            }

            let matchesSearch = false;
            if (searchTerm === "") {
                matchesSearch = true;
            } else if (club.name.toLowerCase().includes(searchTerm)) {
                matchesSearch = true;
            } else if (club.description.toLowerCase().includes(searchTerm)) {
                matchesSearch = true;
            } else if (club.tags.includes(searchTerm)) {
                matchesSearch = true;
            }

            if (matchesCategory && matchesSearch) {
                visibleClubs.push(club);
            }

        });

        return visibleClubs;

    }

    // Show only the clubs for the current page.

    function renderClubs() {

        const filtered = getVisibleClubs();

        let totalPages = Math.ceil(filtered.length / CLUBS_PER_PAGE);
        if (totalPages < 1) {
            totalPages = 1;
        }

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const start = (currentPage - 1) * CLUBS_PER_PAGE;
        const end = start + CLUBS_PER_PAGE;
        const pageClubs = filtered.slice(start, end);

        // Hide every card first

        clubs.forEach((club) => {
            club.card.classList.add("hidden-card");
        });

        // then show only the ones that belong on this page

        pageClubs.forEach((club) => {
            club.card.classList.remove("hidden-card");
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

    // Builds the row of page number buttons :- pagination
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
                    renderClubs();
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

    // Re run the search every time the user types
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderClubs();
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

            renderClubs();

        });

    });

    // Go to the previous page
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage = currentPage - 1;
                renderClubs();
            }
        });
    }

    // Go to the next page
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            currentPage = currentPage + 1;
            renderClubs();
        });
    }

    // Show the clubs first time when the page loads
    renderClubs();


    // CLUB DETAILS MODAL

    const clubModalOverlay = document.getElementById("club-modal-overlay");
    const clubModalClose = document.getElementById("club-modal-close");
    const clubModalLogo = document.getElementById("club-modal-logo");
    const clubModalTitle = document.getElementById("club-modal-title");
    const clubModalDescription = document.getElementById("club-modal-description");
    const clubModalCategory = document.getElementById("club-modal-category");
    const clubModalMembers = document.getElementById("club-modal-members");
    const clubModalEvents = document.getElementById("club-modal-events");
    const clubModalRating = document.getElementById("club-modal-rating");
    const clubModalTags = document.getElementById("club-modal-tags");
    const clubModalJoinBtn = document.getElementById("club-modal-join");

    // Keeps track of which club is currently open in the modal
    let currentModalClub = null;

    // Remember the last focused element so we can focus it again when the modal closes
    let clubLastFocusedElement = null;

    function getJoinedClubs() {
        return JSON.parse(localStorage.getItem("campusConnectJoinedClubs") || "[]");
    }

    function saveJoinedClubs(joinedList) {
        localStorage.setItem("campusConnectJoinedClubs", JSON.stringify(joinedList));
    }

    // Makes the Join button show the right state :- Join Club/Joined)
    function updateJoinButton(club) {

        if (!clubModalJoinBtn) return;

        const joinedClubs = getJoinedClubs();

        if (joinedClubs.includes(club.name)) {
            clubModalJoinBtn.textContent = "Joined ✓";
            clubModalJoinBtn.classList.add("is-registered");
        } else {
            clubModalJoinBtn.textContent = "Join Club";
            clubModalJoinBtn.classList.remove("is-registered");
        }

    }

    // Fills the modal with one clubs info and shows it
    function openClubModal(club) {

        if (!clubModalOverlay) return;

        currentModalClub = club;

        if (clubModalLogo) {
            const logoIcon = clubModalLogo.querySelector("i");
            if (logoIcon) logoIcon.className = club.logoIcon;
        }

        clubModalTitle.textContent = club.name;
        clubModalDescription.textContent = club.description;
        clubModalCategory.textContent = club.category;
        clubModalMembers.textContent = club.members;
        clubModalEvents.textContent = club.events;
        clubModalRating.textContent = club.rating;

        clubModalTags.innerHTML = "";
        club.tagList.forEach((tag) => {
            const tagSpan = document.createElement("span");
            tagSpan.textContent = tag;
            clubModalTags.appendChild(tagSpan);
        });

        updateJoinButton(club);

        clubLastFocusedElement = document.activeElement;

        clubModalOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
        clubModalClose.focus();

    }

    // Hides the modal
    function closeClubModal() {

        if (!clubModalOverlay) return;

        clubModalOverlay.classList.remove("show");
        document.body.style.overflow = "";
        currentModalClub = null;

        if (clubLastFocusedElement) {
            clubLastFocusedElement.focus();
        }

    }

    // Open the modal whenever "Learn More" is clicked on a club card
    clubs.forEach((club) => {

        if (club.learnMoreBtn) {

            club.learnMoreBtn.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();
                openClubModal(club);
            });

        }

    });

    if (clubModalClose) {
        clubModalClose.addEventListener("click", closeClubModal);
    }

    // Close the modal when clicking the dark overlay outside the box
    if (clubModalOverlay) {

        clubModalOverlay.addEventListener("click", (clickEvent) => {
            if (clickEvent.target === clubModalOverlay) {
                closeClubModal();
            }
        });

    }

    // Close the modal with the Escape key
    document.addEventListener("keydown", (keyEvent) => {

        if (keyEvent.key === "Escape" && clubModalOverlay && clubModalOverlay.classList.contains("show")) {
            closeClubModal();
        }

    });

    // Shows the "you have joined" / "you've left" toast
    let clubToastTimer = null;

    function showClubToast(message) {

        const toast = document.getElementById("club-toast");
        const toastText = document.getElementById("club-toast-text");

        if (!toast || !toastText) return;

        toastText.textContent = message;
        toast.classList.add("show");

        clearTimeout(clubToastTimer);
        clubToastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);

    }

    // Join button inside the modal  clicking again after joining leaves the club
    if (clubModalJoinBtn) {

        clubModalJoinBtn.addEventListener("click", () => {

            if (!currentModalClub) return;

            // Must be signed in to join a club, same rule as registering for an event

            const loggedInUser = JSON.parse(localStorage.getItem("campusConnectUser") || "null");

            if (!loggedInUser) {
                window.location.href = "signin.html";
                return;
            }

            const joinedClubs = getJoinedClubs();
            const index = joinedClubs.indexOf(currentModalClub.name);

            if (index === -1) {

                joinedClubs.push(currentModalClub.name);
                saveJoinedClubs(joinedClubs);

                updateJoinButton(currentModalClub);
                showClubToast("You've joined " + currentModalClub.name + "!");

            } else {

                joinedClubs.splice(index, 1);
                saveJoinedClubs(joinedClubs);

                updateJoinButton(currentModalClub);
                showClubToast("You've left " + currentModalClub.name + ".");

            }

        });

    }

    // Open the club from the URL, if one was provided.
    const urlParams = new URLSearchParams(window.location.search);
    const requestedClubName = urlParams.get("club");

    if (requestedClubName) {

        const requestedClub = clubs.find((club) => club.name === requestedClubName);

        if (requestedClub) {
            openClubModal(requestedClub);
        }

    }

}