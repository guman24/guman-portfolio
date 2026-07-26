// Deno Edge Function. Deploy with:
//   supabase functions deploy contact-submit --no-verify-jwt
//
// Runs with a trusted server context so it can do things RLS cannot express:
// rate-limit by IP and use the service-role key to write into `messages`
// (which has no public INSERT policy — see supabase/migrations/0002_rls_policies.sql).

import { createClient } from 'jsr:@supabase/supabase-js@2'

const RATE_LIMIT_PER_HOUR = 5
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactPayload {
  name?: string
  email?: string
  subject?: string
  body?: string
  company?: string // honeypot
}

function isValidPayload(payload: ContactPayload): payload is Required<Pick<ContactPayload, 'name' | 'email' | 'body'>> & ContactPayload {
  return (
    typeof payload.name === 'string' &&
    payload.name.trim().length > 0 &&
    payload.name.length <= 200 &&
    typeof payload.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) &&
    typeof payload.body === 'string' &&
    payload.body.trim().length >= 10 &&
    payload.body.length <= 5000
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  try {
    const payload: ContactPayload = await req.json()

    // Honeypot: real users never see/fill this field. A bot that fills every
    // field trips it — pretend success so we don't tip off the bot.
    if (payload.company) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    if (!isValidPayload(payload)) {
      return new Response(JSON.stringify({ error: 'Invalid submission' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    if (ip !== 'unknown') {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('message_submissions_log')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('submitted_at', oneHourAgo)

      if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
        return new Response(JSON.stringify({ error: 'Too many submissions, try again later.' }), {
          status: 429,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        })
      }
    }

    const { error: insertError } = await supabase.from('messages').insert({
      name: payload.name.trim(),
      email: payload.email.trim(),
      subject: payload.subject?.trim() || null,
      body: payload.body.trim(),
      source_ip: ip !== 'unknown' ? ip : null,
    })
    if (insertError) throw insertError

    await supabase.from('message_submissions_log').insert({ ip })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('contact-submit error', err)
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
