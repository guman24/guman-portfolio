import { PLAYGROUND_ITEMS } from '@/features/playground/data'
import { PlaygroundCard } from '@/features/playground/components/public/PlaygroundCard'

export function PlaygroundGrid() {
  if (PLAYGROUND_ITEMS.length === 0) return null

  return (
    <section id="playground" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Experiments</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Small side projects, UI experiments, and snippets.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLAYGROUND_ITEMS.map((item) => (
          <PlaygroundCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  )
}
