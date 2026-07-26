import { HeroSection } from '@/features/hero/components/HeroSection'
import { ProjectGrid } from '@/features/projects/components/public/ProjectGrid'
import { SkillsSection } from '@/features/skills/components/public/SkillsSection'
import { TimelineSection } from '@/features/experience/components/public/TimelineSection'
import { PlaygroundGrid } from '@/features/playground/components/public/PlaygroundGrid'
import { ContactSection } from '@/features/contact/components/public/ContactSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ProjectGrid />
      <SkillsSection />
      <TimelineSection />
      <PlaygroundGrid />
      <ContactSection />
    </>
  )
}
