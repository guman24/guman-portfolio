import { useRef } from 'react'
import { toast } from 'sonner'
import { ImageOff, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjectMedia } from '@/features/projects/hooks/useProjectMedia'

export function ProjectMediaUploader({
  projectId,
  value,
  onChange,
}: {
  projectId: string | null
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useProjectMedia()

  async function handleFile(file: File | undefined) {
    if (!file || !projectId) return
    try {
      const url = await upload.mutateAsync({ projectId, file })
      onChange(url)
    } catch {
      toast.error('Upload failed. Please try again.')
    }
  }

  if (!projectId) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Save the project once first — media uploads need a project to attach to.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-fit">
          <img src={value} alt="Thumbnail" className="h-32 rounded-lg border border-border object-cover" />
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute -right-2 -top-2"
            onClick={() => onChange('')}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div className="flex h-32 w-48 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
          <ImageOff className="size-6" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={upload.isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" />
        {upload.isPending ? 'Uploading…' : 'Upload thumbnail'}
      </Button>
    </div>
  )
}
