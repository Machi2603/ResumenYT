import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, password, securityWord } = await req.json()

    if (!email || !password || !securityWord) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    if (securityWord.length < 3) {
      return NextResponse.json({ error: 'La palabra de seguridad debe tener al menos 3 caracteres' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message ?? 'Error creando usuario' }, { status: 400 })
    }

    // Hash security word and save to profiles
    const salt = process.env.SECURITY_WORD_SALT ?? '$2b$12$defaultsalt12345678901'
    const hashed = await bcrypt.hash(securityWord, 12)

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      security_word: hashed,
    })

    if (profileError) {
      // Cleanup: delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(data.user.id)
      return NextResponse.json({ error: 'Error creando perfil de usuario' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
