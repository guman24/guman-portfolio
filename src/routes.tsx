import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { AuthGuard } from '@/app/layouts/AuthGuard'
import { HomePage } from '@/pages/public/HomePage'
import { LoginPage } from '@/pages/admin/LoginPage'

// Admin routes are code-split from the public bundle — most visitors never
// hit /admin, and it pulls in recharts/dnd-kit which are sizeable.
const AdminLayout = lazy(() =>
  import('@/app/layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProjectsPage = lazy(() =>
  import('@/pages/admin/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectEditPage = lazy(() =>
  import('@/pages/admin/ProjectEditPage').then((m) => ({ default: m.ProjectEditPage })),
)
const SkillsPage = lazy(() =>
  import('@/pages/admin/SkillsPage').then((m) => ({ default: m.SkillsPage })),
)
const TimelinePage = lazy(() =>
  import('@/pages/admin/TimelinePage').then((m) => ({ default: m.TimelinePage })),
)
const MessagesPage = lazy(() =>
  import('@/pages/admin/MessagesPage').then((m) => ({ default: m.MessagesPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function AdminSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <AuthGuard />,
    children: [
      {
        element: (
          <AdminSuspense>
            <AdminLayout />
          </AdminSuspense>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'projects/new', element: <ProjectEditPage /> },
          { path: 'projects/:id', element: <ProjectEditPage /> },
          { path: 'skills', element: <SkillsPage /> },
          { path: 'timeline', element: <TimelinePage /> },
          { path: 'messages', element: <MessagesPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
