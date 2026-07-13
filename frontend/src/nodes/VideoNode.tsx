import { memo } from 'react'
import {
  Handle,
  Position,
  type NodeProps,
  useReactFlow,
} from '@xyflow/react'
import { Video, Trash2, Loader2, Wand2 } from 'lucide-react'

interface VideoNodeData {
  function?: 'txt2video' | 'img2video'
  prompt?: string
  model?: string
  outputVideoUrl?: string
  status?: 'idle' | 'running' | 'success' | 'error'
  errorMessage?: string
  [key: string]: unknown
}

const MODELS = [
  { value: 'veo3.1-fast', label: 'VEO 3.1 Fast' },
  { value: 'veo3.1-quality', label: 'VEO 3.1 Quality' },
  { value: 'doubao-seedance-1-0-pro-fast', label: 'Doubao Seedance Pro Fast' },
]

function VideoNode({ data, selected, id }: NodeProps) {
  const d = data as VideoNodeData
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
        selected ? 'border-violet-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 rounded-t-xl bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Video className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700">视频生成</span>
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
          {(['txt2video', 'img2video'] as const).map((fn) => (
            <button
              key={fn}
              type="button"
              onClick={() => updateField('function', fn)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                d.function === fn
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {fn === 'txt2video' ? '文生视频' : '图生视频'}
            </button>
          ))}
        </div>

        <textarea
          defaultValue={d.prompt || ''}
          onChange={(e) => updateField('prompt', e.target.value)}
          placeholder="描述要生成的视频..."
          rows={2}
          className="nodrag w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none"
        />

        <select
          value={d.model || ''}
          onChange={(e) => updateField('model', e.target.value)}
          className="nodrag w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 bg-white"
        >
          <option value="">选择模型</option>
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
          {status === 'running' ? (
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs">生成中...</span>
            </div>
          ) : d.outputVideoUrl ? (
            <video
              src={d.outputVideoUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Wand2 className="w-8 h-8" />
              <span className="text-xs">生成的视频将显示在这里</span>
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
        className="!bg-violet-500 !border-white !w-3 !h-3"
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
        className="!bg-violet-500 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default memo(VideoNode)