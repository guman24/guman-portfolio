import { SettingsForm } from '@/features/site-config/components/admin/SettingsForm'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Site-wide configuration — changes go live immediately.</p>
      </div>

      <SettingsForm />
    </div>
  )
}
