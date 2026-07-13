import { Settings2 } from 'lucide-react'

export default function PropertiesPanel() {
  return (
    <aside className="w-72 border-l border-gray-200/60 bg-white/40 backdrop-blur-sm flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200/60">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Settings2 className="w-3.5 h-3.5" />
          属性
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Settings2 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">选中节点查看属性</p>
          <p className="text-xs text-gray-400 mt-1">在画布上点击任意节点</p>
        </div>
      </div>
    </aside>
  )
}