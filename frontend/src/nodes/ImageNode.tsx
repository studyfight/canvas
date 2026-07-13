import { memo } from 'react'
import {
  Handle,
  Position,
  type NodeProps,
  useReactFlow,
} from '@xyflow/react'
import { Image as ImageIcon, Trash2, Loader2, Wand2 } from 'lucide-react'

interface ImageNodeData {
  function?: 'txt2img' | 'img2img'
  prompt?: string
  model?: string
  outputImageUrl?: string
  status?: 'idle' | 'running' | 'success' | 'error'
  errorMessage?: string
  [key: string]: unknown
}

const MODELS = [
  { value: 'gemini-3-pro-image-preview', label: 'Gemini 3 Pro (Nano banana2)' },
  { value: 'gemini-2.5-flash-image-preview', label: 'Gemini 2.5 Flash (Nano banana)' },
  { value: 'doubao-seedream-4-0-250828', label: 'Doubao Seedream 4.0' },
  { value: 'kling-v1-5', label: 'Kling v1.5' },
  { value: 'kling-v2-1', label: 'Kling v2.1 (多图)' },
]

function ImageNode({ data, selected, id }: NodeProps) {
  const d = data as ImageNodeData
  const status = d.status || 'idle'
  const { updateNodeData, deleteElements } = useReactFlow()

  const updateField = (field: string, value: unknown) => {
    updateNodeData(id, { [field]: value })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteElements({ nodes: [{ id }] })
  }

  return (
    <div
      className={`min-w-[320px] max-w-[400px] rounded-xl bg-white border-2 transition-all ${
        selected ? 'border-cyan-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 rounded-t-xl bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <ImageIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700">图片生成</span>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg">
          {(['txt2img', 'img2img'] as const).map((fn) => (
            <button
              key={fn}
              type="button"
              onClick={() => updateField('function', fn)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                d.function === fn
                  ? 'bg-white text-cyan-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {fn === 'txt2img' ? '文生图' : '图生图'}
            </button>
          ))}
        </div>

        <textarea
          defaultValue={d.prompt || ''}
          onChange={(e) => updateField('prompt', e.target.value)}
          placeholder="描述要生成的图片..."
          rows={2}
          className="nodrag w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 resize-none"
        />

        <select
          value={d.model || ''}
          onChange={(e) => updateField('model', e.target.value)}
          className="nodrag w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 bg-white"
        >
          <option value="">选择模型</option>
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
          {status === 'running' ? (
            <div className="flex flex-col items-center gap-2 text-cyan-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs">生成中...</span>
            </div>
          ) : d.outputImageUrl ? (
            <img
              src={d.outputImageUrl}
              alt="输出"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Wand2 className="w-8 h-8" />
              <span className="text-xs">生成的图片将显示在这里</span>
            </div>
          )}
        </div>

        {status === 'error' && d.errorMessage && (
          <div className="text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded">
            {d.errorMessage}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{ top: '50%' }}
        className="!bg-cyan-500 !border-white !w-3 !h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="image"
        style={{ top: '70%' }}
        className="!bg-amber-500 !border-white !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-cyan-500 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default memo(ImageNode)