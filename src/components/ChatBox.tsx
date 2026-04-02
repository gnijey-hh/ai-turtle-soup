import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Message } from './Message'
import type { TMessage } from '../types/game'

type TChatBoxProps = {
  messages: TMessage[]
  onSendMessage: (content: string) => Promise<void> | void
  isLoading?: boolean
  errorMessage?: string | null
  disabled?: boolean
}

export function ChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  errorMessage = null,
  disabled = false,
}: TChatBoxProps) {
  const [question, setQuestion] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading, errorMessage])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextQuestion = question.trim()
    if (!nextQuestion || isLoading || disabled) {
      return
    }

    setQuestion('')
    await onSendMessage(nextQuestion)
  }

  const isEmpty = messages.length === 0
  const isInputDisabled = isLoading || disabled

  return (
    <section className="rounded-lg border border-emerald-400/20 bg-black/35 p-4 shadow-lg shadow-emerald-950/20 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-100">对话记录</h2>
          <p className="text-sm text-stone-400">
            AI 只会回复“是”、“否”或“无关”
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLoading ? (
            <div className="animate-pulse-glow h-2.5 w-2.5 rounded-full bg-amber-300" />
          ) : null}
          <div className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300/80">
            {messages.length} 条消息
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100 animate-float-in">
          <p className="font-medium text-rose-200">出现了一点问题</p>
          <p className="mt-1 text-rose-100/90">{errorMessage}</p>
        </div>
      ) : null}

      <div className="flex max-h-[26rem] min-h-[18rem] flex-col gap-3 overflow-y-auto rounded-lg border border-stone-800/80 bg-stone-950/70 p-3 sm:max-h-[30rem]">
        {isEmpty ? (
          <div className="flex min-h-[14rem] flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-emerald-400/15 bg-emerald-400/5 px-6 text-center animate-float-in">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-200">
              ?
            </div>
            <p className="text-sm font-medium text-stone-200">
              还没有开始提问
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-400">
              从一个关键细节入手，比如人物关系、时间点或异常行为，往往更容易逼近真相。
            </p>
          </div>
        ) : (
          messages.map((message) => <Message key={message.id} message={message} />)
        )}

        {isLoading ? (
          <div className="animate-float-in flex justify-start">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300/35 bg-amber-400/12 text-[11px] font-semibold text-amber-300 shadow-lg sm:h-10 sm:w-10 sm:text-xs">
                AI
              </div>
              <div className="rounded-lg rounded-bl-sm border border-stone-700/90 bg-stone-950/90 px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-300" />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 rounded-lg border border-emerald-400/20 bg-stone-950/80 px-4 py-3 text-sm text-stone-100 outline-none transition duration-200 placeholder:text-stone-500 focus:-translate-y-px focus:border-emerald-300/60 focus:shadow-lg focus:shadow-emerald-950/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isInputDisabled}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={
            disabled ? '当前游戏已结束，不能继续提问' : '例如：凶手和广播有关吗？'
          }
          value={question}
        />
        <button
          className="rounded-lg bg-emerald-400 px-4 py-3 text-sm font-semibold text-stone-950 transition duration-200 hover:-translate-y-px hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-950/25 disabled:cursor-not-allowed disabled:bg-emerald-200"
          disabled={isInputDisabled}
          type="submit"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </section>
  )
}
