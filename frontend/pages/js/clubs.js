// clubs.js
// This file powers the search box, category filter chips, and pagination

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

    // Build a simple array of club info, one object per card.

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
            tags: tagsText
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

    // Shows only the clubs that belong on the current page and hide the rest using hidden card class

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

    // Builds the row of page number buttons (Pagination)
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

    // Re-run the search every time the user types
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

}