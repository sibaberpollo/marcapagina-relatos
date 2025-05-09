# Configuración de Google Sheets para el Formulario de Publicación

Este documento describe cómo configurar la integración con Google Sheets para el formulario de publicación de MarcaPágina.

## Variables de Entorno Requeridas

Añade estas variables a tu archivo `.env.local`:

```
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
```

## Pasos para Configurar Google Sheets API

1. **Crear un Proyecto en Google Cloud Platform**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto
   - Anota el ID del proyecto

2. **Habilitar la API de Google Sheets**
   - En tu proyecto, ve a "Biblioteca de APIs"
   - Busca "Google Sheets API" y habilítala

3. **Crear una Cuenta de Servicio**
   - Ve a "Credenciales" en la consola de Google Cloud
   - Crea una nueva cuenta de servicio
   - Dale un nombre y una descripción
   - Asigna el rol "Editor" para Google Sheets
   - Crea una clave privada en formato JSON
   - Descarga el archivo JSON de credenciales

4. **Extraer las Credenciales**
   - Del archivo JSON descargado, necesitas:
     - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `private_key` → `GOOGLE_PRIVATE_KEY`

5. **Crear una Hoja de Cálculo**
   - Crea una nueva hoja de cálculo en Google Sheets
   - Añade estas columnas en la primera fila:
     - email
     - fuente
     - pre_formulario
     - formulario_completo
     - archivo_enviado
     - fecha_registro
     - fecha_envio
     - creado
     - actualizado
   - Comparte la hoja con la dirección de correo de la cuenta de servicio (con permisos de edición)
   - Copia el ID de la hoja desde la URL (`https://docs.google.com/spreadsheets/d/TU_ID_DE_HOJA_AQUÍ/edit`) → `GOOGLE_SHEET_ID`

## Estructura de la Hoja de Cálculo

La hoja de cálculo registrará:

1. **Datos iniciales** (cuando el usuario ingresa su correo y fuente antes del desafío)
   - Email
   - Fuente (cómo conoció el sitio)
   - Fecha de registro

2. **Datos finales** (cuando el usuario completa el desafío y envía su relato)
   - Confirmación de envío
   - Fecha de envío

Esto te permitirá medir la tasa de conversión entre los usuarios que comienzan el proceso y los que lo completan con el envío del relato. 