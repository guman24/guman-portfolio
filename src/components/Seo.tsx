import { Helmet } from 'react-helmet-async'
import { useSiteConfig } from '@/features/site-config/hooks/useSiteConfig'

export function Seo() {
  const { data: config } = useSiteConfig()
  if (!config) return null

  const title = config.seo_title || config.headline || 'Portfolio'
  const description = config.seo_description || config.bio || undefined

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {config.seo_og_image_url && <meta property="og:image" content={config.seo_og_image_url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {config.seo_og_image_url && <meta name="twitter:image" content={config.seo_og_image_url} />}
    </Helmet>
  )
}
