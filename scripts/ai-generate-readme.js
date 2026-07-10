#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')

const MODEL = process.env.AI_MODEL || 'Mistral-large'
const TOKEN = process.env.GITHUB_TOKEN
const API_URL = 'https://models.github.ai/inference/chat/completions'
const SITE_DIR = process.env.SITE_DIR || path.join(__dirname, '..')
const DATA_FILE = path.join(SITE_DIR, 'data', 'profile.json')
const PROFILE_DIR = process.env.PROFILE_DIR || SITE_DIR
const README_FILE = process.env.README_FILE || path.join(PROFILE_DIR, 'README.md')
const ASSETS_DIR = process.env.ASSETS_DIR || path.join(PROFILE_DIR, 'assets')
const HISTORY_DIR = process.env.HISTORY_DIR || path.join(PROFILE_DIR, 'History')

let changes = []

function fmtDate(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}_${pad(d.getMonth() + 1)}_${d.getFullYear()}`
}

function fmtDateReadable(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

function fmtDateSafe(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}_${pad(d.getMonth() + 1)}_${d.getFullYear()}`
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

  // Archive README
  if (oldReadme) {
    const safeCreated = createdDate.replaceAll('/', '_')
    const safeArchived = archivedStr.replaceAll('/', '_')
    const readmeName = `ARCHIVE(${id})   [${safeCreated}] -> [${safeArchived}].md`
    fs.writeFileSync(path.join(HISTORY_DIR, readmeName), oldReadme, 'utf-8')
    console.log(`[archive] README → ${readmeName}`)
  }

  // Archive assets
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

  changes.push(`Archived era ${id} (${createdDate} → ${archivedStr})`)
  return true
}

function downloadAsset(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    proto.get(url, { headers: { 'User-Agent': 'MCookinho-readme-sync' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadAsset(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => {
        file.close()
        const size = fs.statSync(dest).size
        if (size === 0) {
          fs.unlinkSync(dest)
          return reject(new Error('Empty file'))
        }
        resolve(size)
      })
      file.on('error', (e) => { fs.unlinkSync(dest); reject(e) })
    }).on('error', reject)
  })
}

function callAPI(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 8192,
    })

    const u = new URL(API_URL)
    const opts = {
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + TOKEN,
        'Content-Length': Buffer.byteLength(body),
      },
    }

    const req = https.request(opts, (res) => {
      let data = ''
      res.on('data', (c) => data += c)
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API ${res.statusCode}: ${data.slice(0, 500)}`))
        }
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error('Failed to parse API response')) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function buildPrompt(profile, nextId) {
  const p = profile.personal
  const s = profile.social
  const sk = profile.skills
  const pr = profile.projects
  const g = profile.games
  const ex = profile.experience || []
  const ed = profile.education || []

  const birth = new Date(p.birthDate || '2005-04-18')
  const now = new Date()
  const age = Math.floor((now - birth) / (365.25 * 86400000))

  return `You are a professional README designer for a GitHub profile.

Return a JSON object with this EXACT structure:
{
  "readme": "the complete README.md content",
  "assets": [
    { "path": "assets/filename.ext", "url": "https://source-url-of-the-image" }
  ]
}

---

USER DATA:
- Display name: ${p.nickname} (@${p.handle})
- Full name: ${p.name} | Age: ${age} | Location: ${p.location}
- Title: ${p.title}
- Short bio: ${p.shortBio}
- Bio: ${p.bio}
- Email: ${p.email}
- Avatar: ${p.avatarUrl}
- Dog: ${p.dog} (only mention briefly in About Me if it fits naturally)
- Fun Fact: ${p.funFact} (DO NOT include — skip entirely)

SOCIAL (all platforms):
${JSON.stringify(s, null, 2)}

SKILLS (sorted by proficiency descending):
${JSON.stringify(sk, null, 2)}

PROJECTS:
${JSON.stringify(pr, null, 2)}

GAMES:
${JSON.stringify(g, null, 2)}

EXPERIENCE:
${JSON.stringify(ex, null, 2)}

EDUCATION:
${JSON.stringify(ed, null, 2)}

ERA ID: ${nextId}

---

MANDATORY STRUCTURE — follow this EXACT order and style:

1️⃣ HEADER
<div align="center">
  <img src="{avatarUrl}" width="180" style="border-radius: 50%;"/>
  <h1>🚀 {nickname} <em>(@{handle})</em></h1>
  <strong>{title}</strong>
  <br>
  📍 {location} | 📧 {email}
  <br><br>
  [ROW OF SOCIAL BADGES — use shields.io for ALL platforms from the SOCIAL data above]
  Format: [![Platform](https://img.shields.io/badge/Platform-COLOR?style=for-the-badge&logo=LOGO&logoColor=white)](URL)
  Include EVERY social platform present in the data. Determine correct logo slug and brand color for each.
  If a platform logo is unknown, use a generic badge with the platform name.
</div>

2️⃣ ABOUT ME
Short paragraph (1-3 lines max, concise and professional).
Use shortBio as the core. Mention dog briefly if it fits naturally.
Then:
**🔭 Currently:** {currentlyWorkingOn}
**🌱 Learning:** {currentlyLearning as inline list}

No fun fact, no tags, no fluff.

3️⃣ SKILLS
### 🧠 Languages
<p align="left">
  [Row of shields.io badges — one per language, with proficiency % and logo]
  Format: ![Name](https://img.shields.io/badge/Name-PCT%25-COLOR?style=for-the-badge&logo=LOGO&logoColor=white)
  Determine the best logo slug and brand color for each language.
</p>

### 🛠 Tools & Frameworks
<p align="left">
  [Same format as Languages]
</p>

4️⃣ GITHUB STATS
<div align="center">
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${s.github}&theme=tokyonight"/>
  <br><br>
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${s.github}&theme=tokyonight"/>
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${s.github}&theme=tokyonight"/>
</div>

5️⃣ PROJECTS
For each project:
### [{name}]({url})
{description}

[Language badge] [Status badge if BETA/ALPHA]

Optionally use GitHub pin cards:
[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=${s.github}&repo={REPO_NAME}&theme=tokyonight)]({url})

6️⃣ GAMES
For each game:
### [{name}]({url})
{description}

[![Play](https://img.shields.io/badge/Play-{name}-7289DA?style=for-the-badge&logo=itchdotio&logoColor=white)]({url})

7️⃣ EXPERIENCE & EDUCATION
### 💼 Experience
{role} @ {org} — *{period}*
{description}

### 🎓 Education
{course} — {institution} (*{period}*)
{description}

8️⃣ CONTACT / FOOTER
<div align="center">
  [Compact social badges row or just icons]
  <br>
  <img src="https://komarev.com/ghpvc/?username=${s.github}&color=blueviolet&style=flat-square&label=Profile+Views"/>
</div>

<details>
<summary>📜 History</summary>
Auto-generated from profile.json | Era ${nextId}
</details>

---

VISUAL GUIDELINES:
- Clean, modern, professional. Think "tech portfolio" aesthetic.
- Use <div align="center"> for centered blocks, <p align="left"> for badge rows.
- Shields.io badges: prefer "for-the-badge" style. Choose accurate brand colors.
- Stats cards: ALWAYS use github-profile-summary-cards with theme=tokyonight. Never use github-readme-stats (broken service).
- Emojis: use sparingly as section headers. Prefer: 🚀, 🧠, 🛠, 📊, 💼, 🎓, 🎮, 📫.
- Horizontal rules (---) between major sections.
- NO FUN FACT, NO TAGS in the README body. Omit completely.
- Keep header name as "{nickname} (@{handle})" — never the full name.

ASSETS GUIDELINES:
- Include 0-3 assets max. Only if they genuinely enhance the README.
- Good sources: avatar URL (already given), project screenshots from GitHub repos, relevant GIFs from GIPHY or tech blogs.
- Each asset: { "path": "assets/descriptive-name.png", "url": "direct-image-link" }
- Reference assets in README with RELATIVE paths: ![alt](assets/file.png)
- Prefer direct image links ending in .png, .jpg, .gif, .webp, .svg.
- If no good assets found, return empty array "assets": [].

CRITICAL:
- Return ONLY valid JSON. No explanation, no markdown outside the JSON.
- The "readme" field contains the FULL markdown string. Escape newlines as \\n.
- The "assets" array lists files to download. Empty array if none.
- Every social platform in the data MUST appear in the social badges section.
- Determine correct shields.io logo slugs and brand hex colors for all platforms and skills.
- Be extremely careful with JSON escaping — all double quotes inside the readme must be escaped.
- The output README must be COMPLETE, production-quality, and visually stunning.`
}

async function main() {
  console.log('[readme-ai] === AI README Generator ===')
  console.log('[readme-ai] Model:', MODEL)

  if (!TOKEN) {
    console.error('[readme-ai] No GITHUB_TOKEN found. Cannot generate README.')
    process.exit(1)
  }

  // Load profile
  let profile
  try {
    profile = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    console.log('[readme-ai] Loaded profile.json v' + (profile.version || '?'))
  } catch (e) {
    console.error('[readme-ai] Failed to load profile.json:', e.message)
    process.exit(1)
  }

  const nextId = getNextId()
  const oldReadme = getCurrentReadme()
  const createdDate = getCreatedDate(oldReadme)
  const existingAssets = getExistingAssets()

  console.log('[readme-ai] Next archive ID:', nextId)
  console.log('[readme-ai] Current created date:', createdDate)
  console.log('[readme-ai] Existing assets:', existingAssets.length)

  // Generate README via AI
  const prompt = buildPrompt(profile, nextId)
  console.log('[readme-ai] Calling Mistral Large...')

  let result
  try {
    result = await callAPI([
      { role: 'system', content: 'You are a professional README designer. Return ONLY valid JSON.' },
      { role: 'user', content: prompt },
    ])
  } catch (e) {
    console.error('[readme-ai] API call failed:', e.message)
    process.exit(1)
  }

  const content = result.choices?.[0]?.message?.content
  if (!content) {
    console.error('[readme-ai] Empty response from model')
    process.exit(1)
  }

  let response
  try {
    response = JSON.parse(content)
  } catch (e) {
    console.error('[readme-ai] Failed to parse model response as JSON:', e.message)
    process.exit(1)
  }

  if (!response.readme) {
    console.error('[readme-ai] Response missing "readme" field')
    process.exit(1)
  }

  // Archive old files BEFORE downloading new ones
  const archived = archiveCurrent(nextId, createdDate, oldReadme)

  // Ensure assets dir exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true })
  }

  // Download new assets (stays in assets/ — NOT archived until next run)
  const assets = response.assets || []
  let downloaded = 0
  for (const asset of assets) {
    if (!asset.path || !asset.url) continue
    const destPath = path.join(PROFILE_DIR, asset.path)
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

    try {
      const size = await downloadAsset(asset.url, destPath)
      console.log(`[readme-ai] Downloaded ${asset.path} (${size} bytes)`)
      downloaded++
    } catch (e) {
      console.warn(`[readme-ai] Failed to download ${asset.url}: ${e.message}`)
    }
  }

  // Write header
  const now = new Date()
  const header = `<!-- GENERATED id=${nextId} created=${fmtDateReadable(now)} -->\n`
  const readmeContent = header + response.readme

  // Update any asset references if needed
  let finalReadme = readmeContent

  fs.writeFileSync(README_FILE, finalReadme, 'utf-8')
  console.log('[readme-ai] Wrote README.md (' + finalReadme.length + ' chars)')

  changes.push(`README generated (era ${nextId})`)
  if (downloaded > 0) changes.push(`Downloaded ${downloaded} assets`)

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes=true\n')
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'change_count=' + changes.length + '\n')
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'era_id=' + nextId + '\n')
  }

  console.log('[readme-ai] Changes:')
  changes.forEach(c => console.log('  • ' + c))
  console.log('[readme-ai] ✓ Done')
}

main().catch(e => {
  console.error('[readme-ai] Fatal:', e.message)
  process.exit(1)
})
