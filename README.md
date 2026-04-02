# AI海龟汤

一个基于 React + TypeScript + Vite + Tailwind CSS 的 AI 海龟汤网页游戏，配套 Node.js + Express 后端代理 AI 对话请求。

## 项目结构

```text
.
├─ src/                  # 前端源码
├─ server/               # Express 后端服务
├─ dist/                 # 前端构建产物
├─ .env.local            # 本地环境变量
└─ README.md
```

## 环境要求

- Node.js 18+
- npm 9+

如果当前终端里 `node` / `npm` 不可用，可以先执行：

```powershell
$env:Path='C:\Program Files\nodejs;' + $env:Path
```

## 环境变量

在项目根目录创建 `.env.local`，填写：

```env
AI_BASE_URL=https://api.moonshot.cn/v1/chat/completions
AI_MODEL=moonshot-v1-8k
AI_API_KEY=your_api_key_here

# 前端生产环境可选：指向 Railway 后端
VITE_API_BASE_URL=https://ai-turtle-soup-production.up.railway.app
```

说明：

- `AI_*` 变量供本地后端和云端后端读取
- `VITE_API_BASE_URL` 用于前端生产环境直连已部署的后端
- 不要把真实 API Key 提交到 GitHub

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

前端开发代理默认指向 `http://localhost:3000`，所以后端建议跑在 `3000` 端口：

```powershell
cd D:\turtle\server
$env:Path='C:\Program Files\nodejs;' + $env:Path
$env:PORT='3000'
node index.js
```

启动后可访问：

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

## 联调说明

- 前端聊天接口调用 `/api/chat`
- 本地开发时，Vite 会把 `/api/*` 代理到 `http://localhost:3000`
- 后端再去调用 KIMI / Moonshot API

本地联调时请保证：

1. 后端先启动
2. 后端运行在 `3000` 端口
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
    "surface": "当年他抓到女友的头发，以为是水草，松手了。",
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

构建成功后，产物会生成到 [dist](D:/turtle/dist)。

## 部署说明

### 前端

前端已适配部署到 Vercel。

生产环境需要配置：

```text
VITE_API_BASE_URL=https://ai-turtle-soup-production.up.railway.app
```

### 后端

后端已适配部署到 Railway。

Railway 推荐配置：

- Root Directory：`/server`
- Start Command：`npm start`

需要配置的环境变量：

```text
AI_BASE_URL=https://api.moonshot.cn/v1/chat/completions
AI_MODEL=moonshot-v1-8k
AI_API_KEY=你的真实 Key
PORT=3000
```

## 正式上线检查清单

### 基础可用

- 确认 Vercel 打开的是正式域名，而不是旧的预览部署。
- 确认 Railway 的 `/api/test` 能稳定返回 JSON。
- 至少试玩 3 个故事，确认聊天、查看汤底、结束游戏都正常。
- 确认首页、游戏页、结果页在刷新后不会白屏或 404。

### 接口与环境变量

- 确认 Vercel 已配置 `VITE_API_BASE_URL`。
- 确认 Railway 已配置 `AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL`、`PORT`。
- 确认 GitHub 仓库中没有 `.env.local` 或真实 API Key。
- 确认后端已允许正式 Vercel 域名访问。

### 体验与稳定性

- 检查发送消息时的加载状态是否正常。
- 检查接口报错时是否有用户可理解的错误提示。
- 检查没有消息时的空状态是否自然。
- 用手机尺寸实际试一遍，确认输入框、按钮和聊天列表不乱。
- 强制刷新页面后再试玩一次，确认不是依赖浏览器缓存才正常。

### 内容与数据

- 抽查所有故事的汤面、汤底是否正确。
- 抽查难度标签是否符合当前分级：`小菜一碟 / 有点东西 / 真不好啃`。
- 确认首页统计数字与故事数据一致。
- 确认没有明显中文乱码、错别字和占位文案。

### 性能与资源

- 检查首页背景图、按钮图、图标图是否都已使用较轻资源版本。
- 检查字体体积是否还能继续优化，尤其是 `Noto Sans SC`。
- 检查首页首次加载是否明显卡顿。

### 发布与运维

- 保留一条稳定版本提交，方便出现问题时快速回退。
- 先小范围给朋友内测，再决定是否公开传播。
- 保留一份部署说明和环境变量说明，方便后续维护。

## 当前状态

- 前端已成功部署到 Vercel
- 后端已成功部署到 Railway
- 线上聊天功能已验证可用
- 项目可以作为试玩版对外分享

## 后续建议

- 把故事数据和汤底逐步收口到后端，减少前端暴露
- 补更清晰的接口日志和错误追踪
- 增加题库管理能力
- 继续优化移动端体验和资源体积
