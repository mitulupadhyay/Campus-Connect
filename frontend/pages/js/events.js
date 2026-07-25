const eventsGrid = document.getElementById("events-grid");
const eventCards = Array.from(eventsGrid.querySelectorAll(".event-card"));
const searchInput = document.getElementById("event-search");
const sortSelect = document.getElementById("event-sort");
const filterButtons = document.querySelectorAll("#event-filters .filter-chip");
const noResults = document.getElementById("events-no-results");
const pagination = document.getElementById("events-pagination");
const pageNumbers = document.getElementById("events-page-numbers");
const prevBtn = document.getElementById("events-prev");
const nextBtn = document.getElementById("events-next");

const PAGE_SIZE = 6;
let currentPage = 1;
let activeFilter = "all";

// FILTER + SEARCH
function getFilteredCards() {
    const query = searchInput.value.trim().toLowerCase();

    return eventCards.filter(card => {
        const matchesFilter =
            activeFilter === "all" || card.dataset.category === activeFilter;
        const matchesSearch =
            query === "" ||
            card.dataset.title.includes(query) ||
            card.textContent.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
    });
}

// SORT
function sortCards(cards) {
    const sorted = [...cards];

    if (sortSelect.value === "date") {
        sorted.sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date));
    } else if (sortSelect.value === "seats") {
        sorted.sort((a, b) => Number(b.dataset.seats) - Number(a.dataset.seats));
    } else if (sortSelect.value === "az") {
        sorted.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    }

    return sorted;
}

// PAGINATION — page number buttons are generated based on how many
// results currently match, so this scales with any number of events.
function renderPageNumbers(totalPages) {
    pageNumbers.innerHTML = "";

    for (let page = 1; page <= totalPages; page += 1) {
        const btn = document.createElement("button");
        btn.className = "page-btn" + (page === currentPage ? " active" : "");
        btn.textContent = page;
        btn.addEventListener("click", () => {
            currentPage = page;
            render();
            eventsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        pageNumbers.appendChild(btn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// MAIN RENDER
function render() {
    eventCards.forEach(card => card.classList.add("hidden-card"));

    const filtered = sortCards(getFilteredCards());
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    filtered.slice(start, start + PAGE_SIZE).forEach(card => {
        card.classList.remove("hidden-card");
    });

    noResults.classList.toggle("show", filtered.length === 0);
    pagination.classList.toggle("hidden", filtered.length <= PAGE_SIZE);

    renderPageNumbers(totalPages);
}

// EVENT LISTENERS
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        currentPage = 1;
        render();
    });
});

searchInput.addEventListener("input", () => {
    currentPage = 1;
    render();
});

sortSelect.addEventListener("change", render);

prevBtn.addEventListener("click", () => {
    currentPage -= 1;
    render();
});

nextBtn.addEventListener("click", () => {
    currentPage += 1;
    render();
});

render();
