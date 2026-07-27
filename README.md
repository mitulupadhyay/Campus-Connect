# 🎓 CampusConnect

**A centralized event & club discovery platform for college campuses.**

CampusConnect replaces scattered WhatsApp groups, posters, and word-of-mouth
announcements with a single, searchable place for students to discover
events and clubs — built with a hand-crafted Tailwind CSS design system and
a clean, multi-page vanilla JavaScript architecture.

**Stack:** HTML5 · CSS3 · Tailwind CSS v4 · JavaScript (ES6+) · Deployed on Vercel · MIT Licensed

---

## Introduction

**CampusConnect** is a campus event-management platform built for the
entire college community — students looking for things to do, club
organizers running those events, faculty getting involved academically,
and administrators keeping the platform in order. Instead of event
information being scattered across posters, group chats, and social media,
CampusConnect gives every event and club a single, structured, searchable
home.

This repository currently contains the **complete front-end experience**:
a fully responsive, multi-page interface covering discovery, browsing, and
authentication, built on a reusable Tailwind CSS component system. It's
designed from the ground up to plug into a backend (see [Roadmap](#-roadmap--future-improvements)).

---

## 🔗 Live Demo

| | |
|---|---|
| 🌐 **Live Website** | [campus-connect-drab-beta.vercel.app](https://campus-connect-drab-beta.vercel.app/pages/home.html) |
| 💻 **GitHub Repository** | [github.com/mitulupadhyay/Campus-Connect](https://github.com/mitulupadhyay/Campus-Connect) |

---

## 📖 Project Overview

CampusConnect is designed around **four roles**, selectable right on the
Sign In / Sign Up screen:

| Role | What they'd do on CampusConnect |
|---|---|
| 🎓 **Student** | Discover events and clubs, search & filter by category, view event details (date, venue, eligibility, seats left), and join clubs that match their interests. |
| 🧑‍💼 **Club Organizer** | Create and publish events, manage their club's profile, and track who has registered. |
| 🧑‍🏫 **Faculty / Teacher** | Take part in academic events, and organize seminars, guest lectures, or workshops. |
| 🛡️ **Administrator** | Approve or reject event submissions, manage users and clubs, and keep the platform's content in check. |

The role selector on the auth pages is where this experience begins —
today it captures *who* is signing up; the role-specific dashboards
described above are the next layer to be built on top of it (see
[Roadmap](#-roadmap--future-improvements)).

**What's fully built today** is the student-facing discovery experience:
browsing events and clubs, viewing rich detail cards, and navigating a
polished, responsive interface across every page.

---

## ✨ Features

### 🎓 For Students
- Browse a curated grid of upcoming events with category, date, venue,
  eligibility, and live seat-count badges
- Browse a directory of campus clubs with category tags, member counts,
  ratings, and short descriptions
- Category filter chips and a keyword search bar on both the Events and
  Clubs pages
- Sort events by upcoming date, seats available, or A–Z
- Rotating hero carousel spotlighting featured events/clubs, with manual
  prev/next controls
- Fully responsive, animated mobile navigation menu (slide + fade, not an
  abrupt toggle)

### 🔐 Authentication
- Sign In / Sign Up pages with **role selection** (Student, Club Organizer,
  Faculty, Administrator) via an accessible radio-group UI
- Password visibility toggle markup and a "Continue with Google" option
  (UI in place; see [Roadmap](#-roadmap--future-improvements) for wiring status)

### 🧭 Site-wide
- Consistent, accessible navigation with `aria-expanded`, `aria-controls`,
  a skip-to-content link, and visible focus states throughout
- Reduced-motion support (`prefers-reduced-motion`) for all transitions
- A dedicated **About** page: mission & vision, platform statistics, a
  "How CampusConnect Works" walkthrough, and an FAQ section
- Fully responsive layouts (mobile, tablet, desktop) across every page

> Search, filtering, sorting, FAQ interactivity, and form validation
> currently have their UI and markup built out; the JavaScript logic for
> several of these is tracked as in-progress in [`frontend/pages/js`](./frontend/pages/js)
> — see [Roadmap](#-roadmap--future-improvements) for exact status.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | HTML5, Tailwind CSS v4 (`@utility`/`@layer` component architecture), Vanilla JavaScript (ES6+) |
| **Icons & Fonts** | Font Awesome 6.7.2, Google Fonts (Inter) |
| **Backend** | _Not yet implemented — planned, see Roadmap_ |
| **Database** | _Not yet implemented — planned, see Roadmap_ |
| **Deployment** | Vercel (static hosting, configured via `vercel.json`) |
| **Dev Tools** | Node.js, npm, Tailwind CLI, Git & GitHub |

---

## 📁 Folder Structure

```
Campus-Connect/
├── frontend/
│   ├── assets/
│   │   └── img/                 # Logo, hero image, event/club card images
│   ├── dist/
│   │   └── output.css           # Compiled Tailwind CSS (generated — not hand-edited)
│   └── pages/
│       ├── home.html            # Landing page
│       ├── events.html          # Events discovery page
│       ├── clubs.html           # Clubs discovery page
│       ├── aboutus.html         # About / mission / FAQ page
│       ├── signin.html          # Sign in (with role selector)
│       ├── signup.html          # Sign up (with role selector)
│       └── js/
│           ├── navbar.js        # Mobile menu, sticky navbar (in progress)
│           ├── animations.js    # Scroll-reveal animations (in progress)
│           ├── auth.js          # Password toggle, form validation (in progress)
│           ├── events.js        # Event search/filter/sort/pagination (in progress)
│           ├── clubs.js         # Club search/filter/pagination (in progress)
│           └── aboutus.js       # FAQ accordion (in progress)
├── src/
│   ├── input.css                # Tailwind entry point — imports every CSS module below
│   └── css/
│       ├── base.css             # Resets, theme tokens (`@theme`), global element styles
│       ├── components.css       # Shared, reusable components (buttons, forms, cards, nav, hero, carousel)
│       ├── card.css             # Card system (`@utility card`) + card variants
│       ├── navbar.css           # Navbar layout + mobile menu styles
│       ├── footer.css           # Footer layout
│       ├── animations.css       # Reveal-on-scroll animation utilities
│       ├── landing.css          # Home page–specific sections
│       ├── events.css           # Events page–specific styles
│       ├── clubs.css            # Clubs page–specific styles
│       ├── about.css            # About page–specific styles
│       ├── signin.css           # Shared auth-page layout
│       └── signup.css           # Sign-up–specific overrides
├── vercel.json                  # Vercel build & routing configuration
├── package.json
└── LICENSE
```

> **CSS architecture at a glance:** every page has its own CSS file
> (`events.css`, `clubs.css`, `about.css`, …) so page-specific styling
> stays in one place. Anything reused across two or more pages — buttons,
> form fields, the hero carousel, cards, badges — lives in
> `components.css` or `card.css` instead of being duplicated. `input.css`
> ties it all together as a single Tailwind entry point.

---

## 🖼️ Screenshots

| Page | Preview |
|---|---|
| Landing Page | _add screenshot_ |
| Events | _add screenshot_ |
| Clubs | _add screenshot_ |
| About | _add screenshot_ |
| Sign In | _add screenshot_ |
| Sign Up | _add screenshot_ |

---

## 🚀 Installation

**Prerequisites:** [Node.js](https://nodejs.org/) and npm installed.

```bash
# 1. Clone the repository
git clone https://github.com/mitulupadhyay/Campus-Connect.git
cd Campus-Connect

# 2. Install dependencies
npm install

# 3. Build the CSS once
npm run build

# — or —

# 3. Watch for changes while developing
npm run watch
```

Then open any page in `frontend/pages/` (e.g. `home.html`) directly in
your browser, or serve the `frontend/` folder with a local static server
of your choice (e.g. the VS Code "Live Server" extension).

| Script | Command | Purpose |
|---|---|---|
| `npm run build` | `tailwindcss -i ./src/input.css -o ./frontend/dist/output.css --minify` | One-time production build |
| `npm run watch` | `tailwindcss -i ./src/input.css -o ./frontend/dist/output.css --watch` | Rebuilds CSS automatically as you edit `src/css/` |

---

## 🗺️ Roadmap / Future Improvements

- [ ] **Backend & API** — Node.js/Express (or similar) service to back
  events, clubs, and registrations
- [ ] **Database** — persistent storage for users, events, clubs, and
  registrations
- [ ] **Authentication** — real session/JWT-based auth wired to the
  existing Sign In / Sign Up UI and role selector
- [ ] **Role-based dashboards** — dedicated views for Organizers, Faculty,
  and Administrators (create events, approve requests, manage users)
- [ ] **Functional search, filter, sort & pagination** — wire up the
  existing UI in `events.js` / `clubs.js`
- [ ] **Form validation & password strength meter** on the auth pages
- [ ] **FAQ accordion & scroll-reveal animations** — wire up
  `aboutus.js` / `animations.js`
- [ ] **Email notifications** for registrations and event updates
- [ ] **Personalized recommendations** based on a student's interests and
  past registrations
- [ ] **Analytics dashboard** for organizers and administrators

---

## 🏗️ Project Architecture

- **Multi-page static site** — each page (`home`, `events`, `clubs`,
  `aboutus`, `signin`, `signup`) is its own HTML file under
  `frontend/pages/`, sharing a common navbar and footer markup.
- **Tailwind CSS v4, component-first** — rather than relying purely on
  utility classes inline, recurring UI (buttons, cards, form fields, the
  hero carousel, the navbar) is defined once as custom components using
  Tailwind's `@layer components` and `@utility` directives in
  `src/css/components.css` and `src/css/card.css`. Page-specific styling
  lives in its own file (`events.css`, `clubs.css`, `about.css`, etc.),
  so a change to one page never risks breaking another.
- **Design tokens** — colors, fonts, and spacing are centralized as
  CSS custom properties in `base.css` via Tailwind's `@theme` block,
  keeping the whole UI visually consistent.
- **JavaScript, one file per concern** — `navbar.js` owns navigation
  behavior, `auth.js` owns the auth forms, `events.js`/`clubs.js` own
  their respective discovery pages, and `animations.js` owns scroll
  effects — instead of one large shared script.
- **Accessibility-conscious markup** — skip links, ARIA attributes
  (`aria-expanded`, `aria-controls`, `aria-pressed`, `role="radiogroup"`),
  visible focus states, and `prefers-reduced-motion` support are built
  into the components rather than bolted on.

---

## ☁️ Deployment

This project is deployed on **[Vercel](https://vercel.com/)** as a static
site with a build step, configured via [`vercel.json`](./vercel.json):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend",
  "redirects": [
    { "source": "/", "destination": "/pages/home.html", "permanent": false }
  ]
}
```

On every push, Vercel installs dependencies, runs `npm run build` to
compile `frontend/dist/output.css`, then serves the `frontend/` directory
as the site root — with `/` redirecting to `/pages/home.html`.

To deploy your own copy:
1. Push this repository to your own GitHub account.
2. Import it into [Vercel](https://vercel.com/new).
3. Leave the framework preset as **Other** — `vercel.json` handles the
   rest automatically.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please keep new page-specific styles in their own CSS file and only add
to `components.css` / `card.css` when something is genuinely reused
across multiple pages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE)
file for details.

---

## 👤 Author

**Mitul Upadhyay**

- GitHub: [@mitulupadhyay](https://github.com/mitulupadhyay)
- LinkedIn: _add your LinkedIn URL_
- Portfolio: _add your portfolio URL_
