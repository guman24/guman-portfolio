import { motion } from 'framer-motion'
import { TechBadge } from '@/features/skills/components/public/TechBadge'
import type { SkillRow } from '@/types/domain'

export function SkillGroup({ title, skills }: { title: string; skills: SkillRow[] }) {
  if (skills.length === 0) return null

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <TechBadge skill={skill} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
