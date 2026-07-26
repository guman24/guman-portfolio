import { useRef } from 'react'
import { toast } from 'sonner'
import { FileText, Upload } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { uploadResume } from '@/lib/supabase/storage'

export function ResumeUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useMutation({ mutationFn: uploadResume })

  async function handleFile(file: File | undefined) {
    if (!file) return
    try {
      const url = await upload.mutateAsync(file)
      onChange(url)
      toast.success('Resume uploaded.')
    } catch {
      toast.error('Upload failed. Please try again.')
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <FileText className="size-4" />
          Current resume
        </a>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
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
        {upload.isPending ? 'Uploading…' : value ? 'Replace resume' : 'Upload resume'}
      </Button>
    </div>
  )
}
