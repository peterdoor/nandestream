# Ñande Stream

Portal de noticias y medio digital paraguayo.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Google Sheets como base de datos
- Vercel para deploy

## Setup local

```bash
npm install
cp .env.example .env.local
# Completar las variables en .env.local
npm run dev
```

Abrí http://localhost:3000

## Variables de entorno necesarias

| Variable | Descripción |
|---|---|
| `GOOGLE_SHEET_ID` | ID de tu Google Sheet |
| `GOOGLE_API_KEY` | API Key de Google Cloud (Sheets API habilitada) |
| `ADMIN_PASSWORD` | Contraseña para el panel de carga |
| `NEXT_PUBLIC_YOUTUBE_LIVE_ID` | ID del stream de YouTube |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio en producción |
| `NEXT_PUBLIC_YOUTUBE_URL` | Link completo al canal de YouTube |
| `NEXT_PUBLIC_FACEBOOK_URL` | Link a Facebook |
| `NEXT_PUBLIC_TIKTOK_URL` | Link a TikTok |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Link a Instagram |
| `NEXT_PUBLIC_WHATSAPP_URL` | Link de WhatsApp |

## Deploy en Vercel

1. Subir este repositorio a GitHub
2. En Vercel: New Project → importar el repo
3. Agregar todas las variables de entorno
4. Deploy

## Panel de administración

Accedé a `/admin/login` con la contraseña definida en `ADMIN_PASSWORD`.

Desde `/admin/nueva-nota` podés cargar notas directamente al Google Sheet.

## Google Sheet

Estructura esperada en la hoja `notas`:

| A: titulo | B: bajada | C: cuerpo | D: imagen_url | E: autor | F: fecha | G: categoria | H: video_url | I: destacado |
|---|---|---|---|---|---|---|---|---|

Categorías válidas: `actualidad` `politica` `gobierno` `institucional` `opinion` `comunidad` `videos` `entrevistas`

En `destacado`: `SI` o `NO`

En `fecha`: formato `YYYY-MM-DD`
