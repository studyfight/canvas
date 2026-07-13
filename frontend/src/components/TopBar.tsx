import { useState } from 'react'
import { Sparkles, Save, FolderOpen, Play, Plus, Check } from 'lucide-react'
import { useWorkflowStore } from '../store/workflowStore'

export default function TopBar() {
  const workflowName = useWorkflowStore((s) => s.workflowName)
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName)
  const save = useWorkflowStore((s) => s.save)
  const load = useWorkflowStore((s) => s.load)
  const listWorkflows = useWorkflowStore((s) => s.listWorkflows)
  const newWorkflow = useWorkflowStore((s) => s.newWorkflow)
  const workflowId = useWorkflowStore((s) => s.workflowId)
  const nodesCount = useWorkflowStore((s) => s.nodes.length)

  const [showOpen, setShowOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    const result = await save()
    if (result) {
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }
  }

  const handleOpen = async (id: string) => {
    await load(id)
    setShowOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 glass-card border-b border-gray-200/50">
      <div className="flex items-center gap-6">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-border flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">画布1</span>
        </a>

        <div className="h-6 w-px bg-gray-200" />

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <a
            href="#"
            className="px-3 py-1.5 rounded-lg font-medium text-violet-700 bg-violet-50"
          >
            画布
          </a>
          <a
            href="#"
            className="px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            模板
          </a>
          <a
            href="#"
            className="px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            资源库
          </a>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-8 flex items-center gap-2">
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="nodrag w-full text-center text-sm font-medium bg-transparent border-none focus:outline-none focus:bg-white/80 rounded-lg py-1.5 transition-colors"
          placeholder="工作流名称"
        />
        {workflowId && (
          <span className="text-[10px] text-gray-400 font-mono">已保存</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={newWorkflow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          title="新建"
        >
          <Plus className="w-4 h-4" />
          新建
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            saved
              ? 'text-green-700 bg-green-50'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="保存"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? '已保存' : '保存'}
        </button>
        <button
          type="button"
          onClick={async () => {
            const list = await listWorkflows()
            setShowOpen(true)
            // 简单 alert 列出（实际可以做更好的下拉）
            if (list.length === 0) {
              alert('暂无保存的工作流')
              setShowOpen(false)
            } else {
              const choice = window.prompt(
                `选择工作流 ID（输入后回车）：\n\n${list
                  .map((w) => `${w.id}  ${w.name}  (${w.updatedAt})`)
                  .join('\n')}`,
              )
              if (choice) handleOpen(choice)
              setShowOpen(false)
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          title="打开"
        >
          <FolderOpen className="w-4 h-4" />
          打开
        </button>
        <div className="h-6 w-px bg-gray-200 mx-1" />
        <button
          type="button"
          disabled={nodesCount === 0}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white gradient-border hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          运行
        </button>
      </div>
      {/* 隐藏的 showOpen 状态避免警告 */}
      <div className="hidden">{String(showOpen)}</div>
    </header>
  )
}