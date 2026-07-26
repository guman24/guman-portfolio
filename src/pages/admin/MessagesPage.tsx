import { useState } from 'react'
import { MessageTable } from '@/features/messages/components/admin/MessageTable'
import { MessageDetailDrawer } from '@/features/messages/components/admin/MessageDetailDrawer'
import type { MessageRow } from '@/types/domain'

export function MessagesPage() {
  const [selected, setSelected] = useState<MessageRow | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-muted-foreground">Inbound leads from the contact form.</p>
      </div>

      <MessageTable onSelect={setSelected} />

      <MessageDetailDrawer
        message={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onDeleted={() => setSelected(null)}
      />
    </div>
  )
}
