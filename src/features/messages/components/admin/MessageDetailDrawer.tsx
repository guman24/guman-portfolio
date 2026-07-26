import { format } from 'date-fns'
import { Mail, Star, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useMessageMutations } from '@/features/messages/hooks/useMessageMutations'
import type { MessageRow } from '@/types/domain'

export function MessageDetailDrawer({
  message,
  onOpenChange,
  onDeleted,
}: {
  message: MessageRow | null
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}) {
  const { toggleStar, remove } = useMessageMutations()

  async function handleDelete() {
    if (!message) return
    await remove.mutateAsync(message.id)
    onDeleted()
  }

  const mailtoHref = message
    ? `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || 'your message'}`)}`
    : '#'

  return (
    <Sheet open={!!message} onOpenChange={onOpenChange}>
      <SheetContent>
        {message && (
          <>
            <SheetHeader>
              <SheetTitle>{message.subject || 'No subject'}</SheetTitle>
              <SheetDescription>
                {message.name} · {message.email}
                <br />
                {format(new Date(message.created_at), 'PPp')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4">
              <p className="whitespace-pre-wrap text-sm">{message.body}</p>
            </div>

            <SheetFooter className="flex-row flex-wrap gap-2">
              <Button size="sm" nativeButton={false} render={<a href={mailtoHref} />}>
                <Mail className="size-3.5" />
                Reply via email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toggleStar.mutate({ id: message.id, is_starred: !message.is_starred })
                }
              >
                <Star className={message.is_starred ? 'size-3.5 fill-current' : 'size-3.5'} />
                {message.is_starred ? 'Unstar' : 'Star'}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDelete}>
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
