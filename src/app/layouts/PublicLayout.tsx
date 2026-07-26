import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Mail, Menu } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/icons'
import { ThemeToggle } from '@/features/hero/components/ThemeToggle'
import { useSiteConfig } from '@/features/site-config/hooks/useSiteConfig'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Seo } from '@/components/Seo'

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export function PublicLayout() {
  const { data: config } = useSiteConfig()
  const social = config?.social_links ?? {}
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Seo />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="font-semibold tracking-tight">
            guman24
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex items-center gap-4">
            {social.github && (
              <a href={social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubIcon className="size-4" />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinIcon className="size-4" />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                <XIcon className="size-4" />
              </a>
            )}
            {social.email && (
              <a href={social.email} aria-label="Email">
                <Mail className="size-4" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
