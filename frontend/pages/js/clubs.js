const clubsGrid = document.getElementById("clubs-grid");
const clubCards = Array.from(clubsGrid.querySelectorAll(".club-card"));
const searchInput = document.getElementById("club-search");
const filterButtons = document.querySelectorAll("#club-filters .filter-chip");
const noResults = document.getElementById("clubs-no-results");
const pagination = document.getElementById("clubs-pagination");
const pageNumbers = document.getElementById("clubs-page-numbers");
const prevBtn = document.getElementById("clubs-prev");
const nextBtn = document.getElementById("clubs-next");

const PAGE_SIZE = 6;
let currentPage = 1;
let activeFilter = "all";

function getFilteredCards() {
    const query = searchInput.value.trim().toLowerCase();

    return clubCards.filter(card => {
        const matchesFilter =
            activeFilter === "all" || card.dataset.category === activeFilter;
        const matchesSearch =
            query === "" ||
            card.dataset.name.includes(query) ||
            card.textContent.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
    });
}

function renderPageNumbers(totalPages) {
    pageNumbers.innerHTML = "";

    for (let page = 1; page <= totalPages; page += 1) {
        const btn = document.createElement("button");
        btn.className = "page-btn" + (page === currentPage ? " active" : "");
        btn.textContent = page;
        btn.addEventListener("click", () => {
            currentPage = page;
            render();
            clubsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        pageNumbers.appendChild(btn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function render() {
    clubCards.forEach(card => card.classList.add("hidden-card"));

    const filtered = getFilteredCards();
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

prevBtn.addEventListener("click", () => {
    currentPage -= 1;
    render();
});

nextBtn.addEventListener("click", () => {
    currentPage += 1;
    render();
});

render();
