import { ReactFlowProvider } from '@xyflow/react'
import TopBar from './components/TopBar'
import NodePanel from './components/NodePanel'
import WorkflowCanvas from './components/WorkflowCanvas'
import PropertiesPanel from './components/PropertiesPanel'

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <NodePanel />
          <main className="flex-1 relative">
            <WorkflowCanvas />
          </main>
          <PropertiesPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}