// Playground has no backing table by design — this is a lightweight,
// hand-edited list of small experiments, not a CMS-managed resource.
export interface PlaygroundItem {
  title: string
  description: string
  href?: string
}

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    title: 'Add your experiments here',
    description: 'Edit src/features/playground/data.ts to list small demos, snippets, or side projects.',
  },
]
