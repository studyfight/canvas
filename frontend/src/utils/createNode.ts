import type { NodeKind } from './nodeTypes'

export interface BaseNodeData {
  label?: string
  status?: 'idle' | 'running' | 'success' | 'error'
  errorMessage?: string
  [key: string]: unknown
}

export function createNodeData(kind: NodeKind): BaseNodeData {
  switch (kind) {
    case 'text':
      return {
        text: '',
        status: 'idle',
      }
    case 'input':
      return {
        imageUrl: '',
        status: 'idle',
      }
    case 'image':
      return {
        function: 'txt2img',
        prompt: '',
        model: '',
        outputImageUrl: '',
        status: 'idle',
      }
    case 'video':
      return {
        function: 'txt2video',
        prompt: '',
        model: '',
        outputVideoUrl: '',
        status: 'idle',
      }
    default:
      return {
        status: 'idle',
      }
  }
}