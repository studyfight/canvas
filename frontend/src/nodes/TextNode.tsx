import { memo } from 'react'
import {
  Handle,
  Position,
  type NodeProps,
  useReactFlow,
} from '@xyflow/react'
import { Type, Trash2 } from 'lucide-react'

interface TextNodeData {
  text?: string
  status?: string
  [key: string]: unknown
}

function TextNode({ data, selected, id }: NodeProps) {
  const d = data as TextNodeData
  const { updateNodeData, deleteElements } = useReactFlow()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`
    updateNodeData(id, { text: e.target.value })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteElements({ nodes: [{ id }] })
  }

  return (
    <div
      className={`group min-w-[280px] max-w-[360px] rounded-xl bg-white border-2 transition-all ${
        selected ? 'border-slate-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 rounded-t-xl bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
            <Type className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700">文本</span>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>

      <div className="p-3">
        <textarea
          defaultValue={d.text || ''}
          onChange={handleChange}
          placeholder="输入提示词..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 resize-none nodrag"
          style={{ minHeight: '60px' }}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-500 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default memo(TextNode)