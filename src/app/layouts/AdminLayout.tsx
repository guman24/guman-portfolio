import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  History,
  Inbox,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useSession } from '@/features/auth/hooks/useSession'
import { useSignOut } from '@/features/auth/hooks/useAuthMutations'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/timeline', label: 'Timeline', icon: History },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AdminLayout() {
  const { session } = useSession()
  const signOut = useSignOut()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut.mutateAsync()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <header className="flex items-center justify-between border-b border-border p-4 sm:hidden">
        <span className="text-sm font-semibold tracking-tight">Admin</span>
        <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu className="size-4" />
        </Button>
      </header>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 p-4 sm:flex">
        <div className="mb-6 px-2 text-sm font-semibold tracking-tight">Admin</div>
        <SidebarNav />
        <div className="mt-auto space-y-2 border-t border-border pt-4">
          <p className="truncate px-2 text-xs text-muted-foreground">{session?.user.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Admin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col px-4">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
            <div className="mt-auto space-y-2 border-t border-border pt-4">
              <p className="truncate text-xs text-muted-foreground">{session?.user.email}</p>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="size-4" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
