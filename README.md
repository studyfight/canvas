# 画布1 - AI 工作流画布

一个轻量级的 AI 工作流画布，基于 ReactFlow，支持拖拽节点搭建 AI 生成流程。

## 技术栈

- **前端**：React 18 + Vite + TypeScript + ReactFlow + TailwindCSS
- **后端**：Express + TypeScript
- **AI 集成**：APIMart / Kling / 向量引擎

## 快速开始

```bash
# 安装依赖
npm run install:all

# 配置后端环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 填入 API Key

# 启动开发服务器
npm run dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:4000

## 功能

- 🎨 拖拽式画布编辑
- 📦 多种节点类型（文本、图片、视频、输入）
- 🔌 AI 集成（文生图、图生图、文生视频、图生视频）
- 💾 工作流保存/加载

## 目录结构

```
画布1/
├── frontend/     # React + Vite 前端
├── backend/      # Express 后端
└── package.json  # 根配置
```