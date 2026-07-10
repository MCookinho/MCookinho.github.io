#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const SITE_DIR = process.env.SITE_DIR || path.join(__dirname, '..')
const DATA_FILE = path.join(SITE_DIR, 'data', 'profile.json')
const PROFILE_DIR = process.env.PROFILE_DIR || SITE_DIR
const README_FILE = process.env.README_FILE || path.join(PROFILE_DIR, 'README.md')
const HISTORY_DIR = process.env.HISTORY_DIR || path.join(PROFILE_DIR, 'History')
const ASSETS_DIR = process.env.ASSETS_DIR || path.join(PROFILE_DIR, 'assets')

const SKILL_COLORS = {
  'Python': '3776AB', 'JavaScript': 'F7DF1E', 'Bash': '4EAA25',
  'TypeScript': '3178C6', 'SQL': 'CC2927', 'C / C++': '00599C',
  'GML': '69C3D0', 'Java': 'ED8B00', 'C#': '512BD4',
  'Git': 'F05032', 'Linux': 'FCC624', 'ncurses': '00ADD8',
  'AWS': 'FF9900', 'Docker': '2496ED', 'FL Studio': 'FF6600',
  'Godot': '478CBF', 'MongoDB': '47A248', 'Unity': '555555',
  'Arduino': '00979D', 'GameMaker': '71B142', 'Google Cloud': '4285F4',
}

const SKILL_LOGOS = {
  'Python': 'python', 'JavaScript': 'javascript', 'Bash': 'gnubash',
  'TypeScript': 'typescript', 'SQL': 'postgresql', 'C / C++': 'cplusplus',
  'GML': 'game--maker', 'Java': 'openjdk', 'C#': 'csharp',
  'Git': 'git', 'Linux': 'linux', 'ncurses': 'gnu',
  'AWS': 'amazonwebservices', 'Docker': 'docker', 'FL Studio': 'image--alt',
  'Godot': 'godotengine', 'MongoDB': 'mongodb', 'Unity': 'unity',
  'Arduino': 'arduino', 'GameMaker': 'gamemaker', 'Google Cloud': 'googlecloud',
}

const SOCIAL_CFG = [
  { key: 'github',    label: 'GitHub',     color: '100000', logo: 'github',    url: v => `https://github.com/${v}` },
  { key: 'linkedin',  label: 'LinkedIn',   color: '0077B5', logo: 'linkedin',  url: v => `https://linkedin.com/in/${v}` },
  { key: 'instagram', label: 'Instagram',  color: 'E4405F', logo: 'instagram', url: v => `https://instagram.com/${v}` },
  { key: 'twitter',   label: 'Twitter',    color: '1DA1F2', logo: 'twitter',   url: v => `https://x.com/${v}` },
  { key: 'youtube',   label: 'YouTube',    color: 'FF0000', logo: 'youtube',   url: v => `https://youtube.com/${v}` },
  { key: 'twitch',    label: 'Twitch',     color: '9146FF', logo: 'twitch',    url: v => `https://twitch.tv/${v}` },
  { key: 'itchio',    label: 'itch.io',    color: 'FA5C5C', logo: 'itchdotio', url: v => `https://${v}.itch.io` },
]

function fmtDateReadable(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

function getNextId() {
  let maxId = 0
  if (fs.existsSync(HISTORY_DIR)) {
    for (const f of fs.readdirSync(HISTORY_DIR)) {
      const m = f.match(/^ARCHIVE\((\d+)\)/)
      if (m) maxId = Math.max(maxId, parseInt(m[1]))
    }
  }
  return maxId + 1
}

function getCurrentReadme() {
  try {
    if (fs.existsSync(README_FILE)) return fs.readFileSync(README_FILE, 'utf-8')
  } catch (e) {}
  return null
}

function getCreatedDate(oldReadme) {
  const m = oldReadme && oldReadme.match(/<!-- GENERATED\s+id=(\d+)\s+created=(\d{2}\/\d{2}\/\d{4})\s*-->/)
  if (m) return m[2]
  try {
    const stat = fs.statSync(README_FILE)
    return fmtDateReadable(stat.mtime)
  } catch (e) {
    return fmtDateReadable(new Date())
  }
}

function getExistingAssets() {
  try {
    if (fs.existsSync(ASSETS_DIR)) return fs.readdirSync(ASSETS_DIR)
  } catch (e) {}
  return []
}

function archiveCurrent(id, createdDate, oldReadme) {
  if (!oldReadme && getExistingAssets().length === 0) return false

  if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true })
  const assetsHistory = path.join(HISTORY_DIR, 'assets')
  if (!fs.existsSync(assetsHistory)) fs.mkdirSync(assetsHistory, { recursive: true })

  const now = new Date()
  const archivedStr = fmtDateReadable(now)

  if (oldReadme) {
    const safeCreated = createdDate.replaceAll('/', '_')
    const safeArchived = archivedStr.replaceAll('/', '_')
    const readmeName = `ARCHIVE(${id})   [${safeCreated}] -> [${safeArchived}].md`
    fs.writeFileSync(path.join(HISTORY_DIR, readmeName), oldReadme, 'utf-8')
    console.log(`[archive] README → ${readmeName}`)
  }

  if (fs.existsSync(ASSETS_DIR)) {
    for (const file of fs.readdirSync(ASSETS_DIR)) {
      const src = path.join(ASSETS_DIR, file)
      if (!fs.statSync(src).isFile()) continue
      const ext = path.extname(file)
      const name = path.basename(file, ext)
      const destName = `"${name}"(${id})${ext}`
      fs.renameSync(src, path.join(assetsHistory, destName))
      console.log(`[archive] Asset → ${destName}`)
    }
  }
  return true
}

function shieldBadge(label, message, color, logo) {
  const l = encodeURIComponent(label)
  const m = encodeURIComponent(message)
  const c = encodeURIComponent(color)
  const lo = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : ''
  return `![${label}](${"https://img.shields.io/badge/" + l + "-" + m + "-" + c + "?style=for-the-badge" + lo})`
}

function socialBadges(social) {
  return SOCIAL_CFG
    .filter(cfg => social[cfg.key])
    .map(cfg => {
      const img = `https://img.shields.io/badge/${encodeURIComponent(cfg.label)}-${cfg.color}?style=for-the-badge&logo=${cfg.logo}&logoColor=white`
      const link = cfg.url(social[cfg.key])
      return `[![${cfg.label}](${img})](${link})`
    })
    .join(' ')
}

function levelEmoji(pct) {
  if (pct >= 85) return '🟢'
  if (pct >= 60) return '🟡'
  if (pct >= 40) return '🟠'
  return '🔴'
}

function statsCards(username) {
  const base = 'https://github-readme-stats.vercel.app/api'
  return `<div align="center">
  <img height="180em" src="${base}?username=${username}&theme=tokyonight&show_icons=true&count_private=true&include_all_commits=true"/>
  <img height="180em" src="${base}/top-langs/?username=${username}&theme=tokyonight&layout=compact&langs_count=8"/>
</div>`
}

function generateReadme(profile) {
  const p = profile.personal
  const s = profile.social
  const sk = profile.skills
  const pr = profile.projects || []
  const g = profile.games || []
  const ex = profile.experience || []
  const ed = profile.education || []
  const st = profile.status || {}
  const now = new Date()

  const nextId = getNextId()

  const tags = (p.tags || []).map(t => `\`${t}\``).join(' ')

  const langBadges = (sk.languages || []).map(l =>
    `  ${shieldBadge(l.name, `${l.pct}%`, SKILL_COLORS[l.name] || (l.pct >= 70 ? '2EA043' : l.pct >= 40 ? 'D29922' : '8B949E'), SKILL_LOGOS[l.name])}`
  ).join('\n')

  const toolBadges = (sk.tools || []).map(t =>
    `  ${shieldBadge(t.name, `${t.pct}%`, SKILL_COLORS[t.name] || (t.pct >= 70 ? '2EA043' : t.pct >= 40 ? 'D29922' : '8B949E'), SKILL_LOGOS[t.name])}`
  ).join('\n')

  const projectsSection = pr.map(proj => {
    const langBadge = shieldBadge(proj.lang, '', '555555', SKILL_LOGOS[proj.lang])
    const tagBadge = proj.badge ? shieldBadge(proj.badge, '', 'D29922') : ''
    const badges = [langBadge, tagBadge].filter(Boolean).join(' ')
    return `### [${proj.name}](${proj.url})
${proj.desc}
${badges}
`
  }).join('\n')

  const gamesSection = g.map(game =>
    `### [${game.name}](${game.url})
${game.desc}
`
  ).join('\n')

  const socialSection = socialBadges(s)

  const learningList = (st.currentlyLearning || []).map(l => `  - ${l}`).join('\n')
  const dogLine = p.dog ? `\n🐶 **Dog:** ${p.dog}` : ''
  const funFactLine = p.funFact ? `\n💡 **Fun Fact:** ${p.funFact}` : ''

  const experienceSection = ex.length > 0
    ? `### 💼 Experience\n${ex.map(e => `**${e.role}** @ ${e.org} — *${e.period}*\n\n${e.desc}\n`).join('\n')}\n`
    : ''
  const educationSection = ed.length > 0
    ? `### 🎓 Education\n${ed.map(e => `**${e.course}** — ${e.institution} (*${e.period}*)\n\n${e.desc}\n`).join('\n')}\n`
    : ''

  const header = `<!-- GENERATED id=${nextId} created=${fmtDateReadable(now)} -->`

  return `${header}

<div align="center">
  <img src="${p.avatarUrl}" alt="${p.name}" width="180" style="border-radius: 50%;"/>
  <h1>🚀 ${p.name}</h1>
  <p><strong>${p.title}</strong></p>
  <p>📍 ${p.location} &nbsp;|&nbsp; 📧 <a href="mailto:${p.email}">${p.email}</a></p>
  ${tags}
</div>

<br>

<div align="center">
  ${socialSection}
</div>

---

## 👨‍💻 About Me

${p.shortBio}
${dogLine}${funFactLine}

<br>

**🔭 Currently working on:** ${st.currentlyWorkingOn || 'N/A'}

**🌱 Currently learning:**
${learningList || '  N/A'}

---

## 🧠 Tech Stack

### Languages
<p align="left">
${langBadges}
</p>

### Tools & Frameworks
<p align="left">
${toolBadges}
</p>

---

## 📊 GitHub Analytics

${statsCards(s.github)}

---

## 🚧 Featured Projects

${projectsSection}
${experienceSection}
${educationSection}
---

## 🎮 Game Projects

${gamesSection}

---

## 📫 Let's Connect!

<div align="center">
  ${socialSection}
  <br><br>
  <img src="https://komarev.com/ghpvc/?username=${s.github}&color=blueviolet&style=flat-square&label=Profile+Views" alt="Profile views"/>
</div>

<br>

<details>
<summary>📜 README History</summary>
<br>
This README is automatically generated from <code>profile.json</code>.
<br><br>
Last updated: ${fmtDateReadable(now)}
</details>
`
}

async function main() {
  console.log('[gen-readme] === README Generator ===')

  let profile
  try {
    profile = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    console.log('[gen-readme] Loaded profile.json v' + (profile.version || '?'))
  } catch (e) {
    console.error('[gen-readme] Failed to load profile.json:', e.message)
    process.exit(1)
  }

  const nextId = getNextId()
  const oldReadme = getCurrentReadme()
  const createdDate = getCreatedDate(oldReadme)

  console.log('[gen-readme] Next archive ID:', nextId)
  console.log('[gen-readme] Current created date:', createdDate)

  const archived = archiveCurrent(nextId, createdDate, oldReadme)
  if (archived) console.log('[gen-readme] Archived previous version')

  const readme = generateReadme(profile)
  fs.writeFileSync(README_FILE, readme, 'utf-8')
  console.log('[gen-readme] Wrote README.md (' + readme.length + ' chars)')

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes=true\n')
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'change_count=1\n')
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'era_id=' + nextId + '\n')
  }

  console.log('[gen-readme] ✓ Done')
}

main().catch(e => {
  console.error('[gen-readme] Fatal:', e.message)
  process.exit(1)
})
