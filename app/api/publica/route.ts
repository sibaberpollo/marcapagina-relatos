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
      return NextResponse.json(
        { error: 'Turnstile inválido', details: vj['error-codes'] },
        { status: 400 }
      )
    }

    // Preparar adjuntos
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

    // 1) Envío de confirmación al remitente (no bloquea errores)
    transporter
      .sendMail({
        from: `MarcaPagina <${GMAIL_USER}>`,
        to: email,
        subject: 'MarcaPagina: recibimos tu relato',
        text: `Hola,\n\n¡Gracias por compartir tu historia con MarcaPagina! Hemos recibido tu relato y nos pondremos en contacto contigo pronto.\n\nTu texto será evaluado antes de publicarse.\n\nSíguenos en nuestras redes sociales para estar al tanto de novedades y publicaciones:\nInstagram: https://www.instagram.com/marcapagina.page/\nTwitter: https://x.com/marcapaginapage\nThreads: https://www.threads.com/@marcapagina.page\nBluesky: https://bsky.app/profile/marcapagina.bsky.social\n\n— El equipo de MarcaPagina`,
        html: `<p>Hola,</p>
               <p>¡Gracias por compartir tu historia con MarcaPagina! Hemos recibido tu relato y nos pondremos en contacto contigo pronto.</p>
               <p style='background:#faff00; color:#222; padding:8px; border-radius:6px; font-weight:bold;'>Tu texto será evaluado antes de publicarse.</p>
               <p>Síguenos en nuestras redes sociales para estar al tanto de novedades y publicaciones:</p>
               <ul>
                 <li><a href='https://www.instagram.com/marcapagina.page/' target='_blank'>Instagram</a></li>
                 <li><a href='https://x.com/marcapaginapage' target='_blank'>Twitter</a></li>
                 <li><a href='https://www.threads.com/@marcapagina.page' target='_blank'>Threads</a></li>
                 <li><a href='https://bsky.app/profile/marcapagina.bsky.social' target='_blank'>Bluesky</a></li>
               </ul>
               <p>— El equipo de MarcaPagina</p>`,
      })
      .then(info => console.log('Confirmación enviada a remitente:', info.messageId))
      .catch(err => console.error('Error enviando confirmación al remitente:', err))

    // 2) Envío interno con copia a ti
    const infoInternal = await transporter.sendMail({
      from: `MarcaPagina <${GMAIL_USER}>`,
      to: GMAIL_USER,
      cc: 'pino.jose@gmail.com',
      replyTo: email,
      subject: `Nuevo relato de ${email}`,
      text: `De: ${email}\n\n${description}`,
      attachments,
    })
    console.log('Correo interno enviado:', infoInternal.messageId)

    return NextResponse.json({ message: 'Relato enviado correctamente' })
  } catch (err) {
    console.error('Error en /api/publica:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
