import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { askAI } from '../api'
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
      const assistantMessage: TMessage = {
        id: `assistant-${crypto.randomUUID()}`,
        role: 'assistant',
        content: answer,
        timestamp: timestamp + 1,
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'AI 调用失败，请检查网络和配置。',
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="rounded-lg border border-emerald-400/20 bg-black/35 p-5 shadow-lg shadow-emerald-950/25 transition duration-300 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.45em] text-emerald-300/70">
              当前故事
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-stone-50 sm:text-4xl">
              {story.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-300/90 sm:text-base">
              {story.surface}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-300 transition duration-200 hover:bg-amber-400/15">
              难度 {DIFFICULTY_LABELS[story.difficulty]}
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300 transition duration-200 hover:bg-emerald-400/15">
              状态 {STATUS_LABELS[gameStatus]}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <ChatBox
          disabled={gameStatus !== 'playing'}
          errorMessage={errorMessage}
          isLoading={isLoading}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
          to="/"
        >
          返回大厅
        </Link>
      </div>
    </main>
  )
}
