import { create } from 'zustand'
import {
  type Node,
  type Edge,
  type Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'

const API_BASE = '/api/workflow'

export interface WorkflowMeta {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface WorkflowState {
  // 工作流 ID（保存后才有）
  workflowId: string | null
  workflowName: string

  nodes: Node[]
  edges: Edge[]

  // Actions
  setWorkflowName: (name: string) => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: Node) => void
  reset: () => void

  // 持久化
  save: () => Promise<WorkflowMeta | null>
  load: (id: string) => Promise<void>
  listWorkflows: () => Promise<WorkflowMeta[]>
  newWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: null,
  workflowName: '未命名工作流',
  nodes: [],
  edges: [],

  setWorkflowName: (name) => set({ workflowName: name }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) })
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) })
  },
  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) })
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
  },
  reset: () => {
    set({ nodes: [], edges: [], workflowId: null, workflowName: '未命名工作流' })
  },

  save: async () => {
    const { workflowId, workflowName, nodes, edges } = get()
    try {
      const body = JSON.stringify({ name: workflowName, nodes, edges })
      const url = workflowId
        ? `${API_BASE}/${workflowId}`
        : API_BASE
      const method = workflowId ? 'PUT' : 'POST'
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      if (!resp.ok) throw new Error('保存失败')
      const data = await resp.json()
      set({ workflowId: data.id, workflowName: data.name })
      return data
    } catch (e) {
      console.error('保存失败:', e)
      return null
    }
  },

  load: async (id) => {
    try {
      const resp = await fetch(`${API_BASE}/${id}`)
      if (!resp.ok) throw new Error('加载失败')
      const data = await resp.json()
      set({
        workflowId: data.id,
        workflowName: data.name,
        nodes: data.nodes || [],
        edges: data.edges || [],
      })
    } catch (e) {
      console.error('加载失败:', e)
    }
  },

  listWorkflows: async () => {
    try {
      const resp = await fetch(API_BASE)
      if (!resp.ok) return []
      const data = await resp.json()
      return data.workflows || []
    } catch {
      return []
    }
  },

  newWorkflow: () => {
    set({ workflowId: null, workflowName: '未命名工作流', nodes: [], edges: [] })
  },
}))