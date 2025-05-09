import { NextRequest, NextResponse } from 'next/server'
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// Variables de entorno
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!

// Handler para la API
export async function POST(req: NextRequest) {
  try {
    // Extraer datos de la solicitud
    const body = await req.json()
    const { email, source, etapa, archivoEnviado = false, fechaRegistro, fechaEnvio } = body

    if (!email) {
      return NextResponse.json({ error: 'Se requiere correo electrónico' }, { status: 400 })
    }

    // Crear credenciales JWT
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Inicializar el documento con las credenciales
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    
    // Cargar información del documento
    await doc.loadInfo()
    
    // Obtener la hoja de cálculo (primera hoja)
    const sheet = doc.sheetsByIndex[0]
    
    // Buscar si el email ya existe
    const rows = await sheet.getRows()
    let existingRow: GoogleSpreadsheetRow | null = null;
    
    for (const row of rows) {
      if (row.get('email') === email) {
        existingRow = row;
        break;
      }
    }
    
    const timestamp = new Date().toISOString()
    
    if (existingRow) {
      // Actualizar fila existente
      // Solo actualizamos los campos nuevos
      if (etapa === 'formulario_completo') {
        existingRow.set('formulario_completo', 'Sí')
        existingRow.set('archivo_enviado', archivoEnviado ? 'Sí' : 'No')
        existingRow.set('fecha_envio', fechaEnvio || timestamp)
      }
      
      existingRow.set('actualizado', timestamp)
      await existingRow.save()
      
    } else {
      // Crear nueva fila
      await sheet.addRow({
        email,
        fuente: source,
        pre_formulario: etapa === 'pre_formulario' ? 'Sí' : 'No',
        formulario_completo: etapa === 'formulario_completo' ? 'Sí' : 'No',
        archivo_enviado: archivoEnviado ? 'Sí' : 'No',
        fecha_registro: fechaRegistro || timestamp,
        fecha_envio: fechaEnvio || '',
        creado: timestamp,
        actualizado: timestamp
      })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error en la API de Google Sheets:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 