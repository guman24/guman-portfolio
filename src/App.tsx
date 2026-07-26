import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { router } from '@/routes'

export function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        <ThemeProvider>
          {/* reducedMotion="user" makes every Framer Motion animation in the
              app respect prefers-reduced-motion automatically, no per-component checks needed. */}
          <MotionConfig reducedMotion="user">
            <TooltipProvider>
              <RouterProvider router={router} />
              <Toaster />
            </TooltipProvider>
          </MotionConfig>
        </ThemeProvider>
      </QueryProvider>
    </HelmetProvider>
  )
}
