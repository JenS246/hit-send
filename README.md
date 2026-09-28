# HIT SEND?

A tiny, fast educational web game about email judgment in legal work. Each round shows one email, asks the player to choose `SEND` or `DON'T SEND`, and gives immediate practical feedback.

## How it works

- Each playthrough selects 4 safe-to-send and 6 do-not-send scenarios, then shuffles all 10.
- Players can use the buttons or press `S` and `D`.
- Feedback explains the practical issue in one or two short sentences.
- The game covers recipients, attachments, tone, confidentiality, Reply All, forwarding, and emails as possible evidence.
- All game state is local to the page. There is no tracking, account, backend, or stored player data.

## Run locally

No build step or dependencies are required.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deployment

The static site is configured for GitHub Pages through `.github/workflows/pages.yml`.

- Frontend: `https://jens246.github.io/hit-send/`
- Source: `https://github.com/JenS246/hit-send`
- Backend: none
- Data location: scenarios are stored in `game.js`
- Backup and restore: clone the GitHub repository; there is no runtime data to restore

Pushes to `main` publish automatically after Pages is enabled with **GitHub Actions** as the source.

## Project files

- `index.html`: accessible game structure
- `styles.css`: responsive visual design, dark mode, and reduced-motion support
- `game.js`: scenarios, shuffle logic, scoring, and keyboard controls

## Content notes

The scenarios teach practical habits, not jurisdiction-specific legal rules. They avoid nuanced privilege and ethics questions that cannot fairly be answered with a simple yes or no.
