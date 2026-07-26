import { formatDistanceToNow } from 'date-fns'
import { Mail, FolderKanban } from 'lucide-react'
import type { ActivityEntry } from '@/features/dashboard/hooks/useDashboardMetrics'

export function RecentActivityList({ activity }: { activity: ActivityEntry[] }) {
  if (activity.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>
  }

  return (
    <ul className="space-y-3">
      {activity.map((entry) => {
        const Icon = entry.type === 'message' ? Mail : FolderKanban
        return (
          <li key={entry.id} className="flex items-center gap-3 text-sm">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="size-3.5 text-muted-foreground" />
            </span>
            <span className="flex-1">{entry.label}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
