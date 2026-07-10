#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const PROFILE_REPO = process.env.PROFILE_REPO || 'MCookinho/MCookinho'
const SITE_URL = process.env.SITE_URL || 'https://mcookinho.github.io'
const HISTORY_DIR = process.env.HISTORY_DIR || 'History'
const README_FILE = process.env.README_FILE || 'README.md'
const DATA_FILE = path.join(__dirname, '..', 'data', 'profile.json')
const SITE_DIR = path.join(__dirname, '..')

let profile = null
let changes = []

function loadProfile() {
  try {
    profile = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    console.log('[sync] Loaded profile.json v' + (profile.version || '?'))
  } catch (e) {
    console.warn('[sync] Warning: Could not load profile.json, falling back to HTML parsing. ' + e.message)
    profile = extractFromSiteFiles()
  }
}

function extractFromSiteFiles() {
  const htmlPath = path.join(SITE_DIR, 'index.html')
  const jsPath = path.join(SITE_DIR, 'script.js')
  const profJsPath = path.join(SITE_DIR, 'professional', 'script.js')

  let html = ''
  let js = ''
  let profJs = ''
  try { html = fs.readFileSync(htmlPath, 'utf-8') } catch (e) {}
  try { js = fs.readFileSync(jsPath, 'utf-8') } catch (e) {}
  try { profJs = fs.readFileSync(profJsPath, 'utf-8') } catch (e) {}

  console.log('[sync] Fallback: extracting data from source files')

  const extract = {
    version: 1,
    personal: { name: 'Peu Borges', nickname: 'Peu Borges', handle: 'MisterCookie', age: 20, location: 'Salvador, BA, Brazil', bio: '', shortBio: '', email: '', funFact: '' },
    social: {},
    status: { currentlyLearning: [], currentlyWorkingOn: '', currentFocus: '' },
    skills: { languages: [], tools: [] },
    projects: [],
    games: [],
    experience: [],
    education: []
  }

  const emailMatch = profJs.match(/email:\s*'([^']+)'/)
  if (emailMatch) extract.personal.email = emailMatch[1]

  const nameMatch = profJs.match(/name:\s*'([^']+)'/)
  if (nameMatch) extract.personal.name = nameMatch[1]

  const aboutMatch = profJs.match(/about:\s*'([^']+)'/)
  if (aboutMatch) extract.personal.bio = aboutMatch[1]

  const githubMatch = profJs.match(/github:\s*'([^']+)'/)
  if (githubMatch) extract.social.github = githubMatch[1].replace('github.com/', '')

  const linkedinMatch = profJs.match(/linkedin:\s*'([^']+)'/)
  if (linkedinMatch) extract.social.linkedin = linkedinMatch[1].replace('linkedin.com/in/', '')

  const skillMatches = js.matchAll(/('?\w+'?)\s*:\s*\{[^}]*desc:\s*'([^']+)'[^}]*pct:\s*(\d+)/g)
  for (const m of skillMatches) {
    const name = m[1].replace(/'/g, '')
    const pct = parseInt(m[3])
    if (['CAF\u00C9 EXTREMO', 'C\u00D3DIGO 3AM', 'TERMINAL', 'CAOS ORGANIZADO'].includes(name)) continue
    const category = ['PYTHON', 'JAVA', 'JAVASCRIPT', 'TYPESCRIPT', 'C', 'C++', 'C#', 'BASH', 'GML', 'SQL'].includes(name) ? 'languages' : 'tools'
    extract.skills[category].push({ name: name.replace(/_/g, ' '), pct })
  }

  const projRegex = /label:\s*'([^']+)'[^}]*desc:\s*'([^']+)'/g
  let pm
  while ((pm = projRegex.exec(profJs)) !== null) {
    const name = pm[1]
    const desc = pm[2]
    if (['HEXFEED', 'SHELLGAME', 'MATE-HELPER', 'LETRAL', 'CATFISHING'].includes(name)) {
      extract.projects.push({ name, desc, url: '', lang: '' })
    }
  }

  const gameCards = html.match(/<h3>([^<]+)<\/h3>\s*<span[^>]*>([^<]+)<\/span>/g)
  if (gameCards) {
    for (const card of gameCards) {
      const n = card.match(/<h3>([^<]+)<\/h3>/)
      const d = card.match(/<span[^>]*>([^<]+)<\/span>/)
      if (n && d) extract.games.push({ name: n[1].trim(), desc: d[1].trim(), url: '' })
    }
  }

  return extract
}

function skillBar(pct) {
  const filled = Math.round(pct / 10)
  const empty = 10 - filled
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty) + ' ' + pct + '%'
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function generateReadme() {
  const p = profile.personal
  const s = profile.social
  const st = profile.status
  const sk = profile.skills
  const pr = profile.projects
  const g = profile.games
  const ex = profile.experience || []
  const ed = profile.education || []

  const birth = new Date(p.birthDate || '2005-04-18')
  const now = new Date()
  const age = Math.floor((now - birth) / (365.25 * 86400000))

  let md = ''

  md += `<div align="center">\n\n`
  md += `# 👋 Hey, I'm **${p.nickname || p.name.split(' ')[0]}**\n\n`
  md += `#### ${p.title}\n\n`
  md += `**${p.location}** · ${age} years old\n\n`
  md += `[![Profile Views](https://komarev.com/ghpvc/?username=${s.github}&label=Views&color=0e75b6&style=flat)]()\n`
  md += `[![GitHub](https://img.shields.io/badge/GitHub-${s.github}-181717?logo=github&style=flat)](${s.github ? 'https://github.com/' + s.github : '#'})\n`
  md += `[![LinkedIn](https://img.shields.io/badge/LinkedIn-${s.linkedin}-0A66C2?logo=linkedin&style=flat)](${s.linkedin ? 'https://linkedin.com/in/' + s.linkedin : '#'})\n`
  md += `[![Instagram](https://img.shields.io/badge/Instagram-${s.instagram}-E4405F?logo=instagram&style=flat)](${s.instagram ? 'https://instagram.com/' + s.instagram : '#'})\n`
  md += `[![Twitter/X](https://img.shields.io/badge/X-${s.twitter}-000000?logo=x&style=flat)](${s.twitter ? 'https://x.com/' + s.twitter : '#'})\n`
  md += `[![YouTube](https://img.shields.io/badge/YouTube-${s.youtube}-FF0000?logo=youtube&style=flat)](${s.youtube ? 'https://youtube.com/' + s.youtube : '#'})\n`
  md += `[![Twitch](https://img.shields.io/badge/Twitch-${s.twitch}-9146FF?logo=twitch&style=flat)](${s.twitch ? 'https://twitch.tv/' + s.twitch : '#'})\n`
  md += `[![Itch.io](https://img.shields.io/badge/Itch.io-${s.itchio}-FA5C5C?logo=itch.io&style=flat)](${s.itchio ? 'https://' + s.itchio + '.itch.io' : '#'})\n`
  md += `[![Email](https://img.shields.io/badge/Email-${p.email}-EA4335?logo=gmail&style=flat)](mailto:${p.email})\n\n`
  md += `</div>\n\n`

  md += `---\n\n`

  md += `### 🚀 About Me\n\n`
  md += `${p.bio || p.shortBio}\n\n`

  md += `> **\"${p.funFact}\"**\n\n`







  if (st.currentlyLearning && st.currentlyLearning.length) {
    md += `🌱 **Currently diving into:** ${st.currentlyLearning.join(', ')}\n\n`
  }
  if (st.currentlyWorkingOn) {
    md += `🔨 **Building:** ${st.currentlyWorkingOn}\n\n`
  }
  if (st.currentFocus) {
    md += `📚 **Focus:** ${st.currentFocus}\n\n`
  }

  md += `---\n\n`

  md += `### 🛠️ Stack\n\n`
  md += `<table>\n`
  md += `  <tr><th width="120">Category</th><th>Skill</th><th width="200">Level</th></tr>\n`

  if (sk.languages && sk.languages.length) {
    md += `  <tr><td rowspan="${sk.languages.length}"><b>Languages</b></td>\n`
    sk.languages.forEach((skill, i) => {
      const nm = skill.name.startsWith('C') ? skill.name : skill.name
      const icon = getIcon(nm)
      if (i === 0) {
        md += `    <td>${icon} ${nm}</td><td><code>${skillBar(skill.pct)}</code></td>\n`
      } else {
        md += `  <tr><td>${icon} ${nm}</td><td><code>${skillBar(skill.pct)}</code></td></tr>\n`
      }
    })
  }

  if (sk.tools && sk.tools.length) {
    md += `  <tr><td rowspan="${sk.tools.length}"><b>Tools</b></td>\n`
    sk.tools.forEach((skill, i) => {
      const icon = getIcon(skill.name)
      if (i === 0) {
        md += `    <td>${icon} ${skill.name}</td><td><code>${skillBar(skill.pct)}</code></td>\n`
      } else {
        md += `  <tr><td>${icon} ${skill.name}</td><td><code>${skillBar(skill.pct)}</code></td></tr>\n`
      }
    })
  }

  md += `</table>\n\n`

  md += `---\n\n`

  if (pr && pr.length) {
    md += `### 📦 Open Source Projects\n\n`
    pr.forEach(proj => {
      const badge = proj.badge ? ` \`[ ${proj.badge} ]\`` : ''
      md += `- **[${proj.name}](${proj.url || '#'})** ${badge} — ${proj.desc}\n`
    })
    md += `\n<sub>🔗 [See all on GitHub](https://github.com/${s.github}?tab=repositories)</sub>\n\n`
    md += `\n`
  }

  if (g && g.length) {
    md += `---\n\n`
    md += `### 🎮 Games I've Made\n\n`
    g.forEach(game => {
      md += `- **[${game.name}](${game.url || '#'})** — ${game.desc}\n`
    })
    md += `\n<sub>🎮 [See all on Itch.io](https://${s.itchio}.itch.io)</sub>\n\n`
  }

  md += `\n`
  md += `---\n\n`

  md += `### 📊 GitHub Stats\n\n`
  md += `<div align="center">\n\n`
  md += `[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${s.github}&show_icons=true&theme=tokyonight&include_all_commits=true&locale=en)]()\n\n`
  md += `[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs?username=${s.github}&layout=compact&langs_count=8&theme=tokyonight&locale=en)]()\n\n`
  md += `[![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${s.github}&theme=tokyonight)]()\n\n`
  md += `</div>\n`

  md += `\n`
  md += `---\n\n`

  md += `<div align="center">\n\n`
  md += `*⚡ ${p.funFact || 'Code, coffee, chaos.'}*\n\n`
  md += `</div>\n`

  return md
}

function getIcon(name) {
  const icons = {
    'Python': '\ud83d\udc0d',
    'JavaScript': '\ud83d\udfe1',
    'Bash': '\u25b6\ufe0f',
    'TypeScript': '\ud83d\udfe6',
    'SQL': '\ud83d\udce0',
    'C / C++': '\u2699\ufe0f',
    'C': '\u2699\ufe0f',
    'C++': '\u2795',
    'C#': '\ud83d\udd33',
    'Java': '\u2615',
    'GML': '\ud83c\udfae',
    'Git': '\ud83d\udd04',
    'Linux': '\ud83d\udc27',
    'ncurses': '\ud83d\udd79\ufe0f',
    'AWS': '\u2601\ufe0f',
    'Docker': '\ud83d\udc33',
    'FL Studio': '\ud83c\udfb5',
    'Godot': '\ud83d\udd07',
    'MongoDB': '\ud83c\udf33',
    'Unity': '\ud83c\udf10',
    'Arduino': '\u26a1',
    'GameMaker': '\ud83c\udfae',
    'Google Cloud': '\u2601\ufe0f',
  }
  return icons[name] || '\u25cf'
}

function getExistingReadme() {
  try {
    if (fs.existsSync(README_FILE)) {
      return fs.readFileSync(README_FILE, 'utf-8')
    }
  } catch (e) {}
  return null
}

function detectChanges(oldMd, newMd) {
  if (!oldMd) {
    changes.push('Initial README generation')
    return true
  }
  const oldClean = oldMd.replace(/<!-- GENERATED.*-->/g, '').trim()
  const newClean = newMd.replace(/<!-- GENERATED.*-->/g, '').trim()
  if (oldClean !== newClean) {
    changes.push('Profile data updated (skills, projects, bio, etc.)')
    return true
  }
  return false
}

function archiveReadme() {
  const historyDir = HISTORY_DIR
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true })
  }

  const existing = getExistingReadme()
  if (!existing) return

  const now = new Date()
  const ts = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')

  const archiveName = 'README_' + ts + '.md'
  const archivePath = path.join(historyDir, archiveName)
  fs.writeFileSync(archivePath, existing, 'utf-8')
  console.log('[sync] Archived previous README → ' + archivePath)
}

function writeReadme(md) {
  const header = '<!-- GENERATED by scripts/generate-readme.js · Last update: ' + new Date().toISOString() + ' -->\n'
  fs.writeFileSync(README_FILE, header + md, 'utf-8')
  console.log('[sync] Wrote ' + README_FILE)
}

async function main() {
  console.log('[sync] === Profile README Sync ===')
  console.log('[sync] Target: ' + PROFILE_REPO)

  loadProfile()
  if (!profile) {
    console.error('[sync] Error: Could not load profile data from any source.')
    process.exit(1)
  }

  const newReadme = generateReadme()

  const oldReadme = getExistingReadme()
  const hasChanges = detectChanges(oldReadme, newReadme)

  if (hasChanges) {
    if (oldReadme) {
      archiveReadme()
    }
    writeReadme(newReadme)
    console.log('[sync] Changes detected:')
    changes.forEach(c => console.log('  • ' + c))

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes=true\n')
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'change_count=' + changes.length + '\n')
    }
  } else {
    console.log('[sync] No changes detected. README is up to date.')
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes=false\n')
    }
  }
}

main().catch(err => {
  console.error('[sync] Fatal error:', err)
  process.exit(1)
})
