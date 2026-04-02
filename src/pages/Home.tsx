import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import enterImg from '../assets/home/Enter.webp'
import homeBg from '../assets/home/home.webp'
import iconImg from '../assets/home/icon.webp'
import squareImg from '../assets/home/square.webp'
import { GameCard } from '../components/GameCard'
import { stories } from '../data/stories'
import type { TGameStatus } from '../types/game'

type THomeLocationState = {
  status?: TGameStatus
}

type THomeView = 'hero' | 'lobby'

const STATUS_COPY: Record<Exclude<TGameStatus, 'playing'>, string> = {
  ended: '上一局已经揭晓真相，准备开始新的推理吧。',
  abandoned: '你刚刚中途放弃了一局，没关系，换一个案子重新来过。',
}

const STAT_CARDS = [
  { label: '小菜一碟', key: 'easy', tone: 'text-emerald-200' },
  { label: '有点东西', key: 'medium', tone: 'text-sky-200' },
  { label: '真不好啃', key: 'hard', tone: 'text-amber-200' },
] as const

export function Home() {
  const location = useLocation()
  const state = (location.state as THomeLocationState | null) ?? null
  const lastStatus = state?.status
  const [view, setView] = useState<THomeView>('hero')

  const counts = useMemo(
    () => ({
      easy: stories.filter((story) => story.difficulty === 'easy').length,
      medium: stories.filter((story) => story.difficulty === 'medium').length,
      hard: stories.filter((story) => story.difficulty === 'hard').length,
    }),
    [],
  )

  if (view === 'lobby') {
    return (
      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(82,247,166,0.14),transparent_55%)]" />

        <section className="relative animate-float-in">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.42em] text-emerald-300/60">
                Story Selection
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-stone-100 sm:text-4xl">
                游戏大厅
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">
                从轻松试探到烧脑谜案，任选一个故事，立刻开始推理。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/6 px-4 py-3 text-sm text-emerald-200/90">
                当前共 <span className="font-semibold text-stone-100">{stories.length}</span>{' '}
                个故事，点击任意卡片即可开局
              </div>
              <button
                className="rounded-lg border border-stone-700 bg-stone-900/80 px-4 py-3 text-sm font-semibold text-stone-200 transition duration-200 hover:border-stone-500 hover:bg-stone-900"
                onClick={() => setView('hero')}
                type="button"
              >
                返回首页
              </button>
            </div>
          </div>

          {lastStatus && lastStatus !== 'playing' ? (
            <section className="mb-6 rounded-lg border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100 shadow-lg shadow-amber-950/15 animate-float-in">
              {STATUS_COPY[lastStatus]}
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <GameCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative mx-auto flex h-screen max-h-screen w-full max-w-7xl flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(82,247,166,0.14),transparent_55%)]" />

      <section
        className="relative flex min-h-0 flex-1 items-center overflow-hidden rounded-lg border border-emerald-400/20 bg-[#07120f] p-6 shadow-lg shadow-emerald-950/30 sm:p-8 lg:p-10"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(3, 10, 8, 0.56), rgba(4, 12, 9, 0.72)), url(${homeBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(145,255,220,0.08),transparent_26%),radial-gradient(circle_at_center,rgba(0,0,0,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/35 to-transparent" />

        <div className="relative w-full">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center animate-float-in">
            <p className="font-home-english w-full text-center text-sm uppercase tracking-[0.5em] text-emerald-200/85 sm:text-base">
              AI Turtle Soup
            </p>

            <div className="relative mt-6 flex w-full justify-center">
              <h1 className="font-home-display w-full text-center text-5xl font-extrabold tracking-tight text-transparent bg-[linear-gradient(180deg,#f1fffe_0%,#c8fff7_18%,#7cf0ea_48%,#46d6d0_72%,#2fa8b8_100%)] bg-clip-text drop-shadow-[0_0_16px_rgba(108,245,255,0.32)] sm:text-6xl lg:text-7xl">
                AI海龟汤
              </h1>
              <img
                alt="海龟图标"
                className="absolute right-[18%] top-1 h-8 w-8 opacity-75 sm:right-[20%] sm:h-10 sm:w-10 lg:right-[18%]"
                src={iconImg}
              />
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-stone-300/90 sm:text-base">
              一间深夜开放的悬疑档案馆，只给你荒诞的汤面，不给你真相。
              你要靠不断发问，把隐藏在黑暗里的完整故事一点点逼出来。
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {STAT_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="relative h-[132px] w-[158px] overflow-hidden rounded-[22px] bg-black/20 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-[1px]"
                >
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-95"
                    src={squareImg}
                  />
                  <img
                    alt=""
                    className="absolute bottom-2 left-2 h-6 w-6 opacity-60"
                    src={iconImg}
                  />
                  <img
                    alt=""
                    className="absolute bottom-2 right-2 h-6 w-6 opacity-60"
                    src={iconImg}
                  />
                  <div className="relative flex h-full flex-col items-center justify-center px-4">
                    <p className={`text-sm font-semibold ${card.tone}`}>{card.label}</p>
                    <p className="mt-3 text-4xl font-semibold text-stone-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                      {counts[card.key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                className="group relative overflow-visible bg-transparent p-0 text-lg font-semibold text-emerald-50 transition duration-200 hover:-translate-y-px active:translate-y-px"
                onClick={() => setView('lobby')}
                type="button"
              >
                <img
                  alt="进入游戏大厅"
                  className="block h-auto w-[163px] select-none object-contain drop-shadow-[0_0_12px_rgba(93,255,220,0.22)] transition duration-300 group-hover:drop-shadow-[0_0_20px_rgba(93,255,220,0.42)] sm:w-[176px]"
                  draggable="false"
                  src={enterImg}
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="-translate-y-[1px] text-lg font-semibold text-amber-200 drop-shadow-[0_1px_0_rgba(255,232,185,0.16)] sm:text-[1.15rem]">
                    进入游戏大厅
                  </span>
                </span>
              </button>
              <p className="text-sm font-medium text-stone-300/80">
                AI 只会回答“是”“否”或“无关”
              </p>
            </div>

            {lastStatus && lastStatus !== 'playing' ? (
              <div className="mx-auto mt-6 max-w-xl rounded-lg border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100 shadow-lg shadow-amber-950/15">
                {STATUS_COPY[lastStatus]}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
