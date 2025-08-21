const express = require('express')
const router = express.Router()
const { allProducts } = require('../data/products')
const { geminiChat } = require('../lib/gemini')

function buildCatalogContext() {
  return allProducts
    .map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, tags: p.tags || [], rating: p.rating }))
}

router.post('/', async (req, res) => {
  const { query } = req.body || {}
  if (!query) return res.status(400).json({ error: 'query is required' })

  const catalog = buildCatalogContext()

  // Fallback without API key: naive keyword match
  if (!process.env.GEMINI_API_KEY) {
    const q = String(query).toLowerCase()
    const matched = catalog.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags || []).some(t => String(t).toLowerCase().includes(q))
    ).slice(0, 5)
    return res.json({ recommendations: matched.map(m => ({ id: m.id, reason: 'keyword-match' })), model: 'mock' })
  }

  try {
    const sys = 'You are a shopping assistant. Return strict JSON matching the schema.'
    const schema = '{ "recommendations": [ { "id": "string", "reason": "string" } ] }'
    const prompt = `User query: ${query}\nCatalog (array of items): ${JSON.stringify(catalog)}\nTask: Recommend up to 5 item ids that best match the user query considering budget, category, and tags.\nRespond ONLY with JSON matching this schema: ${schema}`
    const text = await geminiChat(prompt, sys)
    let parsed
    try { parsed = JSON.parse(text) } catch (_) {
      const start = text.indexOf('{'); const end = text.lastIndexOf('}')
      if (start !== -1 && end !== -1) parsed = JSON.parse(text.slice(start, end + 1))
    }
    if (!parsed || !Array.isArray(parsed.recommendations)) throw new Error('Invalid model response')
    const ids = new Set(catalog.map(c => c.id))
    const cleaned = parsed.recommendations.filter(r => ids.has(String(r.id)))
    return res.json({ recommendations: cleaned, model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' })
  } catch (err) {
    console.error('find-my-product error:', err)
    return res.status(500).json({ error: 'AI processing failed' })
  }
})

module.exports = router
