# 🌲 Woodland Conservation Area Website

**Team Init · CSCI 3428 Software Engineering · Saint Mary's University · Fall 2026**

A website for the St. Margaret's Bay Area Woodland Conservation Site (71 St. Pauls Lane, French Village, NS). It shares the woodland's history and ecology, and guides visitors around the trail with an interactive map.

Built on the code base from Group 26G (AAADM-conservation), which we're extending this term.

---

## 👥 Team

| Name | Role |
|---|---|
| Sumit Ahmed | Team Lead (alternating sprints) |
| Navneet Kaur | Team Lead (alternating sprints) |
| Hafsa Zubair | Developer |
| Jazrel Bueno | Developer |
| Aroll Dean | Developer |

---

## 🛠 Tech Stack

- **React 18** + **Vite** for the site
- **Tailwind CSS** for styling, including dark mode
- **React Router** for page navigation
- **Leaflet** for the trail map
- **Open-Meteo** for the weather widget (no key needed)
- **Cypress** for end-to-end and component tests

---

## 🚀 Getting Started

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
git clone https://github.com/SumitAhmed005/Woodland-Conservation---Team-Init.git
cd Woodland-Conservation---Team-Init
npm install
npm run dev
```

Then open **http://localhost:5173**.

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site locally |
| `npm run build` | Builds the site for the server |
| `npm run cypress:open` | Opens Cypress to run tests |

> Always run commands from **inside the project folder**, never from your home folder.

---

## 📁 Project Structure

```
src/
├── App.jsx              Page routes (which URL shows which page)
├── main.jsx             Starting point of the app
├── index.css            Global styles
│
├── appearance/          🌗 Dark and light theme
│   ├── useDarkMode.js       Theme switch logic
│   ├── GlassPanels.jsx      Frosted-glass panels around each page
│   └── backgrounds/         darkmode.jpg, lightmode.jpg
│
├── layout/              🧭 Shown on every page
│   ├── Navigation.jsx       Nav bar and dark mode toggle button
│   └── Footer.jsx
│
├── pages/               📄 One file per page
│   ├── Homepage.jsx         /
│   ├── About.jsx            /about
│   ├── Gallery.jsx          /gallery
│   ├── Ecology.jsx          /ecology
│   ├── Contact.jsx          /contact
│   ├── Sitemap.jsx          /sitemap (trail map)
│   ├── NaturalBurial.jsx    /natural-burial
│   └── Shop.jsx             /shop
│
├── widgets/             ⛅ Small pieces used inside pages
│   └── WeatherWidget.jsx
│
├── data/                🗂 Content stored as data
│   ├── ecologydata.json     Species list for the Ecology page
│   └── map.json             Trail map spots, areas and GPS settings
│
├── utils/
│   └── geo.js               GPS distance helper
│
└── assets/              🖼 Images used in pages (about/, ecologyimages/, Shop/)

public/
├── audio/               🔊 Trail audio clips
└── images/, icons, logo

cypress/
├── e2e/                 🧪 Full-page tests
└── component/           🧪 Tests for single components
```

---

## 🔎 Quick Find

| I want to change… | Go to |
|---|---|
| Dark / light theme | `src/appearance/` |
| The toggle button | `src/layout/Navigation.jsx` |
| Nav bar links | `src/layout/Navigation.jsx` |
| Footer | `src/layout/Footer.jsx` |
| A page's content | `src/pages/<PageName>.jsx` |
| Add a new page | New file in `src/pages/`, then add a route in `src/App.jsx` |
| Species on the Ecology page | `src/data/ecologydata.json` |
| Trail map spots | `src/data/map.json` |
| Weather widget | `src/widgets/WeatherWidget.jsx` |
| Trail audio | `public/audio/` |
| Page images | `src/assets/` |

---

## 🧪 Testing

Tests live in `cypress/`. Name new test files after what they test, for example `cypress/e2e/language.cy.js`.

```bash
npm run dev            # in one terminal
npm run cypress:open   # in another
```

---

## 🔒 Rules

- **Never commit `.env`** or any API keys. `.gitignore` already blocks it, so keep it that way.
- **Don't push `node_modules`.** Everyone rebuilds it with `npm install`.
- Pull before you start working: `git pull`
- Write clear commit messages: `git commit -m "Add language toggle to nav bar"`
- **Jira:** Task type only, one person per task, no subtasks. Last line of the description shows who did it and how long, like `Sumit: 2 hours`.

---

## 🙏 Credits

Original code base by **Group 26G** (AAADM-conservation), CSCI 3428 Fall 2025. Restructured and extended by Team Init.
