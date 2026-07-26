import { cn } from '@/lib/utils'

export function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        available
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-border bg-muted text-muted-foreground',
      )}
    >
      <span className="relative flex size-2">
        {available && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2 rounded-full',
            available ? 'bg-emerald-500' : 'bg-muted-foreground',
          )}
        />
      </span>
      {available ? 'Available for new projects' : 'Not currently available'}
    </span>
  )
}
