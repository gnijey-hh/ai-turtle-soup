import { Link } from 'react-router-dom'
import type { Story } from '../types/game'

type TGameCardProps = {
  story: Story
}

const DIFFICULTY_LABELS: Record<Story['difficulty'], string> = {
  easy: '小菜一碟',
  medium: '有点东西',
  hard: '真不好啃',
}

const DIFFICULTY_STYLES: Record<Story['difficulty'], string> = {
  easy:
    'border-emerald-400/40 bg-emerald-500/10 text-emerald-200 shadow-emerald-950/30',
  medium: 'border-sky-400/40 bg-sky-500/10 text-sky-200 shadow-sky-950/30',
  hard: 'border-amber-400/40 bg-amber-500/10 text-amber-200 shadow-amber-950/30',
}

export function GameCard({ story }: TGameCardProps) {
  return (
    <Link
      aria-label={`进入故事：${story.title}`}
      className="group block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      to={`/game/${story.id}`}
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(10,19,16,0.96),rgba(5,10,8,0.94))] p-5 shadow-lg shadow-emerald-950/30 transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/45 hover:shadow-2xl hover:shadow-emerald-950/40 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(82,247,166,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_28%)] opacity-70 transition duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent opacity-50 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.42em] text-emerald-300/65">
              Case File
            </p>
            <h2 className="mt-3 text-xl font-semibold text-stone-100 transition duration-300 group-hover:text-emerald-100">
              {story.title}
            </h2>
          </div>
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium shadow-lg ${DIFFICULTY_STYLES[story.difficulty]}`}
          >
            {DIFFICULTY_LABELS[story.difficulty]}
          </span>
        </div>

        <p className="mask-fade-bottom relative mt-4 flex-1 text-sm leading-7 text-stone-300/90">
          {story.surface}
        </p>

        <div className="relative mt-6 flex items-center justify-between gap-3 text-sm">
          <span className="text-stone-500 transition duration-300 group-hover:text-stone-400">
            点击进入推理现场
          </span>
          <span className="rounded-lg border border-amber-400/45 bg-amber-400/10 px-4 py-2 font-medium text-amber-300 transition duration-300 group-hover:bg-amber-400/20 group-hover:text-amber-200">
            开始游戏
          </span>
        </div>
      </article>
    </Link>
  )
}
