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

You MUST return a JSON object with this EXACT structure:
{
  "readme": "the complete README.md markdown content",
  "assets": [
    { "path": "assets/filename.ext", "url": "https://source-url-of-the-image" }
  ]
}

ABOUT THE USER:
- Name: ${p.name} (nickname: ${p.nickname}, handle: ${p.handle})
- Age: ${age}, Location: ${p.location}
- Title: ${p.title}
- Bio: ${p.bio}
- Fun Fact: ${p.funFact}
- Email: ${p.email}
- Dog: ${p.dog}
- Tags: ${(p.tags || []).join(', ')}

SOCIAL:
${JSON.stringify(s, null, 2)}

SKILLS:
${JSON.stringify(sk, null, 2)}

PROJECTS:
${JSON.stringify(pr, null, 2)}

GAMES:
${JSON.stringify(g, null, 2)}

EXPERIENCE:
${JSON.stringify(ex, null, 2)}

EDUCATION:
${JSON.stringify(ed, null, 2)}

ERA ID for this version: ${nextId}

GUIDELINES FOR THE README:
1. Style: Creative & Technical — colorful badges, stats cards, mix of tech personality with professional layout.
2. The README will be displayed on github.com/MCookinho/MCookinho.
3. Use <div align="center"> for centered sections.
4. Use shields.io badges where appropriate (social links, skills, tools).
5. GitHub Stats cards: use theme=tokyonight for consistency.
6. Avatar URL: ${p.avatarUrl || 'https://mcookinho.github.io/assets/images/avatar.png'}
7. Use emojis tastefully.
8. Profile views counter: https://komarev.com/ghpvc/?username=${s.github}

ASSETS GUIDELINES:
- You can include images/GIFs from the internet by listing them in the "assets" array.
- Each asset has a "path" (where it will be saved in the repo) and "url" (where to download it FROM).
- In the README, reference assets using RELATIVE paths like: ![alt](assets/filename.ext)
- Assets folder is at the root of the profile repo: MCookinho/MCookinho/assets/
- Download URLs should be direct image links (ending in .png, .jpg, .gif, .webp, .svg, or known image CDN URLs).
- Prefer high-quality, relevant images. You can use:
  * Project screenshots from GitHub repos
  * GIF demonstrations from tech blogs
  * Profile-related imagery
- Keep total assets under 5 to avoid clutter.
- Each asset filename should be descriptive (e.g., "banner.png", "project-demo.gif").

CRITICAL RULES:
- Return ONLY valid JSON. No text outside the JSON object.
- The README markdown goes in the "readme" field as a string.
- Asset download list goes in the "assets" array.
- If you don't need any assets, return an empty array: "assets": []
- Use \\n for newlines in the readme string.
- The readme MUST be complete, production-quality, and visually stunning.`
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

  // Ensure assets dir exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true })
  }

  // Download assets
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

  // Archive old files
  const archived = archiveCurrent(nextId, createdDate, oldReadme)

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
