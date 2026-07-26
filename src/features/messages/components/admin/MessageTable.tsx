import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminMessages } from '@/features/messages/hooks/useAdminMessages'
import { useMessageMutations } from '@/features/messages/hooks/useMessageMutations'
import type { MessageRow } from '@/types/domain'

type Filter = 'all' | 'unread' | 'starred'

export function MessageTable({ onSelect }: { onSelect: (message: MessageRow) => void }) {
  const { data: messages } = useAdminMessages()
  const { setRead, toggleStar } = useMessageMutations()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    if (!messages) return []
    if (filter === 'unread') return messages.filter((m) => !m.is_read)
    if (filter === 'starred') return messages.filter((m) => m.is_starred)
    return messages
  }, [messages, filter])

  if (!messages || messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>
  }

  function handleSelect(message: MessageRow) {
    onSelect(message)
    if (!message.is_read) {
      setRead.mutate({ id: message.id, is_read: true })
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((message) => (
            <TableRow
              key={message.id}
              className="cursor-pointer"
              onClick={() => handleSelect(message)}
            >
              <TableCell>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleStar.mutate({ id: message.id, is_starred: !message.is_starred })
                  }}
                >
                  <Star
                    className={cn(
                      'size-4',
                      message.is_starred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground',
                    )}
                  />
                </button>
              </TableCell>
              <TableCell className={cn(!message.is_read && 'font-semibold')}>{message.name}</TableCell>
              <TableCell className={cn(!message.is_read && 'font-semibold')}>
                {message.subject || <span className="text-muted-foreground">No subject</span>}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(message.created_at), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
