// 📦 lib/actions/notion.ts — Final Drop
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// Create generic Notion entry
export async function createNotionEntry(databaseId: string, content: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [
            {
              text: { content }
            }
          ]
        }
      }
    })
    return response
  } catch (err) {
    console.error("❌ Notion error:", err)
    throw new Error("Failed to create Notion entry")
  }
}

// Log Slack lead as CRM record
export async function logSlackLead(databaseId: string, userData: { name: string; email?: string; phone?: string }) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: { content: userData.name }
            }
          ]
        },
        Email: {
          email: userData.email || ""
        },
        Phone: {
          phone_number: userData.phone || ""
        },
        Source: {
          rich_text: [
            {
              text: { content: "Slack Lead" }
            }
          ]
        }
      }
    })
    return response
  } catch (err) {
    console.error("❌ Notion Slack log error:", err)
    throw new Error("Failed to log Slack lead")
  }
}

// Attach GPT memory trace
export async function logGptReply(databaseId: string, input: string, output: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Prompt: {
          rich_text: [
            { text: { content: input } }
          ]
        },
        Reply: {
          rich_text: [
            { text: { content: output } }
          ]
        },
        Source: {
          rich_text: [
            { text: { content: "GPT Agent" } }
          ]
        }
      }
    })
    return response
  } catch (err) {
    console.error("❌ Notion GPT log error:", err)
    throw new Error("Failed to log GPT reply")
  }
}

// Push transcription insight from AssemblyAI
export async function logTranscription(databaseId: string, transcript: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Transcript: {
          rich_text: [
            {
              text: { content: transcript }
            }
          ]
        },
        Source: {
          rich_text: [
            {
              text: { content: "Voice Transcript" }
            }
          ]
        }
      }
    })
    return response
  } catch (err) {
    console.error("❌ Notion transcription log error:", err)
    throw new Error("Failed to log transcription")
  }
}
