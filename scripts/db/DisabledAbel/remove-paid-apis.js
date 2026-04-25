const fs = require('fs')

const README_PATH = './README.md'
const TABLE_HEADER = '| API | Description | Auth | HTTPS | CORS |'

const FREE_TIER_TERMS = [
    'free tier',
    'free plan',
    'free forever',
    'free account',
    'free api',
    'freemium',
    'no cost',
    'at no cost',
    'without charge',
    'free requests',
    'free usage',
    'free quota',
]

const PAID_ONLY_TERMS = [
    'paid plans',
    'pricing starts',
    'starting at $',
    'subscription required',
    'credit card required',
    'contact sales',
    'enterprise only',
    'paid only',
    'no free tier',
]

function extractLinkFromRow(row) {
    const cells = row.split('|').map(cell => cell.trim())
    const apiCell = cells[1]

    if (!apiCell) {
        return null
    }

    const linkMatch = apiCell.match(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/i)

    if (!linkMatch) {
        return null
    }

    return linkMatch[1]
}

function classifyPricing(content = '') {
    const normalizedContent = (content || '').toLowerCase()

    const hasFreeTier = FREE_TIER_TERMS.some(term => normalizedContent.includes(term))
    const hasPaidOnly = PAID_ONLY_TERMS.some(term => normalizedContent.includes(term))

    if (hasPaidOnly && !hasFreeTier) {
        return 'paid-only'
    }

    if (hasFreeTier) {
        return 'free-tier'
    }

    return 'unknown'
}

async function fetchPageContent(link) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
        const response = await fetch(link, {
            headers: {
                'user-agent': 'public-apis-bot/1.0',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            redirect: 'follow',
            signal: controller.signal,
        })

        if (!response.ok) {
            return null
        }

        return await response.text()
    } catch (error) {
        return null
    } finally {
        clearTimeout(timeout)
    }
}

async function removePaidApis({ dryRun = false } = {}) {
    const readmeContent = fs.readFileSync(README_PATH, 'utf-8')
    const lines = readmeContent.split('\n')

    const rowsByLink = new Map()

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]

        if (line.trim() === TABLE_HEADER) {
            index += 2

            while (index < lines.length && lines[index].trim().startsWith('|')) {
                const row = lines[index]
                const link = extractLinkFromRow(row)

                if (link) {
                    rowsByLink.set(link, (rowsByLink.get(link) || []).concat(index))
                }

                index += 1
            }

            index -= 1
        }
    }

    const removedLinks = []
    const linksToCheck = Array.from(rowsByLink.keys())
    const concurrency = Number(process.env.PRICING_CHECK_CONCURRENCY || 20)
    const maxApisToCheck = Number(process.env.MAX_APIS_TO_CHECK || linksToCheck.length)
    const selectedLinks = linksToCheck.slice(0, maxApisToCheck)

    for (let start = 0; start < selectedLinks.length; start += concurrency) {
        const linksBatch = selectedLinks.slice(start, start + concurrency)
        const results = await Promise.all(
            linksBatch.map(async link => {
                const pageContent = await fetchPageContent(link)
                return {
                    classification: classifyPricing(pageContent),
                    link,
                }
            })
        )

        results.forEach(({ classification, link }) => {
            if (classification === 'paid-only') {
                removedLinks.push(link)
                rowsByLink.get(link).forEach(rowIndex => {
                    lines[rowIndex] = null
                })
            }
        })
    }

    if (!dryRun) {
        const filteredLines = lines.filter((line, index, arr) => {
            if (line !== null) {
                return true
            }

            const previousLine = arr[index - 1]
            const nextLine = arr[index + 1]

            return previousLine === null || nextLine === null
        })

        fs.writeFileSync(README_PATH, filteredLines.join('\n').replace(/\n{3,}/g, '\n\n'))
    }

    console.log(`Checked ${selectedLinks.length} APIs`)
    console.log(`Removed ${removedLinks.length} paid-only APIs`)

    if (removedLinks.length > 0) {
        console.log('Removed links:')
        removedLinks.forEach(link => console.log(`- ${link}`))
    }
}

const dryRun = process.argv.includes('--dry-run')

removePaidApis({ dryRun }).catch(error => {
    console.error(error)
    process.exit(1)
})
