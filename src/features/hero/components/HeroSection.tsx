import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteConfig } from '@/features/site-config/hooks/useSiteConfig'
import { AvailabilityBadge } from '@/features/hero/components/AvailabilityBadge'
import profileImg from '@/assets/profile.webp'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function HeroSection() {
  const { data: config, isLoading } = useSiteConfig()

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-32 sm:px-6" />
  }

  return (
    <motion.section
      id="top"
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-32"
    >
      <div className="flex flex-col items-center gap-6 text-center lg:max-w-2xl lg:items-start lg:text-left">
        <motion.div variants={item}>
          <AvailabilityBadge available={config?.available_for_hire ?? false} />
        </motion.div>

        <motion.h1
          variants={item}
          className="text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {config?.headline ?? 'Full-Stack & Mobile Engineer'}
        </motion.h1>

        <motion.p variants={item} className="max-w-2xl text-lg text-muted-foreground">
          {config?.bio}
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
          <Button size="lg" nativeButton={false} render={<a href="#projects" />}>
            View Projects
            <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button variant="outline" size="lg" nativeButton={false} render={<a href="#contact" />}>
            <Mail className="mr-1 size-4" />
            Get in touch
          </Button>
          {config?.resume_url && (
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              render={<a href={config.resume_url} target="_blank" rel="noreferrer" download />}
            >
              <Download className="mr-1 size-4" />
              Resume
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        variants={item}
        className="shrink-0"
      >
        <img
          src={config?.profile_image_url || profileImg}
          alt="Portrait photo"
          className="size-40 rounded-full object-cover object-top ring-4 ring-border sm:size-52 lg:size-64"
        />
      </motion.div>
    </motion.section>
  )
}
