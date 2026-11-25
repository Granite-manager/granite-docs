const CHAT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="docs-chat-icon" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.813 9-8.504 0-4.692-4.03-8.496-9-8.496S3 7.054 3 11.746c0 1.846.728 3.559 1.938 4.875L3 20.25l5.455-2.224a10.5 10.5 0 003.545.624z"/></svg>`

const SEND_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-7.5-15-7.5v6l10 1.5-10 1.5v6z"/></svg>`

const POSITION_KEY = 'docs-chat-position'
const MARGIN = 16
const DRAG_THRESHOLD_PX = 6
const FAB_SIZE = 56
const PANEL_GAP = 12
const PANEL_MAX_WIDTH = 380
const PANEL_MAX_HEIGHT = 740

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function renderInlineHtml(text) {
    const escaped = escapeHtml(text)
    const parts = escaped.split(
        /(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s&<]+)/g,
    )
    return parts
        .map(part => {
            const mdLink = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(part)
            if (mdLink) {
                return `<a href="${mdLink[2]}" target="_blank" rel="noopener noreferrer">${mdLink[1]}</a>`
            }
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                return `<strong>${part.slice(2, -2)}</strong>`
            }
            if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                return `<code>${part.slice(1, -1)}</code>`
            }
            if (/^https?:\/\//.test(part)) {
                const href = part.replace(/[.,;:!?)]+$/, '')
                const trailing = part.slice(href.length)
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>${trailing}`
            }
            return part
        })
        .join('')
}

function renderMessageHtml(content) {
    const lines = content.split('\n')
    const blocks = []
    let listItems = []
    let listType = null

    function flushList() {
        if (!listType || listItems.length === 0) return
        const items = listItems
            .map(item => {
                const nested =
                    item.nested.length > 0
                        ? `<ul>${item.nested.map(bullet => `<li>${renderInlineHtml(bullet)}</li>`).join('')}</ul>`
                        : ''
                return `<li>${renderInlineHtml(item.content)}${nested}</li>`
            })
            .join('')
        blocks.push(`<${listType}>${items}</${listType}>`)
        listItems = []
        listType = null
    }

    for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed === '') {
            if (listType) continue
            flushList()
            blocks.push('<div class="docs-chat-spacer"></div>')
            continue
        }
        const bulletMatch = /^[-*•]\s+(.+)$/.exec(trimmed)
        const numberedMatch = /^\d+\.\s+(.+)$/.exec(trimmed)
        if (bulletMatch) {
            if (listType === 'ol' && listItems.length > 0) {
                listItems[listItems.length - 1].nested.push(bulletMatch[1])
                continue
            }
            if (listType !== 'ul') {
                flushList()
                listType = 'ul'
            }
            listItems.push({ content: bulletMatch[1], nested: [] })
            continue
        }
        if (numberedMatch) {
            if (listType !== 'ol') {
                flushList()
                listType = 'ol'
            }
            listItems.push({ content: numberedMatch[1], nested: [] })
            continue
        }
        flushList()
        blocks.push(`<div>${renderInlineHtml(line)}</div>`)
    }
    flushList()
    return `<div class="docs-chat-md">${blocks.join('')}</div>`
}

function readPosition() {
    try {
        const raw = localStorage.getItem(POSITION_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (
            parsed &&
            typeof parsed.left === 'number' &&
            typeof parsed.top === 'number' &&
            Number.isFinite(parsed.left) &&
            Number.isFinite(parsed.top)
        ) {
            return { left: parsed.left, top: parsed.top }
        }
    } catch {
        return null
    }
    return null
}

function writePosition(left, top) {
    localStorage.setItem(POSITION_KEY, JSON.stringify({ left, top }))
}

export function mountDocsChat() {
    if (document.getElementById('docs-chat-root')) return

    const root = document.createElement('div')
    root.id = 'docs-chat-root'
    root.innerHTML = `
      <div id="docs-chat-panel" role="dialog" aria-label="Docs chat" aria-hidden="true">
        <div class="docs-chat-header">
          <span class="docs-chat-grip" aria-hidden="true"></span>
          <div class="docs-chat-header-icon">${CHAT_ICON_SVG}</div>
          <div class="docs-chat-header-copy">
            <span class="docs-chat-title">Docs assistant</span>
            <span class="docs-chat-subtitle">Drag to move · Ask about setup</span>
          </div>
          <button type="button" id="docs-chat-close" aria-label="Close chat">×</button>
        </div>
        <div id="docs-chat-messages"></div>
        <form id="docs-chat-form">
          <input id="docs-chat-input" type="text" placeholder="Ask how to set up CloudTalk, email, Make…" autocomplete="off" />
          <button type="submit" aria-label="Send">${SEND_ICON_SVG}</button>
        </form>
      </div>
      <button type="button" id="docs-chat-toggle" aria-label="Open chat" aria-expanded="false">
        ${CHAT_ICON_SVG}
      </button>
    `
    document.body.appendChild(root)

    const panel = document.getElementById('docs-chat-panel')
    const header = root.querySelector('.docs-chat-header')
    const toggle = document.getElementById('docs-chat-toggle')
    const closeBtn = document.getElementById('docs-chat-close')
    const form = document.getElementById('docs-chat-form')
    const input = document.getElementById('docs-chat-input')
    const log = document.getElementById('docs-chat-messages')

    const history = []
    let open = false
    let suppressClick = false
    panel.inert = true

    function panelSize() {
        return {
            width: Math.min(PANEL_MAX_WIDTH, window.innerWidth - MARGIN * 2),
            height: Math.min(PANEL_MAX_HEIGHT, window.innerHeight - MARGIN * 2),
        }
    }

    function currentSize() {
        if (open) return panelSize()
        return { width: FAB_SIZE, height: FAB_SIZE }
    }

    function clampBox(left, top, width, height) {
        const maxLeft = Math.max(MARGIN, window.innerWidth - width - MARGIN)
        const maxTop = Math.max(MARGIN, window.innerHeight - height - MARGIN)
        return {
            left: Math.min(Math.max(left, MARGIN), maxLeft),
            top: Math.min(Math.max(top, MARGIN), maxTop),
        }
    }

    function applyLeftTop(left, top) {
        const size = currentSize()
        const next = clampBox(left, top, size.width, size.height)
        root.classList.add('has-position')
        root.style.left = `${next.left}px`
        root.style.top = `${next.top}px`
        root.style.right = 'auto'
        root.style.bottom = 'auto'
        return next
    }

    function panelPositionFromFab(fab) {
        const { width, height } = panelSize()
        const left = fab.right - width
        const aboveTop = fab.top - PANEL_GAP - height
        const belowTop = fab.bottom + PANEL_GAP
        const fitsAbove = aboveTop >= MARGIN
        const fitsBelow = belowTop + height <= window.innerHeight - MARGIN
        let top = aboveTop
        if (!fitsAbove && fitsBelow) {
            top = belowTop
        } else if (!fitsAbove && !fitsBelow) {
            top = Math.round((window.innerHeight - height) / 2)
        }
        return clampBox(left, top, width, height)
    }

    function fabPositionFromPanel(panelRect) {
        return clampBox(
            panelRect.right - FAB_SIZE,
            panelRect.bottom - FAB_SIZE,
            FAB_SIZE,
            FAB_SIZE,
        )
    }

    function persistPosition() {
        const rect = root.getBoundingClientRect()
        if (open) {
            const fab = fabPositionFromPanel(rect)
            writePosition(fab.left, fab.top)
            return
        }
        writePosition(rect.left, rect.top)
    }

    const saved = readPosition()
    if (saved) {
        applyLeftTop(saved.left, saved.top)
    }

    function appendBubble(role, text) {
        const bubble = document.createElement('div')
        bubble.className = `docs-chat-bubble docs-chat-${role}`
        bubble.innerHTML = role === 'assistant' ? renderMessageHtml(text) : escapeHtml(text)
        log.appendChild(bubble)
        log.scrollTop = log.scrollHeight
        return bubble
    }

    function createStreamingBubble() {
        const bubble = document.createElement('div')
        bubble.className = 'docs-chat-bubble docs-chat-assistant docs-chat-typing'
        log.appendChild(bubble)
        log.scrollTop = log.scrollHeight

        function paint(text, { done } = {}) {
            if (!text) {
                bubble.textContent = done ? 'No answer returned.' : ''
            } else {
                bubble.innerHTML = renderMessageHtml(text)
            }
            if (!done) {
                const caret = document.createElement('span')
                caret.className = 'docs-chat-caret'
                caret.setAttribute('aria-hidden', 'true')
                bubble.appendChild(caret)
            }
            log.scrollTop = log.scrollHeight
        }

        return {
            setText(text) {
                paint(text)
            },
            finish(text) {
                bubble.classList.remove('docs-chat-typing')
                paint(text, { done: true })
            },
            fail(message) {
                bubble.classList.remove('docs-chat-typing')
                bubble.textContent = message
            },
        }
    }

    appendBubble(
        'assistant',
        'Ask how to set up CloudTalk, inbound email, Make, Zapier, or anything else in these docs.',
    )

    function setOpen(nextOpen) {
        if (nextOpen) {
            const fab = toggle.getBoundingClientRect()
            open = true
            const pos = panelPositionFromFab(fab)
            applyLeftTop(pos.left, pos.top)
            void panel.offsetWidth
            root.classList.add('chat-open')
            panel.classList.add('is-open')
            panel.setAttribute('aria-hidden', 'false')
            panel.inert = false
            toggle.setAttribute('aria-expanded', 'true')
            requestAnimationFrame(() => input.focus())
            return
        }
        const panelRect = root.getBoundingClientRect()
        const fabPos = fabPositionFromPanel(panelRect)
        open = false
        root.classList.remove('chat-open')
        panel.classList.remove('is-open')
        panel.setAttribute('aria-hidden', 'true')
        panel.inert = true
        toggle.setAttribute('aria-expanded', 'false')
        applyLeftTop(fabPos.left, fabPos.top)
        persistPosition()
        toggle.focus()
    }

    function enableDrag(handle) {
        handle.addEventListener('pointerdown', event => {
            if (event.button !== 0) return
            if (event.target.closest('#docs-chat-close')) return

            const startX = event.clientX
            const startY = event.clientY
            const rect = root.getBoundingClientRect()
            const originLeft = rect.left
            const originTop = rect.top
            let dragged = false

            handle.setPointerCapture(event.pointerId)

            function onMove(moveEvent) {
                const dx = moveEvent.clientX - startX
                const dy = moveEvent.clientY - startY
                if (!dragged && dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
                    return
                }
                dragged = true
                root.classList.add('is-dragging')
                applyLeftTop(originLeft + dx, originTop + dy)
            }

            function onUp(upEvent) {
                handle.releasePointerCapture(upEvent.pointerId)
                handle.removeEventListener('pointermove', onMove)
                handle.removeEventListener('pointerup', onUp)
                handle.removeEventListener('pointercancel', onUp)
                root.classList.remove('is-dragging')
                if (dragged) {
                    suppressClick = true
                    const placed = root.getBoundingClientRect()
                    applyLeftTop(placed.left, placed.top)
                    persistPosition()
                }
            }

            handle.addEventListener('pointermove', onMove)
            handle.addEventListener('pointerup', onUp)
            handle.addEventListener('pointercancel', onUp)
        })
    }

    enableDrag(toggle)
    if (header) enableDrag(header)
    toggle.addEventListener('click', event => {
        if (suppressClick) {
            event.preventDefault()
            suppressClick = false
            return
        }
        setOpen(true)
    })
    closeBtn.addEventListener('click', () => setOpen(false))

    window.addEventListener('resize', () => {
        if (root.classList.contains('has-position')) {
            const rect = root.getBoundingClientRect()
            applyLeftTop(rect.left, rect.top)
            persistPosition()
        }
    })

    form.addEventListener('submit', async event => {
        event.preventDefault()
        const question = input.value.trim()
        if (!question) return
        input.value = ''
        appendBubble('user', question)
        history.push({ role: 'user', content: question })

        const stream = createStreamingBubble()
        const sendBtn = form.querySelector('button[type="submit"]')
        if (sendBtn) sendBtn.disabled = true
        input.disabled = true

        try {
            const response = await fetch('/api/docs-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
            })
            const contentType = response.headers.get('content-type') || ''
            if (!response.ok || !contentType.includes('text/event-stream')) {
                let message = 'Could not get an answer.'
                try {
                    const data = await response.json()
                    if (data && data.error) message = data.error
                } catch {
                    message = 'Could not get an answer.'
                }
                stream.fail(message)
                return
            }
            if (!response.body) {
                stream.fail('Could not get an answer.')
                return
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let reply = ''
            let failed = false

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                const events = buffer.split('\n\n')
                buffer = events.pop() || ''
                for (const event of events) {
                    const dataLine = event.split('\n').find(line => line.startsWith('data:'))
                    if (!dataLine) continue
                    let payload
                    try {
                        payload = JSON.parse(dataLine.slice(5).trim())
                    } catch {
                        continue
                    }
                    if (payload && payload.error) {
                        stream.fail(payload.error)
                        failed = true
                        break
                    }
                    if (payload && typeof payload.delta === 'string' && payload.delta) {
                        reply += payload.delta
                        stream.setText(reply)
                    }
                    if (payload && payload.done) {
                        break
                    }
                }
                if (failed) break
            }

            if (failed) return
            stream.finish(reply)
            if (reply) history.push({ role: 'assistant', content: reply })
        } catch {
            stream.fail('Could not reach the docs assistant.')
        } finally {
            input.disabled = false
            if (sendBtn) sendBtn.disabled = false
            input.focus()
        }
    })
}
