import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const workflowRouter = Router()

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'workflows')

// 确保存储目录存在
function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
}

interface Workflow {
  id: string
  name: string
  nodes: any[]
  edges: any[]
  createdAt: string
  updatedAt: string
}

// 列出所有工作流
workflowRouter.get('/', (req, res) => {
  try {
    ensureStorageDir()
    const files = fs.readdirSync(STORAGE_DIR).filter((f) => f.endsWith('.json'))
    const workflows = files.map((f) => {
      const content = fs.readFileSync(path.join(STORAGE_DIR, f), 'utf-8')
      return JSON.parse(content)
    })
    // 按更新时间倒序
    workflows.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    res.json({ workflows })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// 获取单个工作流
workflowRouter.get('/:id', (req, res) => {
  try {
    ensureStorageDir()
    const file = path.join(STORAGE_DIR, `${req.params.id}.json`)
    if (!fs.existsSync(file)) {
      return res.status(404).json({ error: '工作流不存在' })
    }
    const content = fs.readFileSync(file, 'utf-8')
    res.json(JSON.parse(content))
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// 创建工作流
workflowRouter.post('/', (req, res) => {
  try {
    ensureStorageDir()
    const id = `wf_${crypto.randomBytes(6).toString('hex')}`
    const now = new Date().toISOString()
    const workflow: Workflow = {
      id,
      name: req.body.name || '未命名工作流',
      nodes: req.body.nodes || [],
      edges: req.body.edges || [],
      createdAt: now,
      updatedAt: now,
    }
    fs.writeFileSync(
      path.join(STORAGE_DIR, `${id}.json`),
      JSON.stringify(workflow, null, 2),
      'utf-8',
    )
    res.json(workflow)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// 更新工作流
workflowRouter.put('/:id', (req, res) => {
  try {
    ensureStorageDir()
    const file = path.join(STORAGE_DIR, `${req.params.id}.json`)
    if (!fs.existsSync(file)) {
      return res.status(404).json({ error: '工作流不存在' })
    }
    const existing = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const updated: Workflow = {
      ...existing,
      ...req.body,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    }
    fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf-8')
    res.json(updated)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// 删除工作流
workflowRouter.delete('/:id', (req, res) => {
  try {
    const file = path.join(STORAGE_DIR, `${req.params.id}.json`)
    if (!fs.existsSync(file)) {
      return res.status(404).json({ error: '工作流不存在' })
    }
    fs.unlinkSync(file)
    res.json({ success: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})