<div align="center">
  <h1>🍪 MCookinho.github.io</h1>
  <strong>Portfolio / Terminal Aesthetic Personal Site</strong>
  <br><br>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions"/>
</div>

---

## 📋 About

Personal website slash portfolio with a retro terminal/pixel aesthetic. Includes an interactive NES controller, a music player, a chat with my dog Shiva (powered by AI), achievement system, rankings, and more.

Also features an **AI-powered pipeline** that syncs my GitHub profile README (`MCookinho/MCookinho`) with the latest data from this site — no manual updates needed.

---

## 🧩 Sections

| Section | Description |
|---|---|
| **Hero** | Intro with name, age, location, and social links |
| **About** | Bio + interactive NES controller + **Shiva Chat** (AI dog) |
| **Skills** | Languages, tools, and life skills |
| **Projects** | Open source project cards |
| **Games** | Indie games published on itch.io |
| **Music** | My personal music library with player |
| **Achievements** | Gamified milestones |
| **Rankings** | Movie, series, and game rankings |
| **Contact** | Social links and email |

---

## 🎨 Design

- **Font:** Press Start 2P (pixel/retro)
- **Colors:** Dark theme with pink (`#ff2d78`), cyan (`#00ffc8`), and purple (`#a855f7`) accents
- **CRT overlay** scanline effect
- **Responsive** layout with mobile navigation

---

## 🧠 Stack

All vanilla — no frameworks, no build tools, no dependencies.

```
HTML5  →  Structure & semantics
CSS3   →  Styling, animations, pixel aesthetic
JS     →  Interactivity, AI chat, music player, i18n
```

---

## 🤖 AI Integration

### Shiva Chat (`shiva.js`)
AI-powered chatbot that responds as my Golden Retriever using the GitHub Models API (`mistral-ai/mistral-medium-2505-v1`).

### Profile Sync Pipeline (`.github/workflows/sync-readme.yml`)
Triggered on push to `main`, this workflow:

1. **Extracts** profile data from the site using AI
2. **Commits** the structured data to `data/profile.json`
3. **Generates** a polished GitHub profile README with AI
4. **Pushes** it to [`MCookinho/MCookinho`](https://github.com/MCookinho/MCookinho)

The result: my GitHub profile stays in sync with my site automatically.

---

## 🗂️ Project Structure

```
├── index.html          # Main page
├── style.css           # Everything CSS (2.6k lines)
├── script.js           # Core interactivity
├── lang.js             # i18n (PT-BR / EN)
├── shiva.js            # AI dog chat
├── horror.js           # Horror game
├── tetris.js           # Tetris game
├── player.js           # Music player
├── assets/
│   ├── favicon.png
│   ├── fotominha.jpeg
│   ├── games/
│   ├── sound/
│   └── videos/
├── data/
│   ├── profile.json    # Structured profile data (AI-generated)
│   └── rankings/       # Movie/series/game rankings
├── scripts/
│   ├── ai-extract-profile.js    # AI extraction prompt
│   ├── ai-generate-readme.js    # AI README generation prompt
│   └── sort-rankings.py         # Ranking sorter
├── professional/       # Resumé data
└── .github/workflows/
    ├── sync-readme.yml          # AI profile sync
    └── sort-rankings.yml        # Ranking auto-sort
```

---

## 🌐 i18n

- **PT-BR** (default)
- **EN**

Controlled via `lang.js` — uses `data-i18n` attributes and the `__()` global function.

---

## 🚀 Running Locally

Just serve the root directory:

```bash
npx serve .
# or
python3 -m http.server 8000
```

---

## 📄 License

MIT — feel free to use as inspiration (but maybe don't clone my entire identity, that'd be weird).
