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
    console.log('Recibida solicitud en /api/publica')

    const data = await req.formData()
    const email = data.get('email') as string
    const description = data.get('description') as string
    const token = data.get('response') as string

    console.log('Datos extraídos del formulario:', { email })

    if (!token) {
      console.error('Error: Token Turnstile no proporcionado')
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
      console.error('Error: Turnstile inválido', vj['error-codes'])
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
        console.log(`Procesando ${files.length} archivos adjuntos`)
        for (const f of files) {
          const buf = Buffer.from(await f.arrayBuffer())
          attachments.push({ filename: f.name, content: buf })
          console.log(`Adjunto preparado: ${f.name}, tamaño: ${buf.length} bytes`)
        }
      }
    }

    console.log('Configuración de correo:', {
      from: `MarcaPagina <${GMAIL_USER}>`,
      to: email,
      GMAIL_USER_LENGTH: GMAIL_USER?.length || 0,
      GMAIL_APP_PASSWORD_LENGTH: GMAIL_APP_PASSWORD?.length || 0,
    })

    // 1) Envío de confirmación al remitente (no bloquea errores)
    transporter
      .sendMail({
        from: `MarcaPagina <${GMAIL_USER}>`,
        to: email,
        subject: 'Transtextos\\Mp: recibimos tu relato para ser revisado',
        text: `¡Hola! 👋\n\n¡Gracias por compartir tu historia con nosotros! Hemos recibido tu relato y será considerado para ser publicado como parte de Transtextos, nuestro feed de narrativa en MarcaPágina.\n\nMarcaPágina es ahora una app que publica relatos, memes, playlists y otros formatos literarios, donde toda la narrativa forma parte de Transtextos.\n\nTu texto será evaluado antes de publicarse en nuestro feed de narrativa.\n\nSíguenos en nuestras redes sociales para estar al tanto de novedades y publicaciones:\n\nTranstextos:\nInstagram: https://www.instagram.com/transtextosig/\nTwitter: https://x.com/transtextos\n\nMarcaPágina:\nInstagram: https://www.instagram.com/marcapagina.page/\nTwitter: https://x.com/marcapaginapage\nThreads: https://www.threads.com/@marcapagina.page\nBluesky: https://bsky.app/profile/marcapagina.bsky.social\n\n— El equipo de MarcaPagina y Transtextos`,
        html: `<p>¡Hola! 👋</p>
               <p>¡Gracias por compartir tu historia con nosotros! Hemos recibido tu relato y será considerado para ser publicado como parte de <strong>Transtextos</strong>, nuestro feed de narrativa en MarcaPágina.</p>
               <p><strong>MarcaPágina</strong> es ahora una app que publica relatos, memes, playlists y otros formatos literarios, donde toda la narrativa forma parte de <strong>Transtextos</strong>.</p>
               <p style='background:#faff00; color:#222; padding:8px; border-radius:6px; font-weight:bold;'>Tu texto será evaluado antes de publicarse en nuestro feed continuo de escritura breve.</p>
               <p>Síguenos en nuestras redes sociales para estar al tanto de novedades y publicaciones:</p>
               <h4>Transtextos:</h4>
               <ul>
                 <li><a href='https://www.instagram.com/transtextosig/' target='_blank'>Instagram</a></li>
                 <li><a href='https://x.com/transtextos' target='_blank'>Twitter</a></li>
               </ul>
               <h4>MarcaPágina:</h4>
               <ul>
                 <li><a href='https://www.instagram.com/marcapagina.page/' target='_blank'>Instagram</a></li>
                 <li><a href='https://x.com/marcapaginapage' target='_blank'>Twitter</a></li>
                 <li><a href='https://www.threads.com/@marcapagina.page' target='_blank'>Threads</a></li>
                 <li><a href='https://bsky.app/profile/marcapagina.bsky.social' target='_blank'>Bluesky</a></li>
               </ul>
               <p>— El equipo de MarcaPagina y Transtextos</p>`,
      })
      .then((info) => console.log('Confirmación enviada a remitente:', info.messageId))
      .catch((err) => console.error('Error enviando confirmación al remitente:', err))

    try {
      // 2) Envío interno con copia a equipos de MarcaPagina y Transtextos
      console.log('Enviando correo interno a:', GMAIL_USER)
      const infoInternal = await transporter.sendMail({
        from: `MarcaPagina <${GMAIL_USER}>`,
        to: GMAIL_USER,
        cc: 'pino.jose@gmail.com, transtextos@gmail.com, luis.garmendia67@gmail.com, mirco.ferri.yv@gmail.com, joacofe@gmail.com',
        replyTo: email,
        subject: `Nuevo relato para Transtextos de ${email}`,
        text: `De: ${email}\n\n${description}`,
        attachments,
      })
      console.log('Correo interno enviado correctamente:', infoInternal.messageId)
    } catch (error) {
      console.error('Error al enviar correo interno:', error)
    }

    return NextResponse.json({ message: 'Relato enviado correctamente' })
  } catch (err) {
    console.error('Error en /api/publica:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
