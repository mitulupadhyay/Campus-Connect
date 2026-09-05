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
                <button type="button" class="btn-outline">View Details</button>
                <button type="button" class="btn-solid">Register</button>
            </div>
        </div>
    `;

    const viewBtn = card.querySelector(".btn-outline");
    const registerBtn = card.querySelector(".btn-solid");

    if (viewBtn) {
        viewBtn.addEventListener("click", () => openHomeEventModal(event));
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", () => openHomeEventModal(event));
    }

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


// EVENT DETAILS MODAL (shared by the "Upcoming Events" cards and the
// "Recommended For You" cards - both just call openHomeEventModal(event))

const homeEventModalOverlay = document.getElementById("home-event-modal-overlay");
const homeEventModalClose = document.getElementById("home-event-modal-close");
const homeEventModalImg = document.getElementById("home-event-modal-img");
const homeEventModalCategory = document.getElementById("home-event-modal-category");
const homeEventModalClub = document.getElementById("home-event-modal-club");
const homeEventModalTitle = document.getElementById("home-event-modal-title");
const homeEventModalDate = document.getElementById("home-event-modal-date");
const homeEventModalVenue = document.getElementById("home-event-modal-venue");
const homeEventModalEligibility = document.getElementById("home-event-modal-eligibility");
const homeEventModalSeats = document.getElementById("home-event-modal-seats");
const homeEventModalRegisterBtn = document.getElementById("home-event-modal-register");

let currentHomeModalEvent = null;

function getRegisteredEvents() {
    return JSON.parse(localStorage.getItem("campusConnectRegisteredEvents") || "[]");
}

function saveRegisteredEvents(list) {
    localStorage.setItem("campusConnectRegisteredEvents", JSON.stringify(list));
}

function showHomeToast(toastId, textId, message) {

    const toast = document.getElementById(toastId);
    const toastText = document.getElementById(textId);

    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);

}

// Makes the Register button show the right text (Register vs Registered ✓)
function updateHomeRegisterButton(event) {

    if (!homeEventModalRegisterBtn) return;

    const registeredEvents = getRegisteredEvents();

    if (registeredEvents.includes(event.title)) {
        homeEventModalRegisterBtn.textContent = "Registered ✓";
        homeEventModalRegisterBtn.classList.add("is-registered");
    } else {
        homeEventModalRegisterBtn.textContent = "Register";
        homeEventModalRegisterBtn.classList.remove("is-registered");
    }

}

function openHomeEventModal(event) {

    if (!homeEventModalOverlay) return;

    currentHomeModalEvent = event;

    if (homeEventModalImg) {
        homeEventModalImg.src = event.image;
        homeEventModalImg.alt = event.imageAlt || event.title;
    }

    homeEventModalCategory.textContent = event.category;
    homeEventModalClub.textContent = event.club;
    homeEventModalTitle.textContent = event.title;
    homeEventModalDate.textContent = event.dateText;
    homeEventModalVenue.textContent = event.venue;
    homeEventModalEligibility.textContent = event.eligibility;
    homeEventModalSeats.textContent = event.seatsText;

    updateHomeRegisterButton(event);

    homeEventModalOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
    if (homeEventModalClose) homeEventModalClose.focus();

}

function closeHomeEventModal() {

    if (!homeEventModalOverlay) return;

    homeEventModalOverlay.classList.remove("show");
    document.body.style.overflow = "";
    currentHomeModalEvent = null;

}

if (homeEventModalClose) {
    homeEventModalClose.addEventListener("click", closeHomeEventModal);
}

if (homeEventModalOverlay) {

    homeEventModalOverlay.addEventListener("click", (clickEvent) => {
        if (clickEvent.target === homeEventModalOverlay) {
            closeHomeEventModal();
        }
    });

}

document.addEventListener("keydown", (keyEvent) => {

    if (keyEvent.key === "Escape" && homeEventModalOverlay && homeEventModalOverlay.classList.contains("show")) {
        closeHomeEventModal();
    }

});

// Register button inside the modal - toggles registered / not registered.
// Just like the real Events page, you need to be signed in to register.
if (homeEventModalRegisterBtn) {

    homeEventModalRegisterBtn.addEventListener("click", (clickEvent) => {

        clickEvent.preventDefault();

        if (!currentHomeModalEvent) return;

        const loggedInUser = JSON.parse(localStorage.getItem("campusConnectUser") || "null");

        if (!loggedInUser) {
            window.location.href = "signin.html";
            return;
        }

        const registeredEvents = getRegisteredEvents();
        const index = registeredEvents.indexOf(currentHomeModalEvent.title);

        if (index === -1) {
            registeredEvents.push(currentHomeModalEvent.title);
            saveRegisteredEvents(registeredEvents);
            updateHomeRegisterButton(currentHomeModalEvent);
            showHomeToast("home-register-toast", "home-register-toast-text", "Successfully registered for " + currentHomeModalEvent.title);
        } else {
            registeredEvents.splice(index, 1);
            saveRegisteredEvents(registeredEvents);
            updateHomeRegisterButton(currentHomeModalEvent);
            showHomeToast("home-register-toast", "home-register-toast-text", "Registration cancelled for " + currentHomeModalEvent.title);
        }

    });

}

// Wire up the 3 static "Upcoming Events" cards to open the same modal
// instead of just sitting there as dead links
document.querySelectorAll(".upcoming-events-grid .event-card").forEach((card) => {

    const event = {
        title: card.querySelector("h3").textContent.trim(),
        category: card.querySelector(".event-type-badge").textContent.trim(),
        club: card.querySelector(".badge-gray").textContent.trim(),
        dateText: card.querySelector(".card-date").textContent.trim(),
        venue: card.querySelector(".card-venue").textContent.trim(),
        eligibility: card.querySelector(".card-eligibility").textContent.trim(),
        seatsText: card.querySelector(".seat-status").textContent.trim(),
        image: card.querySelector(".card-image img").src,
        imageAlt: card.querySelector(".card-image img").alt
    };

    const viewBtn = card.querySelector(".btn-outline");
    const registerBtn = card.querySelector(".btn-solid");

    if (viewBtn) {

        viewBtn.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            openHomeEventModal(event);
        });

    }

    if (registerBtn) {

        registerBtn.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            openHomeEventModal(event);
        });

    }

});


// CLUB DETAILS MODAL (for the "Popular Clubs" preview cards)

const homeClubModalOverlay = document.getElementById("home-club-modal-overlay");
const homeClubModalClose = document.getElementById("home-club-modal-close");
const homeClubModalLogo = document.getElementById("home-club-modal-logo");
const homeClubModalTitle = document.getElementById("home-club-modal-title");
const homeClubModalDescription = document.getElementById("home-club-modal-description");
const homeClubModalCategory = document.getElementById("home-club-modal-category");
const homeClubModalMembers = document.getElementById("home-club-modal-members");
const homeClubModalEvents = document.getElementById("home-club-modal-events");
const homeClubModalRating = document.getElementById("home-club-modal-rating");
const homeClubModalTags = document.getElementById("home-club-modal-tags");
const homeClubModalJoinBtn = document.getElementById("home-club-modal-join");

let currentHomeModalClub = null;

function getJoinedClubs() {
    return JSON.parse(localStorage.getItem("campusConnectJoinedClubs") || "[]");
}

function saveJoinedClubs(list) {
    localStorage.setItem("campusConnectJoinedClubs", JSON.stringify(list));
}

function updateHomeJoinButton(club) {

    if (!homeClubModalJoinBtn) return;

    const joinedClubs = getJoinedClubs();

    if (joinedClubs.includes(club.name)) {
        homeClubModalJoinBtn.textContent = "Joined ✓";
        homeClubModalJoinBtn.classList.add("is-registered");
    } else {
        homeClubModalJoinBtn.textContent = "Join Club";
        homeClubModalJoinBtn.classList.remove("is-registered");
    }

}

function openHomeClubModal(club) {

    if (!homeClubModalOverlay) return;

    currentHomeModalClub = club;

    if (homeClubModalLogo) {
        const logoIcon = homeClubModalLogo.querySelector("i");
        if (logoIcon) logoIcon.className = club.logoIcon;
    }

    homeClubModalTitle.textContent = club.name;
    homeClubModalDescription.textContent = club.description;
    homeClubModalCategory.textContent = club.category;
    homeClubModalMembers.textContent = club.members;
    homeClubModalEvents.textContent = club.events;
    homeClubModalRating.textContent = club.rating;

    homeClubModalTags.innerHTML = "";
    club.tagList.forEach((tag) => {
        const tagSpan = document.createElement("span");
        tagSpan.textContent = tag;
        homeClubModalTags.appendChild(tagSpan);
    });

    updateHomeJoinButton(club);

    homeClubModalOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
    if (homeClubModalClose) homeClubModalClose.focus();

}

function closeHomeClubModal() {

    if (!homeClubModalOverlay) return;

    homeClubModalOverlay.classList.remove("show");
    document.body.style.overflow = "";
    currentHomeModalClub = null;

}

if (homeClubModalClose) {
    homeClubModalClose.addEventListener("click", closeHomeClubModal);
}

if (homeClubModalOverlay) {

    homeClubModalOverlay.addEventListener("click", (clickEvent) => {
        if (clickEvent.target === homeClubModalOverlay) {
            closeHomeClubModal();
        }
    });

}

document.addEventListener("keydown", (keyEvent) => {

    if (keyEvent.key === "Escape" && homeClubModalOverlay && homeClubModalOverlay.classList.contains("show")) {
        closeHomeClubModal();
    }

});

// Join Club button inside the modal - toggles joined / not joined.
// Just like a real membership action, you need to be signed in to join.
if (homeClubModalJoinBtn) {

    homeClubModalJoinBtn.addEventListener("click", () => {

        if (!currentHomeModalClub) return;

        const loggedInUser = JSON.parse(localStorage.getItem("campusConnectUser") || "null");

        if (!loggedInUser) {
            window.location.href = "signin.html";
            return;
        }

        const joinedClubs = getJoinedClubs();
        const index = joinedClubs.indexOf(currentHomeModalClub.name);

        if (index === -1) {
            joinedClubs.push(currentHomeModalClub.name);
            saveJoinedClubs(joinedClubs);
            updateHomeJoinButton(currentHomeModalClub);
            showHomeToast("home-club-toast", "home-club-toast-text", "You've joined " + currentHomeModalClub.name + "!");
        } else {
            joinedClubs.splice(index, 1);
            saveJoinedClubs(joinedClubs);
            updateHomeJoinButton(currentHomeModalClub);
            showHomeToast("home-club-toast", "home-club-toast-text", "You've left " + currentHomeModalClub.name + ".");
        }

    });

}

// Wire up the "Popular Clubs" preview cards to open the club modal
document.querySelectorAll(".popular-clubs-grid .club-card").forEach((card) => {

    const club = {
        name: card.querySelector("h3").textContent.trim(),
        description: card.querySelector(".club-description").textContent.trim(),
        category: card.querySelector(".club-category").textContent.trim(),
        members: card.querySelector(".club-stats .club-stat:nth-child(1) span").textContent.trim(),
        events: card.querySelector(".club-stats .club-stat:nth-child(2) span").textContent.trim(),
        rating: card.querySelector(".club-stats .club-stat:nth-child(3) span").textContent.trim(),
        tagList: Array.from(card.querySelectorAll(".club-tags span")).map((tag) => tag.textContent.trim()),
        logoIcon: card.querySelector(".club-logo i").className
    };

    const learnMoreBtn = card.querySelector(".club-btn");

    if (learnMoreBtn) {

        learnMoreBtn.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            openHomeClubModal(club);
        });

    }

});
