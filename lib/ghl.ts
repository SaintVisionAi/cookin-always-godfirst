const GHL_API_KEY = process.env.GHL_API_KEY
const GHL_BASE_URL = process.env.GHL_API_BASE_URL || "https://rest.gohighlevel.com/v1"

if (!GHL_API_KEY) throw new Error("Missing GHL_API_KEY")

async function ghlRequest(path: string, method = "POST", body?: any) {
  const res = await fetch(`${GHL_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("❌ GHL Error:", err)
    throw new Error(`GHL request failed: ${err}`)
  }

  return res.json()
}

export async function createGhlContact({
  email,
  firstName,
  lastName,
  phone,
}: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}) {
  return ghlRequest("/contacts/", "POST", {
    email,
    firstName,
    lastName,
    phone,
  })
}

export async function sendGhlEmail({
  contactId,
  subject,
  body,
}: {
  contactId: string
  subject: string
  body: string
}) {
  return ghlRequest(`/emails/`, "POST", {
    contactId,
    subject,
    body,
  })
}

export async function triggerGhlWorkflow({
  contactId,
  workflowId,
}: {
  contactId: string
  workflowId: string
}) {
  return ghlRequest("/workflows/trigger", "POST", {
    contactId,
    workflowId,
  })
}
