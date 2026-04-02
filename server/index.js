import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import cors from 'cors'
import express from 'express'

const app = express()
const PORT = Number(process.env.PORT || 3010)
const REQUEST_TIMEOUT_MS = 15000
const ROOT_ENV_FILES = [resolve(process.cwd(), '..', '.env.local'), resolve(process.cwd(), '..', '.env')]

const loadEnvFile = (filePath) => {
  if (!existsSync(filePath)) {
    return
  }

  const content = readFileSync(filePath, 'utf8')

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmedLine.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const loadLocalEnv = () => {
  ROOT_ENV_FILES.forEach(loadEnvFile)
}

const buildPrompt = (question, story) => `
你是一个海龟汤游戏的主持人。

当前故事的汤面是：${story.surface}
故事的汤底是：${story.bottom}

玩家会向你提问，你只能回答以下三种之一：
1. "是"：玩家的猜测与汤底一致
2. "否"：玩家的猜测与汤底矛盾
3. "无关"：玩家的猜测与汤底无关，无法判断

注意：
1. 严格根据汤底判断，不要额外推理
2. 只回答"是"、"否"、"无关"，不要解释
3. 保持神秘感，不要透露汤底

玩家问：${question}
请回答：
`.trim()

const normalizeAnswer = (content) => {
  const trimmedContent = String(content || '').trim()

  if (trimmedContent.includes('无关')) {
    return '无关'
  }

  if (trimmedContent.includes('是')) {
    return '是'
  }

  if (trimmedContent.includes('否')) {
    return '否'
  }

  return trimmedContent
}

const fetchWithTimeout = async (url, init, timeoutMs) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload)
}

const getKimiConfig = () => {
  const apiKey = process.env.AI_API_KEY || process.env.KIMI_API_KEY
  const apiUrl =
    process.env.AI_BASE_URL || process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1/chat/completions'
  const model = process.env.AI_MODEL || process.env.KIMI_MODEL || 'moonshot-v1-8k'

  return {
    apiKey,
    apiUrl,
    model,
  }
}

const askKimi = async (question, story) => {
  const { apiKey, apiUrl, model } = getKimiConfig()

  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error: '未检测到 KIMI API Key，请检查根目录 .env.local 配置。',
    }
  }

  try {
    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: buildPrompt(question, story),
            },
          ],
          temperature: 0,
        }),
      },
      REQUEST_TIMEOUT_MS,
    )

    const result = await response.json()

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: result.error?.message || 'KIMI API 调用失败，请稍后重试。',
      }
    }

    const answer = result.choices?.[0]?.message?.content

    if (!answer) {
      return {
        ok: false,
        status: 502,
        error: 'KIMI 返回内容为空，请检查模型配置。',
      }
    }

    return {
      ok: true,
      answer: normalizeAnswer(answer),
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        ok: false,
        status: 504,
        error: '请求 KIMI 超时，请检查网络后重试。',
      }
    }

    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : '服务器调用 KIMI 时发生未知错误。',
    }
  }
}

loadLocalEnv()

const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/127\.0\.0\.1:5173$/,
  /^http:\/\/localhost:5173$/,
  /^https:\/\/ai-turtle-soup-dun\.vercel\.app$/,
  /^https:\/\/ai-turtle-soup-git-main-gnijey-hhs-projects\.vercel\.app$/,
  /^https:\/\/ai-turtle-soup-[a-z0-9-]+-gnijey-hhs-projects\.vercel\.app$/,
]

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json())
app.use((error, _req, res, next) => {
  if (error) {
    if (error instanceof SyntaxError && 'body' in error) {
      sendJson(res, 400, { error: '请求体不是合法的 JSON。' })
      return
    }

    sendJson(res, 500, { error: '服务器内部出现异常。' })
    return
  }

  next()
})

app.get('/api/test', (_req, res) => {
  sendJson(res, 200, {
    message: 'Backend is running.',
    time: new Date().toISOString(),
  })
})

app.post('/api/chat', async (req, res) => {
  const { question, story } = req.body ?? {}

  if (typeof question !== 'string' || !question.trim()) {
    sendJson(res, 400, { error: 'question 不能为空。' })
    return
  }

  if (
    !story ||
    typeof story !== 'object' ||
    typeof story.title !== 'string' ||
    typeof story.surface !== 'string' ||
    typeof story.bottom !== 'string'
  ) {
    sendJson(res, 400, { error: 'story 参数不完整。' })
    return
  }

  const result = await askKimi(question.trim(), story)

  if (!result.ok) {
    sendJson(res, result.status, { error: result.error })
    return
  }

  sendJson(res, 200, { answer: result.answer })
})

app.listen(PORT, () => {
  console.log(`Backend server is running at http://127.0.0.1:${PORT}`)
})
