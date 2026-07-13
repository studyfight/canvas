import { useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react'

import type { NodeKind } from '../utils/nodeTypes'
import { createNodeData } from '../utils/createNode'
import TextNode from '../nodes/TextNode'
import ImageNode from '../nodes/ImageNode'
import VideoNode from '../nodes/VideoNode'
import InputNode from '../nodes/InputNode'
import { useWorkflowStore } from '../store/workflowStore'

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
  input: InputNode,
}

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const onConnect = useWorkflowStore((s) => s.onConnect)
  const addNode = useWorkflowStore((s) => s.addNode)

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const kind = event.dataTransfer.getData('application/reactflow') as NodeKind
    if (!kind || !reactFlowInstance || !reactFlowWrapper.current) return

    const bounds = reactFlowWrapper.current.getBoundingClientRect()
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    })

    const newNode: Node = {
      id: `${kind}_${Date.now()}`,
      type: kind,
      position,
      data: createNodeData(kind),
    }

    addNode(newNode)
  }

  const isEmpty = nodes.length === 0

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView={!isEmpty}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#a78bfa', strokeWidth: 2 },
        }}
      >
        <Background gap={20} size={1.5} color="#e5e7eb" />
        <Controls />
        <MiniMap
          nodeStrokeColor="#a78bfa"
          nodeColor="#ede9fe"
          maskColor="rgba(243, 244, 246, 0.7)"
        />
      </ReactFlow>

      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#emptyGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="emptyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              从左侧拖入节点开始
            </h3>
            <p className="text-sm text-gray-500">
              选择「文本」「图片」或「视频」节点搭建你的第一个工作流
            </p>
          </div>
        </div>
      )}
    </div>
  )
}