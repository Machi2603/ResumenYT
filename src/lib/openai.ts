import OpenAI from 'openai'

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
}

export async function generateSummary(
  transcript: string,
  title: string,
  readingTime: number
): Promise<string> {
  const wordTarget =
    readingTime === 0
      ? 'el transcript completo, sin recortar nada'
      : `aproximadamente ${readingTime * 200} palabras (lectura de ${readingTime} minutos)`

  const res = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    stream: false,
    messages: [
      {
        role: 'system',
        content:
          'Eres un asistente experto en resumir contenido de YouTube. Responde siempre en el mismo idioma que el transcript (español o inglés). Usa Markdown: usa **negrita** para conceptos clave, listas para puntos múltiples, y estructura clara con secciones si el contenido es largo.',
      },
      {
        role: 'user',
        content: `Título del vídeo: "${title}"\n\nTranscript:\n${transcript.slice(0, 80000)}\n\n---\nGenera un resumen de ${wordTarget}. Empieza directamente con el contenido, sin presentaciones.`,
      },
    ],
    temperature: 0.4,
    max_tokens: readingTime === 0 ? 4096 : readingTime * 250,
  })

  return res.choices[0]?.message?.content ?? 'No se pudo generar el resumen.'
}

export async function chatWithContext(
  transcript: string,
  title: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string
): Promise<string> {
  const res = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    stream: false,
    messages: [
      {
        role: 'system',
        content: `Eres un asistente de análisis de vídeos de YouTube. Tienes acceso completo a la transcripción del vídeo "${title}". Responde en el mismo idioma que el usuario. Sé preciso, útil y conciso. Usa Markdown cuando mejore la legibilidad.\n\nTRANSCRIPCIÓN COMPLETA:\n${transcript.slice(0, 80000)}`,
      },
      ...history.slice(-10),
      { role: 'user', content: userMessage },
    ],
    temperature: 0.5,
    max_tokens: 1024,
  })

  return res.choices[0]?.message?.content ?? 'Error al procesar la respuesta.'
}

export function getOpenAIClient() {
  return getClient()
}
