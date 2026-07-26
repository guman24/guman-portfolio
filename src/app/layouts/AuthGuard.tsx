import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/features/auth/hooks/useSession'

export function AuthGuard() {
  const { isLoading, isAdmin } = useSession()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
