import type { Story } from './types/game'

type TChatResponse = {
  answer?: string
  error?: string
}

const CHAT_API_URL = '/api/chat'

const normalizeAnswer = (content: string) => {
  const trimmedContent = content.trim()

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

const toFriendlyError = (message: string) => {
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('networkerror') ||
    lowerMessage.includes('network error')
  ) {
    return '无法连接到后端服务，请确认 http://localhost:3000 已正常启动。'
  }

  if (
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('timed out') ||
    lowerMessage.includes('aborted')
  ) {
    return '请求超时了，请稍后重试。'
  }

  return message
}

const parseResponseSafely = async (response: Response): Promise<TChatResponse> => {
  const rawText = await response.text()

  if (!rawText.trim()) {
    return {}
  }

  try {
    return JSON.parse(rawText) as TChatResponse
  } catch {
    throw new Error('后端没有返回有效 JSON。')
  }
}

export async function askAI(question: string, story: Story): Promise<string> {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        story,
      }),
    })

    const result = await parseResponseSafely(response)

    if (!response.ok) {
      throw new Error(result.error || 'AI 请求失败，请稍后重试。')
    }

    if (!result.answer) {
      throw new Error('AI 返回内容为空，请检查后端配置。')
    }

    return normalizeAnswer(result.answer)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI 调用失败：${toFriendlyError(error.message)}`)
    }

    throw new Error('AI 调用失败，请检查网络和后端服务。')
  }
}
