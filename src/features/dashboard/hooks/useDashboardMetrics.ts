import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  fetchDashboardProjects,
  fetchDashboardMessages,
  fetchProjectViewsSeries,
} from '@/features/dashboard/api'

export interface ActivityEntry {
  id: string
  type: 'message' | 'project'
  label: string
  timestamp: string
}

export function useDashboardMetrics() {
  const projectsQuery = useQuery({
    queryKey: ['dashboard', 'projects'],
    queryFn: fetchDashboardProjects,
  })
  const messagesQuery = useQuery({
    queryKey: ['dashboard', 'messages'],
    queryFn: fetchDashboardMessages,
  })
  const viewsSeriesQuery = useQuery({
    queryKey: ['dashboard', 'views-series'],
    queryFn: fetchProjectViewsSeries,
  })

  const projects = projectsQuery.data ?? []
  const messages = messagesQuery.data ?? []
  const viewRows = viewsSeriesQuery.data ?? []

  const totalViews = projects.reduce((sum, p) => sum + p.view_count, 0)
  const liveProjectCount = projects.filter((p) => p.published).length
  const messageCount = messages.length
  const unreadMessageCount = messages.filter((m) => !m.is_read).length

  const viewsByDay = new Map<string, number>()
  for (const row of viewRows) {
    const day = format(new Date(row.viewed_at), 'MMM d')
    viewsByDay.set(day, (viewsByDay.get(day) ?? 0) + 1)
  }
  const viewsSeries = Array.from(viewsByDay.entries()).map(([date, views]) => ({ date, views }))

  const recentActivity: ActivityEntry[] = [
    ...messages.slice(0, 5).map((m) => ({
      id: `message-${m.id}`,
      type: 'message' as const,
      label: `New message from ${m.name}`,
      timestamp: m.created_at,
    })),
    ...projects.slice(0, 5).map((p) => ({
      id: `project-${p.id}`,
      type: 'project' as const,
      label: `Project updated: ${p.title}`,
      timestamp: p.updated_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return {
    isLoading: projectsQuery.isLoading || messagesQuery.isLoading || viewsSeriesQuery.isLoading,
    totalViews,
    liveProjectCount,
    messageCount,
    unreadMessageCount,
    viewsSeries,
    recentActivity,
  }
}
