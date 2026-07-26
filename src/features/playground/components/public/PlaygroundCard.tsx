import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlaygroundItem } from '@/features/playground/data'

export function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  const content = (
    <Card className="h-full transition-colors hover:border-foreground/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {item.title}
          {item.href && <ExternalLink className="size-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  )

  if (!item.href) return content

  return (
    <a href={item.href} target="_blank" rel="noreferrer">
      {content}
    </a>
  )
}
