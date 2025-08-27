// Large Language Model API client. Never expose API key to client.
const fetch = (...a) => import('node-fetch').then(({ default: f }) => f(...a))

const API_KEY = process.env.LLM_API_KEY
const MODEL = process.env.LLM_MODEL || 'advanced-llm-model'

async function llmChat(prompt, sys = 'You are a helpful shopping AI.') {
  if (!API_KEY) throw new Error('LLM_API_KEY is not set')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    systemInstruction: { parts: [{ text: sys }] },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`LLM API Error ${res.status} ${txt}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return text
}

module.exports = { llmChat }
