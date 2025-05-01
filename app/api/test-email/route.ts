// File: tailwind-nextjs-starter-blog/app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Asegúrate de definir en tu .env.local:
// GMAIL_USER=marcapaginapage@gmail.com
// GMAIL_APP_PASSWORD=avghprnwvjtnqgmb (sin espacios)

const GMAIL_USER = process.env.GMAIL_USER!
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

export async function GET(req: NextRequest) {
  try {
    // Enviar correo de prueba
    await transporter.sendMail({
      from: GMAIL_USER,
      to: 'pino.jose@gmail.com',
      subject: 'Correo de prueba desde Next.js',
      text: '¡Hola! Este es un correo de prueba enviado desde el endpoint /api/test-email.',
    })

    return NextResponse.json({ message: 'Correo de prueba enviado exitosamente' })
  } catch (error) {
    console.error('Error al enviar correo de prueba:', error)
    return NextResponse.json(
      { error: 'No se pudo enviar el correo de prueba' },
      { status: 500 }
    )
  }
}
