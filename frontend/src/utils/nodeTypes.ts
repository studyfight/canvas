// 节点类型定义
import {
  Type,
  Image as ImageIcon,
  Video,
  Upload,
  Sparkles,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type NodeKind = 'text' | 'image' | 'video' | 'input'

export interface NodeTypeDef {
  kind: NodeKind
  label: string
  description: string
  category: '输入' | '生成' | '输出'
  icon: ComponentType<{ size?: number; className?: string }>
  color: string // 渐变色 class
  inputs: number
  outputs: number
}

export const NODE_TYPES: NodeTypeDef[] = [
  {
    kind: 'text',
    label: '文本',
    description: '输入提示词',
    category: '输入',
    icon: Type,
    color: 'from-slate-500 to-slate-700',
    inputs: 0,
    outputs: 1,
  },
  {
    kind: 'input',
    label: '素材',
    description: '上传本地图片',
    category: '输入',
    icon: Upload,
    color: 'from-amber-500 to-orange-600',
    inputs: 0,
    outputs: 1,
  },
  {
    kind: 'image',
    label: '图片',
    description: '文生图 / 图生图',
    category: '生成',
    icon: ImageIcon,
    color: 'from-cyan-500 to-blue-600',
    inputs: 2,
    outputs: 1,
  },
  {
    kind: 'video',
    label: '视频',
    description: '文生视频 / 图生视频',
    category: '生成',
    icon: Video,
    color: 'from-violet-500 to-purple-600',
    inputs: 2,
    outputs: 1,
  },
]

export const CATEGORIES = ['输入', '生成', '输出'] as const