import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useSession } from '@/features/auth/hooks/useSession'

export function LoginPage() {
  const { isAdmin, isLoading } = useSession()

  if (!isLoading && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-xl font-semibold">Admin sign in</h1>
        <LoginForm />
      </div>
    </div>
  )
}
