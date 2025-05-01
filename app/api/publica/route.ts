// File: tailwind-nextjs-starter-blog/app/api/publica/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER!
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const name = data.get('name') as string
    const email = data.get('email') as string
    const description = data.get('description') as string
    const token = data.get('response') as string

    if (!token) {
      return NextResponse.json({ error: 'Token Turnstile no proporcionado' }, { status: 400 })
    }

    // Verificar Turnstile
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
    })
    const vj = await verify.json()
    if (!vj.success) {
      return NextResponse.json({ error: 'Turnstile inválido', details: vj['error-codes'] }, { status: 400 })
    }

    // Adjuntos
    const attachments: { filename: string; content: Buffer }[] = []
    for (const key of data.keys()) {
      if (key === 'files') {
        const files = data.getAll('files') as File[]
        for (const f of files) {
          const buf = Buffer.from(await f.arrayBuffer())
          attachments.push({ filename: f.name, content: buf })
        }
      }
    }

    await transporter.sendMail({
      from: GMAIL_USER,
      to: GMAIL_USER,
      cc: 'pino.jose@gmail.com',
      replyTo: email,
      subject: `Nuevo relato de ${name}`,
      text: `De: ${name} <${email}>\n\n${description}`,
      attachments,
    })

    return NextResponse.json({ message: 'Relato enviado correctamente' })
  } catch (err) {
    console.error('Error en /api/publica:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
