import express from 'express'

const app = express()
const PORT = 3000

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'motorsport-grid-backend',
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})
