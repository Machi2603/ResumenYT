import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, securityWord } = await req.json()

    if (!email || !securityWord) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    // Find user by email
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users?.users?.find((u) => u.email === email)

    if (!user) {
      // Return same response to avoid user enumeration
      return NextResponse.json({ valid: false })
    }

    // Get hashed security word from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('security_word')
      .eq('id', user.id)
      .single()

    if (!profile?.security_word) {
      return NextResponse.json({ valid: false })
    }

    const valid = await bcrypt.compare(securityWord, profile.security_word)

    return NextResponse.json({ valid })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
