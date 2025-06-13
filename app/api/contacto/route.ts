import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER!
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
})

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, motivo, mensaje } = await req.json()

    if (!nombre || !email || !motivo || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Envío de confirmación al remitente (no bloquea errores)
    transporter
      .sendMail({
        from: `MarcaPagina <${GMAIL_USER}>`,
        to: email,
        subject: 'Hemos recibido tu mensaje',
        text: `Hola ${nombre.split(' ')[0]},\n\nGracias por contactarnos por "${motivo}". Pronto responderemos tu mensaje.\n\nSíguenos en nuestras redes sociales:\nInstagram: https://www.instagram.com/marcapagina.page/\nTwitter: https://x.com/marcapaginapage\nThreads: https://www.threads.com/@marcapagina.page\nBluesky: https://bsky.app/profile/marcapagina.bsky.social\n\n— MarcaPagina`,
        html: `<p>Hola ${nombre.split(' ')[0]},</p>
              <p>Gracias por contactarnos por "${motivo}". Pronto responderemos tu mensaje.</p>
              <p>Síguenos en nuestras redes sociales para estar al tanto de novedades:</p>
              <ul>
                <li><a href="https://www.instagram.com/marcapagina.page/" target="_blank">Instagram</a></li>
                <li><a href="https://x.com/marcapaginapage" target="_blank">Twitter</a></li>
                <li><a href="https://www.threads.com/@marcapagina.page" target="_blank">Threads</a></li>
                <li><a href="https://bsky.app/profile/marcapagina.bsky.social" target="_blank">Bluesky</a></li>
              </ul>
              <p>— MarcaPagina</p>`
      })
      .catch(err => console.error('Error enviando confirmación de contacto:', err))

    // Correo interno
    await transporter.sendMail({
      from: `MarcaPagina <${GMAIL_USER}>`,
      to: GMAIL_USER,
      cc: 'pino.jose@gmail.com',
      replyTo: email,
      subject: `Contacto: ${motivo} - ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No proporcionado'}\nMotivo: ${motivo}\n\n${mensaje}`
    })

    return NextResponse.json({ message: 'Mensaje enviado correctamente' })
  } catch (err) {
    console.error('Error en /api/contacto:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
