import { memo, useRef } from 'react'
import {
  Handle,
  Position,
  type NodeProps,
  useReactFlow,
} from '@xyflow/react'
import { Upload, Trash2, ImagePlus, X } from 'lucide-react'

interface InputNodeData {
  imageUrl?: string
  status?: string
  [key: string]: unknown
}

function InputNode({ data, selected, id }: NodeProps) {
  const d = data as InputNodeData
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData, deleteElements } = useReactFlow()

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      updateNodeData(id, { imageUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    updateNodeData(id, { imageUrl: '' })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteElements({ nodes: [{ id }] })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div
      className={`min-w-[260px] max-w-[320px] rounded-xl bg-white border-2 transition-all ${
        selected ? 'border-amber-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 rounded-t-xl bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Upload className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700">素材</span>
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {d.imageUrl ? (
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-200">
            <img
              src={d.imageUrl}
              alt="上传"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="nodrag w-full aspect-square rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-400 transition-colors flex flex-col items-center justify-center gap-2 text-amber-700"
          >
            <ImagePlus className="w-8 h-8" />
            <span className="text-xs font-medium">点击上传 / 拖拽图片</span>
            <span className="text-[10px] text-amber-600/70">
              支持 JPG / PNG / WebP
            </span>
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-amber-500 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default memo(InputNode)