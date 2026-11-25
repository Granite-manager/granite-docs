import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.join(pluginDir, 'docs')

const DOC_FILES = [
    ['CloudTalk Setup', 'cloudtalk-setup.md'],
    ['Inbound Email Setup', 'inbound-email-setup.md'],
    ['Domain Trust', 'domain-trust.md'],
    ['Make Integration — Facebook', 'make-integration-facebook.md'],
    ['Make Integration — Website', 'make-integration-website.md'],
    ['Zapier Integration', 'zapier-integration.md'],
    ['Zapier Integration — Facebook', 'zapier-integration-facebook.html'],
    ['Zapier Integration — Website', 'zapier-integration-website.html'],
]

function loadSecretKey() {
    if (process.env.OPEN_AI_SECRET_KEY) return process.env.OPEN_AI_SECRET_KEY.trim()
    const candidates = [
        path.join(pluginDir, '.env'),
        path.join(pluginDir, '../granite-front/.env'),
    ]
    for (const file of candidates) {
        if (!existsSync(file)) continue
        const text = readFileSync(file, 'utf8')
        const match = /^OPEN_AI_SECRET_KEY=(.*)$/m.exec(text)
        if (match) return match[1].trim().replace(/^['"]|['"]$/g, '')
    }
    return ''
}

function htmlToText(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
}

function loadDocsKnowledge() {
    const sections = []
    for (const [title, filename] of DOC_FILES) {
        const filePath = path.join(docsDir, filename)
        if (!existsSync(filePath)) continue
        let body = readFileSync(filePath, 'utf8')
        if (filename.endsWith('.html')) body = htmlToText(body)
        sections.push(`# ${title}\n\n${body}`)
    }
    if (sections.length === 0 && existsSync(docsDir)) {
        for (const name of readdirSync(docsDir)) {
            if (!name.endsWith('.md') && !name.endsWith('.html')) continue
            const body = readFileSync(path.join(docsDir, name), 'utf8')
            sections.push(`# ${name}\n\n${name.endsWith('.html') ? htmlToText(body) : body}`)
        }
    }
    return sections.join('\n\n---\n\n')
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
            try {
                const raw = Buffer.concat(chunks).toString('utf8')
                resolve(raw ? JSON.parse(raw) : {})
            } catch (error) {
                reject(error)
            }
        })
        req.on('error', reject)
    })
}

function sendJson(res, status, payload) {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(payload))
}

async function handleDocsChat(req, res) {
    if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
        return
    }
    if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' })
        return
    }

    let body
    try {
        body = await readJsonBody(req)
    } catch {
        sendJson(res, 400, { error: 'Invalid JSON' })
        return
    }

    const messages = Array.isArray(body.messages) ? body.messages : []
    const lastUser = [...messages].reverse().find(item => item && item.role === 'user')
    if (!lastUser || typeof lastUser.content !== 'string' || !lastUser.content.trim()) {
        sendJson(res, 400, { error: 'Missing question' })
        return
    }

    const apiKey = loadSecretKey()
    if (!apiKey) {
        sendJson(res, 500, {
            error: 'Docs chat is not configured. Set OPEN_AI_SECRET_KEY to enable it.',
        })
        return
    }

    const history = messages
        .filter(
            item =>
                item &&
                (item.role === 'user' || item.role === 'assistant') &&
                typeof item.content === 'string',
        )
        .slice(-12)
        .map(item => ({ role: item.role, content: item.content.slice(0, 4000) }))

    const knowledge = loadDocsKnowledge()
    const system = `You are the Granite Manager docs assistant on docs.granite-manager.com.
Answer only from the documentation below. Help the user set up and use:
- CloudTalk (account, A2P 10DLC / US SMS form, numbers, agent ID, phone number, Granite Phone/SMS)
- Inbound email (DNS, Google Admin routing)
- Make and Zapier lead integrations
- Anything else in these docs

If the answer is not in the docs, say so and point them to the matching page (CloudTalk Setup, Inbound Email Setup, Make, Zapier, or API Reference).
Do not invent dashboard labels, URLs, or IDs. Prefer numbered steps.

DOCUMENTATION:
${knowledge}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-5.6-luna',
            reasoning_effort: 'none',
            max_completion_tokens: 1024,
            stream: true,
            messages: [{ role: 'system', content: system }, ...history],
        }),
    })

    if (!response.ok) {
        let message = 'The docs assistant could not answer right now.'
        try {
            const data = await response.json()
            if (data && data.error && data.error.message) {
                message = data.error.message
            }
        } catch {
            // keep the default message
        }
        sendJson(res, 502, { error: message })
        return
    }

    if (!response.body) {
        sendJson(res, 502, { error: 'The docs assistant could not stream a reply.' })
        return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    if (typeof res.flushHeaders === 'function') res.flushHeaders()

    const sendEvent = payload => {
        res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let sentDelta = false

    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed.startsWith('data:')) continue
                const payload = trimmed.slice(5).trim()
                if (!payload) continue
                if (payload === '[DONE]') {
                    sendEvent({ done: true })
                    res.end()
                    return
                }
                let json
                try {
                    json = JSON.parse(payload)
                } catch {
                    continue
                }
                const delta =
                    json &&
                    json.choices &&
                    json.choices[0] &&
                    json.choices[0].delta &&
                    typeof json.choices[0].delta.content === 'string'
                        ? json.choices[0].delta.content
                        : ''
                if (delta) {
                    sentDelta = true
                    sendEvent({ delta })
                }
            }
        }
        if (!sentDelta) {
            sendEvent({ error: 'No answer returned.' })
        } else {
            sendEvent({ done: true })
        }
        res.end()
    } catch {
        sendEvent({ error: 'The docs assistant could not answer right now.' })
        res.end()
    }
}

export function docsChatPlugin() {
    return {
        name: 'docs-chat',
        configureServer(server) {
            server.middlewares.use('/api/docs-chat', (req, res, next) => {
                handleDocsChat(req, res).catch(next)
            })
        },
        configurePreviewServer(server) {
            server.middlewares.use('/api/docs-chat', (req, res, next) => {
                handleDocsChat(req, res).catch(next)
            })
        },
    }
}
