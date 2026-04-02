import type { Story } from '../types/game'

type TStoryRevealProps = {
  story: Story
}

export function StoryReveal({ story }: TStoryRevealProps) {
  return (
    <section className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-5 shadow-lg shadow-amber-950/20">
      <p className="text-sm uppercase tracking-[0.35em] text-amber-300/70">
        汤底揭晓
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-stone-100">{story.title}</h2>
      <p className="mt-4 text-sm leading-7 text-stone-200/90">{story.bottom}</p>
    </section>
  )
}
