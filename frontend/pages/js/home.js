// home.js
// Powers the "Recommended For You" section on the home page.
// This is mock event data for now - once there's a backend, this whole
// list can be swapped for a GET /events call instead.

const recommendedMockEvents = [
    {
        title: "CodeStorm 24hr Hackathon",
        category: "Hackathon",
        club: "Coding Club",
        dateText: "24/08/26, 12:00 PM",
        venue: "Main Auditorium",
        eligibility: "Students Only",
        seatsText: "24 seats left",
        image: "../assets/img/card1.jpg",
        imageAlt: "CodeStorm hackathon",
        tags: ["Coding"]
    },
    {
        title: "AI & Machine Learning Bootcamp",
        category: "Workshop",
        club: "AI Club",
        dateText: "28/08/26, 10:00 AM",
        venue: "Seminar Hall",
        eligibility: "Students & Teachers",
        seatsText: "48 seats left",
        image: "../assets/img/card2.jpg",
        imageAlt: "AI & Machine Learning Bootcamp",
        tags: ["AI/ML", "Coding"]
    },
    {
        title: "Campus Cultural Fest 2026",
        category: "Cultural",
        club: "Drama Club",
        dateText: "30/08/26, 6:00 PM",
        venue: "Open Air Theatre",
        eligibility: "Everyone",
        seatsText: "120 seats left",
        image: "../assets/img/card3.jpg",
        imageAlt: "Campus Cultural Fest 2026",
        tags: ["Music", "Design"]
    },
    {
        title: "Robotics Arena Challenge",
        category: "Competition",
        club: "Robotics Club",
        dateText: "12/09/26, 11:00 AM",
        venue: "Innovation Hub",
        eligibility: "Students Only",
        seatsText: "40 seats left",
        image: "../assets/img/card1.jpg",
        imageAlt: "Robotics arena challenge",
        tags: ["Robotics", "Coding"]
    },
    {
        title: "UI/UX Design Sprint",
        category: "Workshop",
        club: "Design Club",
        dateText: "15/09/26, 2:00 PM",
        venue: "Design Studio",
        eligibility: "Students Only",
        seatsText: "35 seats left",
        image: "../assets/img/card2.jpg",
        imageAlt: "UI UX design sprint",
        tags: ["Design"]
    },
    {
        title: "Photowalk: Campus Through Your Lens",
        category: "Cultural",
        club: "Photography Club",
        dateText: "19/09/26, 4:00 PM",
        venue: "Campus Grounds",
        eligibility: "Everyone",
        seatsText: "50 seats left",
        image: "../assets/img/card3.jpg",
        imageAlt: "Campus photowalk",
        tags: ["Photography"]
    },
    {
        title: "Startup Pitch Night",
        category: "Networking",
        club: "E-Cell",
        dateText: "22/09/26, 5:30 PM",
        venue: "Innovation Hub",
        eligibility: "Students & Alumni",
        seatsText: "60 seats left",
        image: "../assets/img/card1.jpg",
        imageAlt: "Startup pitch night",
        tags: ["Entrepreneurship"]
    },
    {
        title: "Inter-Department Cricket Tournament",
        category: "Sports",
        club: "Sports Committee",
        dateText: "18/10/26, 8:00 AM",
        venue: "University Ground",
        eligibility: "Everyone",
        seatsText: "300 seats left",
        image: "../assets/img/card2.jpg",
        imageAlt: "Cricket tournament",
        tags: ["Sports"]
    }
];

// Returns the mock events that match the user's interests, best match first
function getMatchingEvents(userInterests) {

    const matches = [];

    recommendedMockEvents.forEach((event) => {

        let matchScore = 0;

        userInterests.forEach((interest) => {
            if (event.tags.includes(interest)) {
                matchScore++;
            }
        });

        if (matchScore > 0) {
            matches.push({ event: event, matchScore: matchScore });
        }

    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches.map((match) => match.event);

}

// Builds one event card DOM element (same markup as the real event cards
// on events.html, so the existing card styles apply automatically)
function buildRecommendedCard(event) {

    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
        <div class="card-image">
            <img src="${event.image}" alt="${event.imageAlt}" loading="lazy" />
        </div>
        <div class="card-body">
            <div class="card-badges">
                <span class="event-type-badge">${event.category}</span>
                <span class="badge-gray">${event.club}</span>
            </div>
            <h3>${event.title}</h3>
            <div class="card-info">
                <div class="card-date"><i class="fa-solid fa-calendar" aria-hidden="true"></i> ${event.dateText}</div>
                <div class="card-venue"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${event.venue}</div>
                <div class="card-eligibility"><i class="fa-solid fa-user-group" aria-hidden="true"></i> ${event.eligibility}</div>
            </div>
            <div class="card-divider"></div>
            <div class="seat-status"><p><i class="fa-solid fa-ticket" aria-hidden="true"></i> ${event.seatsText}</p></div>
            <div class="card-actions">
                <a href="events.html" class="btn-outline">View Details</a>
                <a href="events.html" class="btn-solid">Register</a>
            </div>
        </div>
    `;

    return card;

}

// Fills in the Recommended For You section, or shows the empty state
// if the visitor hasn't picked any interests yet
function renderRecommended() {

    const grid = document.getElementById("recommended-grid");
    const emptyState = document.getElementById("recommended-empty");
    const viewAllWrap = document.getElementById("recommended-view-all");

    if (!grid) return;

    const user = JSON.parse(localStorage.getItem("campusConnectUser") || "null");
    const userInterests = user && user.interests ? user.interests : [];

    const matchedEvents = userInterests.length > 0 ? getMatchingEvents(userInterests) : [];

    if (matchedEvents.length === 0) {

        grid.innerHTML = "";
        grid.classList.add("hidden");
        if (viewAllWrap) viewAllWrap.classList.add("hidden");
        if (emptyState) emptyState.classList.remove("hidden");

        return;

    }

    grid.classList.remove("hidden");
    if (viewAllWrap) viewAllWrap.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");

    // Show the top 3 matches
    const topMatches = matchedEvents.slice(0, 3);

    grid.innerHTML = "";
    topMatches.forEach((event) => {
        grid.appendChild(buildRecommendedCard(event));
    });

}

document.addEventListener("DOMContentLoaded", renderRecommended);
