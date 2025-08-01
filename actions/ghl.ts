// 📞 lib/actions/ghl.ts — HighLevel CRM Logic
import axios from "axios"

const GHL_API_URL = process.env.NEXT_PUBLIC_GHL_BASE_URL
const GHL_API_KEY = process.env.GHL_API_KEY

export interface GhlContactInput {
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  tags?: string[]
  source?: string
}

// Create contact in HighLevel
export async function createGhlContact(input: GhlContactInput) {
  try {
    const response = await axios.post(
      `${GHL_API_URL}/contacts/`,
      {
        firstName: input.firstName,
        lastName: input.lastName || "",
        email: input.email || "",
        phone: input.phone || "",
        tags: input.tags || [],
        source: input.source || "SaintSAL"
      },
      {
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )
    return response.data
  } catch (err) {
    console.error("❌ GHL contact error:", err)
    throw new Error("Failed to create GHL contact")
  }
}

// Add note to contact
export async function createGhlNote(contactId: string, body: string) {
  try {
    const response = await axios.post(
      `${GHL_API_URL}/contacts/${contactId}/notes/`,
      { body },
      {
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )
    return response.data
  } catch (err) {
    console.error("❌ GHL note error:", err)
    throw new Error("Failed to create GHL note")
  }
}
