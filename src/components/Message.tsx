import type { TMessage } from '../types/game'

type TMessageProps = {
  message: Pick<TMessage, 'role' | 'content'>
}

const ROLE_CONFIG = {
  user: {
    align: 'justify-end',
    avatar: '我',
    avatarClass:
      'border-emerald-300/40 bg-emerald-400/15 text-emerald-200 shadow-emerald-950/30',
    bubbleClass:
      'border border-emerald-300/20 bg-emerald-500/18 text-emerald-50 rounded-br-sm',
    label: '玩家',
  },
  assistant: {
    align: 'justify-start',
    avatar: 'AI',
    avatarClass:
      'border-amber-300/35 bg-amber-400/12 text-amber-300 shadow-amber-950/30',
    bubbleClass:
      'border border-stone-700/90 bg-stone-950/90 text-stone-200 rounded-bl-sm',
    label: '主持人',
  },
} as const

export function Message({ message }: TMessageProps) {
  const config = ROLE_CONFIG[message.role]
  const isUser = message.role === 'user'

  return (
    <div className={`animate-float-in flex ${config.align}`}>
      <div
        className={`flex max-w-[92%] items-end gap-2 sm:max-w-[88%] sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <div
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold shadow-lg sm:h-10 sm:w-10 sm:text-xs ${config.avatarClass}`}
        >
          {config.avatar}
        </div>

        <div className="flex flex-col gap-1">
          <span
            className={`text-[11px] tracking-[0.2em] text-stone-500 sm:text-xs ${isUser ? 'text-right' : 'text-left'}`}
          >
            {config.label}
          </span>
          <div
            className={`rounded-lg px-3 py-2.5 text-sm leading-6 shadow-lg backdrop-blur-sm sm:px-4 sm:py-3 ${config.bubbleClass}`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
