import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { Message } from '../components/Message'
import { getStoryById } from '../data/stories'
import type { TGameStatus, TMessage } from '../types/game'

type TResultLocationState = {
  messages?: TMessage[]
  status?: TGameStatus
}

const STATUS_LABELS: Record<TGameStatus, string> = {
  playing: '进行中',
  ended: '已结束',
  abandoned: '已放弃',
}

export function Result() {
  const { id = '' } = useParams()
  const location = useLocation()
  const story = getStoryById(id)
  const state = (location.state as TResultLocationState | null) ?? null
  const messages = state?.messages ?? []
  const status = state?.status ?? 'ended'

  if (!story) {
    return <Navigate replace to="/" />
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-lg border border-amber-400/30 bg-[linear-gradient(180deg,rgba(30,20,4,0.95),rgba(8,8,6,0.96))] p-6 shadow-lg shadow-amber-950/25 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.22),transparent_35%),radial-gradient(circle_at_center,rgba(82,247,166,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full border border-amber-300/20 blur-2xl animate-pulse" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm uppercase tracking-[0.45em] text-amber-300/70">
              真相揭晓
            </p>
            <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
              {STATUS_LABELS[status]}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-stone-50 sm:text-4xl">
            {story.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-300/90 sm:text-base">
            迷雾已经散开，真正的故事终于显形。请仔细读完这一段汤底，
            回看你刚才问过的问题，也许会发现一些线索其实早就摆在眼前。
          </p>
        </div>
      </section>

      <section className="relative mt-6 overflow-hidden rounded-lg border border-amber-400/35 bg-amber-400/10 p-6 shadow-lg shadow-amber-950/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_35%)]" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300/75">
            汤底
          </p>
          <p className="mt-4 text-base leading-8 text-stone-100 sm:text-lg">
            {story.bottom}
          </p>
        </div>
      </section>

      {messages.length > 0 ? (
        <section className="mt-6 rounded-lg border border-emerald-400/20 bg-black/35 p-5 shadow-lg shadow-emerald-950/20">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-stone-100">回顾推理过程</h2>
              <p className="mt-1 text-sm text-stone-400">
                这是你与 AI 主持人的完整对话记录。
              </p>
            </div>
            <span className="rounded-full border border-emerald-400/25 px-3 py-1 text-xs text-emerald-300/80">
              {messages.length} 条消息
            </span>
          </div>

          <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto rounded-lg border border-stone-800/80 bg-stone-950/70 p-3">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          className="rounded-lg bg-emerald-400 px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:bg-emerald-300"
          to="/"
        >
          再来一局
        </Link>
      </div>
    </main>
  )
}
