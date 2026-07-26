import { lazy, Suspense, type LazyExoticComponent, type ComponentType } from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { Sparkles, type LucideProps } from 'lucide-react'

type IconName = keyof typeof dynamicIconImports

// Cache lazy() per icon name at module scope — creating a new lazy() component
// on every render would remount/re-fetch the chunk each time.
const lazyIconCache = new Map<IconName, LazyExoticComponent<ComponentType<LucideProps>>>()

function getLazyIcon(name: IconName) {
  let icon = lazyIconCache.get(name)
  if (!icon) {
    icon = lazy(dynamicIconImports[name])
    lazyIconCache.set(name, icon)
  }
  return icon
}

export function DynamicIcon({ iconName, ...props }: { iconName: string | null } & LucideProps) {
  if (!iconName || !(iconName in dynamicIconImports)) {
    return <Sparkles {...props} />
  }

  const LazyIcon = getLazyIcon(iconName as IconName)

  return (
    <Suspense fallback={<div className={props.className} style={{ width: props.size, height: props.size }} />}>
      <LazyIcon {...props} />
    </Suspense>
  )
}
