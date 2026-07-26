import { supabase } from '@/lib/supabase/client'

const PROJECT_MEDIA_BUCKET = 'project-media'
const RESUME_BUCKET = 'resume'
const PROFILE_BUCKET = 'profile'

export async function uploadProjectMedia(projectId: string, file: File) {
  const path = `${projectId}/${crypto.randomUUID()}-${file.name}`
  const { error } = await supabase.storage.from(PROJECT_MEDIA_BUCKET).upload(path, file)
  if (error) throw error
  return supabase.storage.from(PROJECT_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}

export async function removeProjectMedia(path: string) {
  const { error } = await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([path])
  if (error) throw error
}

export async function uploadResume(file: File) {
  const path = 'resume.pdf'
  const { error } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(path, file, { upsert: true })
  if (error) throw error
  // cache-bust: the path is fixed (upsert overwrites in place), so without a
  // changing query param the browser/CDN can keep serving the previous file.
  return `${supabase.storage.from(RESUME_BUCKET).getPublicUrl(path).data.publicUrl}?v=${Date.now()}`
}

export async function uploadProfileImage(file: File) {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `avatar.${ext}`
  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, file, { upsert: true })
  if (error) throw error
  return `${supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path).data.publicUrl}?v=${Date.now()}`
}
