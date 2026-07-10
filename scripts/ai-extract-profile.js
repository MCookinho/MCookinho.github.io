#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')

const API_URL = 'https://models.inference.ai.azure.com/chat/completions'
const MODEL = process.env.AI_MODEL || 'Meta-Llama-3.1-70B-Instruct'
const TOKEN = process.env.GITHUB_TOKEN
const PROFILE_FILE = process.env.PROFILE_FILE || path.join(__dirname, '..', 'data', 'profile.json')
const SITE_DIR = path.join(__dirname, '..')

async function readSiteFiles() {
  const files = {}
  for (const name of ['index.html', 'script.js', 'professional/script.js', 'lang.js']) {
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
        if (res.statusCode !== 200) {
          return reject(new Error(`API ${res.statusCode}: ${data.slice(0, 500)}`))
        }
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(new Error('Failed to parse API response'))
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function buildPrompt(siteFiles, currentProfile) {
  const schema = JSON.stringify({
    version: 'number',
    personal: {
      name: 'string',
      nickname: 'string',
      handle: 'string',
      age: 'number',
      birthDate: 'string (YYYY-MM-DD)',
      location: 'string',
      title: 'string',
      bio: 'string (detailed)',
      shortBio: 'string (one line)',
      email: 'string',
      funFact: 'string',
      avatarUrl: 'string',
      tags: 'string[] (interests like CHESS, GAME DEV, LINUX)',
      dog: 'string',
    },
    social: {
      github: 'string (username only)',
      linkedin: 'string (username only)',
      instagram: 'string',
      twitter: 'string',
      youtube: 'string',
      twitch: 'string',
      itchio: 'string (username)',
    },
    status: {
      currentlyLearning: 'string[]',
      currentlyWorkingOn: 'string',
      currentFocus: 'string',
    },
    skills: {
      languages: [{ name: 'string', pct: 'number (0-100)' }],
      tools: [{ name: 'string', pct: 'number (0-100)' }],
    },
    projects: [{ name: 'string', lang: 'string', desc: 'string', url: 'string', badge: 'string|null' }],
    games: [{ name: 'string', desc: 'string', url: 'string' }],
    experience: [{ role: 'string', org: 'string', period: 'string', desc: 'string' }],
    education: [{ course: 'string', institution: 'string', period: 'string', desc: 'string' }],
    rankings: { movies: 'string', series: 'string', games: 'string' },
  }, null, 2)

  let prompt = `You are a profile data extractor. Given the source files of a personal portfolio website, extract all profile data into the JSON schema below.

RULES:
- Return ONLY the JSON object, no explanation.
- Skills: categorize as "languages" (Python, JavaScript, TypeScript, Bash, SQL, Java, C, C++, C#, GML) or "tools" (everything else). Derive proficiency percentages from context in the code.
- Projects: extract name, language, description, badge if present (e.g. BETA, ALPHA).
- Games: extract from HTML (game card sections).
- Social: extract GitHub, LinkedIn, Instagram, Twitter/X, YouTube, Twitch, Itch.io usernames from the code.
- Bio/title/funFact: extract from the professional script.js data.
- Keep "version" as 1 more than current.
- Keep "rankings" paths as-is.

SCHEMA:
${schema}`

  if (currentProfile) {
    prompt += `\n\nCURRENT profile.json (update/keep what applies):\n${JSON.stringify(currentProfile, null, 2)}`
  }

  prompt += '\n\nSOURCE FILES:\n\n'
  for (const [name, content] of Object.entries(siteFiles)) {
    if (content) {
      prompt += `=== ${name} ===\n${content.slice(0, 15000)}\n\n`
    }
  }

  return prompt
}

async function main() {
  console.log('[ai-extract] === AI Profile Extraction ===')
  console.log('[ai-extract] Model:', MODEL)

  if (!TOKEN) {
    console.warn('[ai-extract] No GITHUB_TOKEN found, keeping existing profile.json')
    process.exit(0)
  }

  const siteFiles = await readSiteFiles()
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
    console.log('[ai-extract] Keeping existing profile.json unchanged')
    process.exit(0)
  }

  const content = result.choices?.[0]?.message?.content
  if (!content) {
    console.error('[ai-extract] Empty response from model')
    process.exit(0)
  }

  let profile
  try {
    profile = JSON.parse(content)
  } catch (e) {
    console.error('[ai-extract] Failed to parse model response as JSON:', e.message)
    process.exit(0)
  }

  if (!profile.version) profile.version = (currentProfile?.version || 0) + 1
  if (!profile.rankings) profile.rankings = { movies: 'data/rankings/filmes.json', series: 'data/rankings/series.json', games: 'data/rankings/jogos.json' }

  const out = JSON.stringify(profile, null, 2) + '\n'
  fs.writeFileSync(PROFILE_FILE, out, 'utf-8')
  console.log('[ai-extract] Written:', PROFILE_FILE)
  console.log('[ai-extract] Profile version:', profile.version)
}

main().catch(e => {
  console.error('[ai-extract] Fatal:', e.message)
  process.exit(0)
})
