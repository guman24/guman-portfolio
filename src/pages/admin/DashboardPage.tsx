import { Eye, Mail, FolderKanban, Rocket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics'
import { MetricCard } from '@/features/dashboard/components/admin/MetricCard'
import { RecentActivityList } from '@/features/dashboard/components/admin/RecentActivityList'
import { ViewsChart } from '@/features/dashboard/components/admin/ViewsChart'

export function DashboardPage() {
  const {
    isLoading,
    totalViews,
    liveProjectCount,
    messageCount,
    unreadMessageCount,
    viewsSeries,
    recentActivity,
  } = useDashboardMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio's activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total project views"
          value={isLoading ? '—' : totalViews}
          icon={Eye}
        />
        <MetricCard
          label="Message inquiries"
          value={isLoading ? '—' : messageCount}
          icon={Mail}
          hint={!isLoading && unreadMessageCount > 0 ? `${unreadMessageCount} unread` : undefined}
        />
        <MetricCard
          label="Live projects"
          value={isLoading ? '—' : liveProjectCount}
          icon={FolderKanban}
        />
        <MetricCard label="Status" value="Active" icon={Rocket} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project views (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ViewsChart data={viewsSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityList activity={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
