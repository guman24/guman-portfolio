import { useRef } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadProfileImage } from '@/lib/supabase/storage'

export function ProfileImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useMutation({ mutationFn: uploadProfileImage })

  async function handleFile(file: File | undefined) {
    if (!file) return
    try {
      const url = await upload.mutateAsync(file)
      onChange(url)
      toast.success('Profile photo updated.')
    } catch {
      toast.error('Upload failed. Please try again.')
    }
  }

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <img
          src={value}
          alt="Profile"
          className="size-16 rounded-full border border-border object-cover object-top"
        />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-full border border-dashed border-border text-xs text-muted-foreground">
          None
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
        {upload.isPending ? 'Uploading…' : value ? 'Replace photo' : 'Upload photo'}
      </Button>
    </div>
  )
}
