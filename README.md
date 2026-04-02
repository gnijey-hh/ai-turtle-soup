# AI海龟汤

一个基于 React + TypeScript + Vite + Tailwind CSS 的 AI 海龟汤网页游戏，配套 Node.js + Express 后端负责代理 AI 对话请求。

## 项目结构

```text
.
├─ src/                  # 前端源码
├─ server/               # 后端服务
├─ dist/                 # 前端构建产物
├─ .env.local            # 本地环境变量
└─ README.md
```

## 环境要求

- Node.js 18+
- npm 9+

如果你的终端里 `node` / `npm` 不可用，可以先执行：

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path
```

## 环境变量

在项目根目录创建 `.env.local`，填写：

```env
AI_BASE_URL=https://api.moonshot.cn/v1/chat/completions
AI_MODEL=moonshot-v1-8k
AI_API_KEY=your_api_key_here
```

说明：

- 前端开发代理和后端本地服务都会读取这份配置
- 不要把真实 API Key 提交到仓库

## 本地开发

### 1. 安装前端依赖

```powershell
cd D:\turtle
npm install
```

### 2. 安装后端依赖

```powershell
cd D:\turtle\server
npm install
```

### 3. 启动后端

当前前端代理默认指向 `http://localhost:3000`，所以后端请跑在 `3000` 端口：

```powershell
cd D:\turtle\server
$env:Path='C:\Program Files\nodejs;' + $env:Path
$env:PORT='3000'
node index.js
```

启动成功后，可访问：

```text
http://127.0.0.1:3000/api/test
```

### 4. 启动前端

```powershell
cd D:\turtle
$env:Path='C:\Program Files\nodejs;' + $env:Path
npm run dev
```

前端开发地址通常为：

```text
http://127.0.0.1:5173/
```

## 前后端联调说明

- 前端聊天接口调用 `/api/chat`
- Vite 会把 `/api/*` 代理到 `http://localhost:3000`
- 后端再调用 KIMI / Moonshot API

所以本地联调时，请保证：

1. 后端先启动
2. 后端跑在 `3000` 端口
3. 前端再启动

## 后端接口

### GET `/api/test`

测试服务是否正常运行。

示例返回：

```json
{
  "message": "Backend is running.",
  "time": "2026-04-02T00:00:00.000Z"
}
```

### POST `/api/chat`

用于向 AI 主持人提问。

请求体：

```json
{
  "question": "这是意外吗？",
  "story": {
    "id": "10",
    "title": "河边散步",
    "difficulty": "hard",
    "surface": "当年他抓到女友的头发，以为是水草，松手了。知道河里没水草后，崩溃自杀。",
    "bottom": "完整汤底内容"
  }
}
```

成功返回：

```json
{
  "answer": "是"
}
```

失败返回：

```json
{
  "error": "错误信息"
}
```

## 前端构建

在项目根目录执行：

```powershell
cd D:\turtle
$env:Path='C:\Program Files\nodejs;' + $env:Path
npm run build
```

构建成功后，前端产物会生成到：

- [dist](D:/turtle/dist)

## 部署建议

### 前端

前端可部署到任意静态托管平台，例如：

- Vercel
- Netlify
- Nginx 静态站点

### 后端

后端建议部署到可运行 Node.js 的服务上，例如：

- 云服务器
- Railway
- Render
- Docker 容器

注意：

- 生产环境不要让前端直连 AI 服务
- API Key 只放在后端环境变量
- 生产环境应把 Vite 代理替换成真实后端域名

## 当前已验证

- 前端 `npm run build` 可成功构建
- 后端可启动并返回 `/api/test`
- 前端可通过代理调用后端 `/api/chat`

## 后续建议

- 把故事数据和汤底逐步迁移到后端，减少前端直接暴露汤底
- 为前后端分别补充更清晰的错误日志
- 增加一键启动脚本，减少本地开发时手动开两个终端
