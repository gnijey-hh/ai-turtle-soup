import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { askAI } from '../api'
import turtleImage from '../assets/effects/turtle.webp'
import { ChatBox } from '../components/ChatBox'
import { getStoryById } from '../data/stories'
import type { Story, TGameStatus, TMessage } from '../types/game'

const DIFFICULTY_LABELS: Record<Story['difficulty'], string> = {
  easy: '小菜一碟',
  medium: '有点东西',
  hard: '真不好啃',
}

const STATUS_LABELS: Record<TGameStatus, string> = {
  playing: '进行中',
  ended: '已结束',
  abandoned: '已放弃',
}

const normalizeGuessText = (value: string) =>
  value.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()

const getLongestCommonSubstringLength = (source: string, target: string) => {
  if (!source || !target) {
    return 0
  }

  const matrix = Array.from({ length: source.length + 1 }, () =>
    Array<number>(target.length + 1).fill(0),
  )
  let longest = 0

  for (let i = 1; i <= source.length; i += 1) {
    for (let j = 1; j <= target.length; j += 1) {
      if (source[i - 1] !== target[j - 1]) {
        continue
      }

      matrix[i][j] = matrix[i - 1][j - 1] + 1
      if (matrix[i][j] > longest) {
        longest = matrix[i][j]
      }
    }
  }

  return longest
}

const isSolvedGuess = (question: string, story: Story) => {
  const normalizedQuestion = normalizeGuessText(question)
  const normalizedBottom = normalizeGuessText(story.bottom)
  const normalizedSurface = normalizeGuessText(story.surface)

  if (normalizedQuestion.length < 6) {
    return false
  }

  const longestBottomMatch = getLongestCommonSubstringLength(normalizedQuestion, normalizedBottom)
  const longestSurfaceMatch = getLongestCommonSubstringLength(normalizedQuestion, normalizedSurface)
  const bottomMatchRatio =
    longestBottomMatch / Math.max(1, Math.min(normalizedQuestion.length, normalizedBottom.length))

  return (
    longestBottomMatch >= 6 &&
    bottomMatchRatio >= 0.42 &&
    longestBottomMatch > longestSurfaceMatch
  )
}

const getStatusStorageKey = (storyId: string) => `turtle-status:${storyId}`

export function Game() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const story = getStoryById(id)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState<TGameStatus>('playing')
  const [messages, setMessages] = useState<TMessage[]>([])

  useEffect(() => {
    if (!story) {
      return
    }

    sessionStorage.setItem(getStatusStorageKey(story.id), 'playing')
    setGameStatus('playing')
    setErrorMessage(null)
    setMessages([])
  }, [story])

  if (!story) {
    return <Navigate replace to="/" />
  }

  const handleSendMessage = async (content: string) => {
    if (gameStatus !== 'playing') {
      return
    }

    const timestamp = Date.now()
    const userMessage: TMessage = {
      id: `user-${crypto.randomUUID()}`,
      role: 'user',
      content,
      timestamp,
    }

    setErrorMessage(null)
    setMessages((currentMessages) => [...currentMessages, userMessage])
    setIsLoading(true)

    try {
      const answer = await askAI(content, story)
      const solved = answer === '是' && isSolvedGuess(content, story)
      const assistantMessage: TMessage = {
        id: `assistant-${crypto.randomUUID()}`,
        role: 'assistant',
        content: answer,
        timestamp: timestamp + 1,
      }

      if (solved) {
        const celebrationMessage: TMessage = {
          id: `assistant-win-${crypto.randomUUID()}`,
          role: 'assistant',
          content: '恭喜你，答对了！你已经还原出这个故事，可以直接查看汤底了。',
          timestamp: timestamp + 2,
        }
        const nextStatus: TGameStatus = 'ended'

        sessionStorage.setItem(getStatusStorageKey(story.id), nextStatus)
        setGameStatus(nextStatus)
        setMessages((currentMessages) => [...currentMessages, assistantMessage, celebrationMessage])
        return
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'AI 调用失败，请检查网络和配置。',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReveal = () => {
    const nextStatus: TGameStatus = 'ended'
    sessionStorage.setItem(getStatusStorageKey(story.id), nextStatus)
    setGameStatus(nextStatus)

    navigate(`/result/${story.id}`, {
      state: { messages, status: nextStatus },
    })
  }

  const handleQuit = () => {
    const nextStatus: TGameStatus = 'abandoned'
    sessionStorage.setItem(getStatusStorageKey(story.id), nextStatus)
    setGameStatus(nextStatus)
    navigate('/', {
      state: { lastStoryId: story.id, status: nextStatus },
    })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <section className="relative overflow-hidden rounded-lg border border-emerald-400/20 bg-black/35 p-3.5 shadow-lg shadow-emerald-950/25 transition duration-300 sm:p-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${turtleImage})` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(3,9,7,0.88)_0%,rgba(3,9,7,0.74)_48%,rgba(3,9,7,0.58)_100%)]"
        />
        <div className="relative z-10 flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">当前故事</p>
            <div className="mt-1.5">
              <h1 className="story-title font-home-display text-[1.75rem] font-semibold leading-tight sm:text-[2rem]">
                <span aria-hidden="true" className="story-title__trail story-title__trail--far">
                  {story.title}
                </span>
                <span aria-hidden="true" className="story-title__trail story-title__trail--mid">
                  {story.title}
                </span>
                <span className="story-title__text">{story.title}</span>
              </h1>
            </div>
            <p className="mt-2 text-sm leading-5 text-stone-300/90">{story.surface}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-medium text-amber-300 transition duration-200 hover:bg-amber-400/15">
              {DIFFICULTY_LABELS[story.difficulty]}
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 transition duration-200 hover:bg-emerald-400/15">
              {STATUS_LABELS[gameStatus]}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-3">
        <ChatBox
          disabled={gameStatus !== 'playing'}
          errorMessage={errorMessage}
          isLoading={isLoading}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </section>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          className="rounded-lg border border-amber-400/50 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-300 transition duration-200 hover:-translate-y-px hover:bg-amber-400/20 hover:shadow-lg hover:shadow-amber-950/25"
          onClick={handleReveal}
          type="button"
        >
          查看汤底
        </button>
        <button
          className="rounded-lg border border-stone-700 bg-stone-900/80 px-5 py-3 text-sm font-semibold text-stone-200 transition duration-200 hover:-translate-y-px hover:border-stone-500 hover:shadow-lg hover:shadow-stone-950/30"
          onClick={handleQuit}
          type="button"
        >
          结束游戏
        </button>
        <Link
          className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-5 py-3 text-center text-sm font-semibold text-rose-200 transition duration-200 hover:-translate-y-px hover:bg-rose-500/20 hover:shadow-lg hover:shadow-rose-950/25"
          state={{ view: 'lobby' }}
          to="/"
        >
          返回大厅
        </Link>
      </div>
    </main>
  )
}
