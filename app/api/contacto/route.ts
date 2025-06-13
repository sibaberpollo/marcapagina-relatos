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
    const { nombre, email, telefono, mensaje } = await req.json()

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Envío de confirmación al remitente (no bloquea errores)
    transporter
      .sendMail({
        from: `MarcaPagina <${GMAIL_USER}>`,
        to: email,
        subject: 'Hemos recibido tu mensaje',
        text: `Hola ${nombre.split(' ')[0]},\n\nGracias por contactarnos. Pronto responderemos tu mensaje.\n\n— MarcaPagina`,
        html: `<p>Hola ${nombre.split(' ')[0]},</p><p>Gracias por contactarnos. Pronto responderemos tu mensaje.</p><p>— MarcaPagina</p>`
      })
      .catch(err => console.error('Error enviando confirmación de contacto:', err))

    // Correo interno
    await transporter.sendMail({
      from: `MarcaPagina <${GMAIL_USER}>`,
      to: GMAIL_USER,
      cc: 'pino.jose@gmail.com',
      replyTo: email,
      subject: `Mensaje de contacto de ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No proporcionado'}\n\n${mensaje}`
    })

    return NextResponse.json({ message: 'Mensaje enviado correctamente' })
  } catch (err) {
    console.error('Error en /api/contacto:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
