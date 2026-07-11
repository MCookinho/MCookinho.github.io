#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')

const API_URL = 'https://models.github.ai/inference/chat/completions'
const MODEL = process.env.AI_MODEL || 'Mistral-large'
const TOKEN = process.env.GITHUB_TOKEN
const PROFILE_FILE = process.env.PROFILE_FILE || path.join(__dirname, '..', 'data', 'profile.json')
const SITE_DIR = path.join(__dirname, '..')

function readSiteFiles() {
  const files = {}
  for (const name of ['index.html', 'script.js', 'professional/script.js', 'lang.js', 'professional/index.html']) {
    try {
      files[name] = fs.readFileSync(path.join(SITE_DIR, name), 'utf-8')
    } catch (e) {
      files[name] = null
    }
  }
  return files
}

function getCurrentProfile() {
  try {
    return JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'))
  } catch (e) {
    return null
  }
}

function callAPI(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4096,
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
        if (res.statusCode !== 200) return reject(new Error(`API ${res.statusCode}: ${data.slice(0, 500)}`))
        try { resolve(JSON.parse(data)) } catch (e) { reject(new Error('Failed to parse API response')) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function buildPrompt(siteFiles, currentProfile) {
  let prompt = `You are a precise profile data extractor. Extract ALL profile data from the provided source files into the JSON schema below.

RULES - FOLLOW THESE EXACTLY:
1. Return ONLY the JSON object. No explanation, no markdown, no code fences.
2. version: increment by 1 from current (or start at 1).

3. personal.name: get from professional/script.js "name:" field
4. personal.nickname: "Peu Borges"
5. personal.handle: "MisterCookie"
6. personal.birthDate: "2005-04-18"
7. personal.age: calculate from birthDate
8. personal.location: "Salvador, BA, Brazil"
9. personal.title: from professional/script.js "title:" or similar
10. personal.bio: from professional/script.js "about:" or similar
11. personal.shortBio: one-line summary
12. personal.email: from professional/script.js "email:"
13. personal.funFact: something creative about the user
14. personal.avatarUrl: "https://mcookinho.github.io/assets/fotominha.jpeg"
15. personal.tags: extract interests from context (CHESS, GAME DEV, LINUX, etc.)
16. personal.dog: "Shiva — Golden Retriever, the cutest coding buddy in the world"

17. social: extract ALL usernames from relevant fields in script.js / professional/script.js
    - github: username only (without https://github.com/)
    - linkedin: username only (without https://linkedin.com/in/)
    - instagram: username
    - twitter: username
    - youtube: channel handle
    - twitch: username
    - itchio: username

18. status.currentlyLearning: extract from context
19. status.currentlyWorkingOn: extract from context
20. status.currentFocus: education info

21. skills.languages: ONLY these names — "Python", "JavaScript", "Bash", "TypeScript", "SQL", "C / C++", "GML", "Java", "C#"
    Set pct (0-100) based on proficiency indicators in the code.
    Sort by pct descending.

22. skills.tools: ONLY these names — "Git", "Linux", "ncurses", "AWS", "Docker", "FL Studio", "Godot", "MongoDB", "Unity", "Arduino", "GameMaker", "Google Cloud"
    Set pct (0-100) based on proficiency indicators in the code.
    Sort by pct descending.

23. projects: extract from professional/script.js project entries. Include name, language (lang), description (desc), url, and badge (BETA/ALPHA or null).

24. games: extract from index.html game card sections. Include name, desc, url.

25. experience: extract education and work context.

26. education: extract course, institution, period.

27. rankings: keep as {"movies": "data/rankings/filmes.json", "series": "data/rankings/series.json", "games": "data/rankings/jogos.json"}

SCHEMA:
{
  "version": "number (increment from current)",
  "personal": {
    "name": "string",
    "nickname": "string",
    "handle": "string",
    "birthDate": "2005-04-18",
    "age": "number",
    "location": "string",
    "title": "string",
    "bio": "string",
    "shortBio": "string",
    "email": "string",
    "funFact": "string",
    "avatarUrl": "string",
    "tags": "string[]",
    "dog": "string"
  },
  "social": {
    "github": "string",
    "linkedin": "string",
    "instagram": "string",
    "twitter": "string",
    "youtube": "string",
    "twitch": "string",
    "itchio": "string"
  },
  "status": {
    "currentlyLearning": "string[]",
    "currentlyWorkingOn": "string",
    "currentFocus": "string"
  },
  "skills": {
    "languages": [{ "name": "string", "pct": "number" }],
    "tools": [{ "name": "string", "pct": "number" }]
  },
  "projects": [{ "name": "string", "lang": "string", "desc": "string", "url": "string", "badge": "string|null" }],
  "games": [{ "name": "string", "desc": "string", "url": "string" }],
  "experience": [{ "role": "string", "org": "string", "period": "string", "desc": "string" }],
  "education": [{ "course": "string", "institution": "string", "period": "string", "desc": "string" }],
  "rankings": { "movies": "data/rankings/filmes.json", "series": "data/rankings/series.json", "games": "data/rankings/jogos.json" }
}`

  if (currentProfile) {
    prompt += `\n\nCURRENT profile.json (use as reference, update fields that changed):\n${JSON.stringify(currentProfile, null, 2)}`
  }

  prompt += '\n\nSOURCE FILES:\n\n'
  for (const [name, content] of Object.entries(siteFiles)) {
    if (content) prompt += `=== ${name} ===\n${content.slice(0, 20000)}\n\n`
  }

  return prompt
}

async function main() {
  console.log('[ai-extract] === Profile Extraction ===')
  console.log('[ai-extract] Model:', MODEL)

  if (!TOKEN) {
    console.warn('[ai-extract] No GITHUB_TOKEN — keeping existing profile.json')
    process.exit(0)
  }

  const siteFiles = readSiteFiles()
  const currentProfile = getCurrentProfile()
  const prompt = buildPrompt(siteFiles, currentProfile)

  console.log('[ai-extract] Calling API...')
  let result
  try {
    result = await callAPI([
      { role: 'system', content: 'You are a precise JSON data extractor. Return ONLY valid JSON.' },
      { role: 'user', content: prompt },
    ])
  } catch (e) {
    console.error('[ai-extract] API call failed:', e.message)
    process.exit(0)
  }

  const content = result.choices?.[0]?.message?.content
  if (!content) { console.error('[ai-extract] Empty response'); process.exit(0) }

  let profile
  try { profile = JSON.parse(content) }
  catch (e) { console.error('[ai-extract] Invalid JSON:', e.message); process.exit(0) }

  if (!profile.version) profile.version = (currentProfile?.version || 0) + 1
  if (!profile.rankings) profile.rankings = { movies: 'data/rankings/filmes.json', series: 'data/rankings/series.json', games: 'data/rankings/jogos.json' }

  // Sort skills by pct descending
  if (profile.skills) {
    if (profile.skills.languages) profile.skills.languages.sort((a, b) => b.pct - a.pct)
    if (profile.skills.tools) profile.skills.tools.sort((a, b) => b.pct - a.pct)
  }

  const out = JSON.stringify(profile, null, 2) + '\n'
  fs.writeFileSync(PROFILE_FILE, out, 'utf-8')
  console.log('[ai-extract] Written:', PROFILE_FILE)
  console.log('[ai-extract] Profile version:', profile.version)
}

main().catch(e => {
  console.error('[ai-extract] Fatal:', e.message)
  process.exit(0)
})
