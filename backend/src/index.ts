import express from 'express'
import cors from 'cors'
import { workflowRouter } from './routes/workflow.js'

const app = express()
const PORT = process.env.PORT || 4000

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 路由
app.use('/api/workflow', workflowRouter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 画布1 后端运行在端口 ${PORT}`)
  console.log(`   健康检查: http://localhost:${PORT}/api/health`)
})