import { useMemo } from 'react'
import { NODE_TYPES, CATEGORIES, type NodeKind } from '../utils/nodeTypes'

export default function NodePanel() {
  const grouped = useMemo(() => {
    const map: Record<string, typeof NODE_TYPES> = {}
    for (const cat of CATEGORIES) map[cat] = []
    for (const node of NODE_TYPES) map[node.category].push(node)
    return map
  }, [])

  const handleDragStart = (e: React.DragEvent, kind: NodeKind) => {
    e.dataTransfer.setData('application/reactflow', kind)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-64 border-r border-gray-200/60 bg-white/40 backdrop-blur-sm flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200/60">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          节点
        </h2>
        <p className="text-xs text-gray-400 mt-1">拖拽到画布</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {CATEGORIES.map((category) => {
          const nodes = grouped[category]
          if (nodes.length === 0) return null
          return (
            <div key={category}>
              <div className="px-2 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {category}
              </div>
              <div className="space-y-2">
                {nodes.map((node) => {
                  const Icon = node.icon
                  return (
                    <button
                      key={node.kind}
                      type="button"
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.kind)}
                      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white hover:shadow-md border border-gray-200 hover:border-violet-300 transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {node.label}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {node.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-4 py-3 border-t border-gray-200/60 text-[11px] text-gray-400">
        💡 提示：从左侧拖入节点到画布
      </div>
    </aside>
  )
}