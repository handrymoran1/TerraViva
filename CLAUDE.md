# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Huellas de la Pola / TerraViva** is a Spanish-language hotel booking website built as a static frontend-only application. No backend, no build tools, no package manager.

## Running the Project

Open any HTML file directly in a browser, or serve with a local static server:

```bash
# Python
python -m http.server 8080

# Node.js (if available)
npx serve .
```

There are no build, lint, or test commands — this is plain HTML/CSS/JS.

## Architecture

### Stack
- HTML5 + CSS3 + vanilla JavaScript (ES6+)
- Bootstrap 5.3 (CDN)
- Formspree for contact form email delivery

### Directory Layout
- `index.html` — landing page (entry point)
- `html/` — all other pages (login, registration, rooms, profile, admin dashboard, contact, about)
- `css/` — one stylesheet per page, named to match its HTML counterpart
- `js/` — one script per page, named to match its HTML counterpart
- `assets/` — images organized by section (habitaciones, fotos_index, logo, etc.)
- `data_base/` — PostgreSQL schema (`terraviva.sql`) and ER diagram; **not connected to the frontend**

### Data Persistence (Client-Side Only)
All state lives in the browser — no backend API exists:
- `localStorage.usuarioLogueado` — currently logged-in user object
- `localStorage.usuarios` — array of all registered users (passwords stored in plain text)
- `sessionStorage` — temporary search filters passed between pages

### Authentication
- Client-side validation only (regex for email/password)
- Hardcoded admin account: `admin@gmail.com` / `Admin123456789*`
- Admin routes to `dashboard.html`; regular users to `perfil_usuario.html`

### Navbar State
Each page JS checks `localStorage.usuarioLogueado` on load to show/hide login vs. logged-in buttons. This pattern repeats across `index.js`, `habitaciones.js`, and others.

### Room Pages
There are 8 individual room detail pages under `html/` (e.g., `habitacion1.html`, `habit_doble_balcon.html`, etc.). Each is a standalone HTML file with its own styling via `css/detalleHabitacion.css`.

## Key Constraints

- **No backend** — the SQL schema in `data_base/` describes the intended data model but is not wired up.
- **No module bundler** — JS files are loaded via `<script>` tags; no imports/exports.
- **Spanish codebase** — variable names, comments, UI text, and git messages are in Spanish.
