export async function getSignedAudioUrl(originalUrl: string): Promise<string> {
  try {
    // ดึง key จาก R2 URL
    const url = new URL(originalUrl)
    const key = decodeURIComponent(url.pathname.slice(1)) // ตัด / ออก

    const response = await fetch(
      `https://xianhua-signed-url.wisonporn2517.workers.dev/?key=${encodeURIComponent(key)}`,
      {
        headers: { 'X-Auth-Token': 'xianhua-internal-2026' }
      }
    )

    if (!response.ok) return originalUrl

    const data = await response.json()
    return data.url || originalUrl
  } catch {
    return originalUrl
  }
}
