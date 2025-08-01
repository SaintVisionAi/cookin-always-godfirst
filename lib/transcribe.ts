import axios from "axios"

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY!
const ASSEMBLY_API_URL = "https://api.assemblyai.com/v2"

export async function transcribeFromUrl(audioUrl: string): Promise<string> {
  const res = await axios.post(
    `${ASSEMBLY_API_URL}/transcript`,
    { audio_url: audioUrl },
    { headers: { authorization: ASSEMBLYAI_API_KEY } }
  )

  const transcriptId = res.data.id

  while (true) {
    const statusRes = await axios.get(`${ASSEMBLY_API_URL}/transcript/${transcriptId}`, {
      headers: { authorization: ASSEMBLYAI_API_KEY }
    })

    const status = statusRes.data.status
    if (status === "completed") return statusRes.data.text
    if (status === "error") throw new Error(`Assembly error: ${statusRes.data.error}`)

    await new Promise((r) => setTimeout(r, 2000))
  }
}
