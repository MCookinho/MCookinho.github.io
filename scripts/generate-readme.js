#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const PROFILE_REPO = process.env.PROFILE_REPO || 'MCookinho/MCookinho'
const SITE_URL = process.env.SITE_URL || 'https://mcookinho.github.io'
const HISTORY_DIR = process.env.HISTORY_DIR || 'History'
const README_FILE = process.env.README_FILE || 'README.md'
const DATA_FILE = path.join(__dirname, '..', 'data', 'profile.json')

let profile = null
let changes = []

function loadProfile() {
  try {
    profile = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    console.log('[sync] Loaded profile.json v' + (profile.version || '?'))
  } catch (e) {
    console.error('[sync] Error: Could not load profile.json')
    process.exit(1)
  }
}

function shieldEscape(s) {
  return String(s).replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_')
}

function shield(label, color, logo) {
  let url = `https://img.shields.io/badge/${shieldEscape(label)}-${color}`
  if (logo) url += `?logo=${logo}&logoColor=white`
  return url
}

function skillBadge(name, pct, logo, color) {
  const url = shield(`${name} ${pct}%`, color, logo)
  return `![${name}](${url})`
}

function shieldInfo(name) {
  const map = {
    'Python':       ['python',       '3776AB'],
    'JavaScript':   ['javascript',   'F7DF1E'],
    'Bash':         ['gnubash',      '4EAA25'],
    'TypeScript':   ['typescript',   '3178C6'],
    'SQL':          ['mysql',        '4479A1'],
    'C / C++':      ['c',            'A8B9CC'],
    'C':            ['c',            'A8B9CC'],
    'C++':          ['c%2B%2B',      '00599C'],
    'C#':           ['csharp',       '239120'],
    'Java':         ['openjdk',      'ED8B00'],
    'GML':          ['',             '00C853'],
    'Git':          ['git',          'F05032'],
    'Linux':        ['linux',        'FCC624'],
    'ncurses':      ['',             '00599C'],
    'AWS':          ['amazonaws',    'FF9900'],
    'Docker':       ['docker',       '2496ED'],
    'FL Studio':    ['',             'FF8800'],
    'Godot':        ['godotengine',  '478CBF'],
    'MongoDB':      ['mongodb',      '47A248'],
    'Unity':        ['unity',        'FFFFFF'],
    'Arduino':      ['arduino',      '00979D'],
    'GameMaker':    ['',             '00C853'],
    'Google Cloud': ['googlecloud',  '4285F4'],
  }
  return map[name] || ['', '888888']
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

  // ── Header ──
  md += `<div align="center">\n\n`
  if (p.avatarUrl) {
    md += `<img src="${p.avatarUrl}" width="140" alt="avatar"/>\n\n`
  }
  md += `# Hey, I'm **${p.nickname || p.name.split(' ')[0]}**\n\n`
  md += `**${p.title}**\n\n`
  md += `${p.location} · ${age} years old\n\n`

  // Social badges
  const socialBadges = [
    ['Email', p.email, 'EA4335', 'gmail', `mailto:${p.email}`],
    ['GitHub', s.github, '181717', 'github', `https://github.com/${s.github}`],
    ['LinkedIn', s.linkedin, '0A66C2', 'linkedin', `https://linkedin.com/in/${s.linkedin}`],
    ['Instagram', s.instagram, 'E4405F', 'instagram', `https://instagram.com/${s.instagram}`],
    ['X', s.twitter, '000000', 'x', `https://x.com/${s.twitter}`],
    ['Twitch', s.twitch, '9146FF', 'twitch', `https://twitch.tv/${s.twitch}`],
    ['YouTube', s.youtube, 'FF0000', 'youtube', `https://youtube.com/${s.youtube}`],
    ['Itch.io', s.itchio, 'FA5C5C', 'itch.io', `https://${s.itchio}.itch.io`],
  ]

  for (const [, value, color, logo, url] of socialBadges) {
    if (!value) continue
    md += `[![](https://img.shields.io/badge/-${color}?logo=${logo}&logoColor=white&label=${shieldEscape(value)})](${url})\n`
  }
  md += `\n</div>\n\n`

  md += `---\n\n`

  // ── About Me ──
  md += `### 🚀 About Me\n\n`

  md += `<img align="right" src="https://github-readme-stats.vercel.app/api?username=${s.github}&show_icons=true&theme=tokyonight&hide_border=true&locale=en" width="400"/>\n\n`

  md += `${p.bio || p.shortBio}\n\n`

  if (p.funFact) {
    md += `> *"${p.funFact}"*\n\n`
  }

  if (st.currentlyLearning && st.currentlyLearning.length) {
    md += `🌱 **Learning:** ${st.currentlyLearning.join(', ')}\n\n`
  }
  if (st.currentlyWorkingOn) {
    md += `🔨 **Building:** ${st.currentlyWorkingOn}\n\n`
  }
  if (st.currentFocus) {
    md += `📚 **Focus:** ${st.currentFocus}\n\n`
  }

  md += `---\n\n`

  // ── Stack ──
  md += `### 🛠️ Stack\n\n`

  if (sk.languages && sk.languages.length) {
    md += `**Languages**\n\n`
    for (const skill of sk.languages) {
      const [logo, color] = shieldInfo(skill.name)
      md += skillBadge(skill.name, skill.pct, logo, color) + ' '
    }
    md += `\n\n`
  }

  if (sk.tools && sk.tools.length) {
    md += `**Tools & Frameworks**\n\n`
    for (const skill of sk.tools) {
      const [logo, color] = shieldInfo(skill.name)
      md += skillBadge(skill.name, skill.pct, logo, color) + ' '
    }
    md += `\n\n`
  }

  md += `---\n\n`

  // ── Projects ──
  if (pr && pr.length) {
    md += `### 📦 Open Source Projects\n\n`
    for (const proj of pr) {
      const langBadge = proj.lang
        ? `![${proj.lang}](${shield(proj.lang, 'lightgrey', shieldInfo(proj.lang)[0])})`
        : ''
      const badge = proj.badge
        ? `![${proj.badge}](${shield(proj.badge, 'orange')})`
        : ''
      md += `[**${proj.name}**](${proj.url || '#'}) ${langBadge} ${badge}— ${proj.desc}\n\n`
    }
    md += `<sub>🔗 [See all on GitHub](https://github.com/${s.github}?tab=repositories)</sub>\n\n`
  }

  // ── Games ──
  if (g && g.length) {
    md += `### 🎮 Games I've Made\n\n`
    for (const game of g) {
      md += `[**${game.name}**](${game.url || '#'}) — ${game.desc}\n\n`
    }
    md += `<sub>🎮 [See all on Itch.io](https://${s.itchio}.itch.io)</sub>\n\n`
  }

  // ── Experience ──
  if (ex.length) {
    md += `---\n\n`
    md += `### 💼 Experience\n\n`
    for (const exp of ex) {
      md += `**${exp.role}** @ ${exp.org} · ${exp.period}\n\n`
      md += `${exp.desc}\n\n`
    }
  }

  // ── Education ──
  if (ed.length) {
    md += `### 📚 Education\n\n`
    for (const edu of ed) {
      md += `**${edu.course}** @ ${edu.institution} · ${edu.period}\n\n`
      md += `${edu.desc}\n\n`
    }
  }

  md += `---\n\n`

  // ── GitHub Stats ──
  md += `### 📊 GitHub Stats\n\n`
  md += `<div align="center">\n\n`
  md += `<img src="https://github-readme-stats.vercel.app/api/top-langs?username=${s.github}&layout=compact&langs_count=8&theme=tokyonight&hide_border=true&locale=en" height="150"/>\n\n`
  md += `<img src="https://github-readme-streak-stats.herokuapp.com/?user=${s.github}&theme=tokyonight&hide_border=true" height="150"/>\n\n`
  md += `</div>\n`

  md += `\n`
  md += `---\n\n`

  // ── Footer ──
  md += `<div align="center">\n\n`
  md += `<img src="https://komarev.com/ghpvc/?username=${s.github}&label=Profile+Views&color=0e75b6&style=flat"/>\n\n`
  md += `*⚡ ${p.funFact || 'Code, coffee, chaos.'}*\n\n`
  md += `</div>\n`

  return md
}

let nextId = 1
let createdDate = ''

function fmtDate(d) {
  return String(d.getDate()).padStart(2, '0') + '_' +
    String(d.getMonth() + 1).padStart(2, '0') + '_' +
    d.getFullYear()
}

function parseOldHeader(oldMd) {
  const m = oldMd.match(/<!-- GENERATED\s+id=(\d+)\s+created=(\d{2}\/\d{2}\/\d{4})\s*-->/)
  if (m) {
    nextId = parseInt(m[1]) + 1
    createdDate = m[2]
  } else {
    nextId = 1
    try {
      const stat = fs.statSync(README_FILE)
      createdDate = fmtDate(stat.mtime)
    } catch (e) {
      createdDate = fmtDate(new Date())
    }
  }
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
  const oldClean = oldMd.replace(/<!-- GENERATED.*?-->/g, '').trim()
  const newClean = newMd.replace(/<!-- GENERATED.*?-->/g, '').trim()
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

  parseOldHeader(existing)

  const now = new Date()
  const archivedStr = fmtDate(now)

  const archiveName = `ARCHIVE(${nextId - 1})   [${createdDate}] -> [${archivedStr}].md`
  const archivePath = path.join(historyDir, archiveName)
  fs.writeFileSync(archivePath, existing, 'utf-8')
  console.log('[sync] Archived → ' + archiveName)
}

function writeReadme(md) {
  const now = new Date()
  const header = `<!-- GENERATED id=${nextId} created=${fmtDate(now)} -->\n`
  fs.writeFileSync(README_FILE, header + md, 'utf-8')
  console.log('[sync] Wrote ' + README_FILE)
}

async function main() {
  console.log('[sync] === Profile README Sync ===')
  console.log('[sync] Target: ' + PROFILE_REPO)

  loadProfile()

  const oldReadme = getExistingReadme()
  const hasChanges = detectChanges(oldReadme, generateReadme())

  if (hasChanges) {
    if (oldReadme) {
      archiveReadme()
    }
    writeReadme(generateReadme())
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
