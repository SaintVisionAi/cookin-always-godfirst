import { handleAgentAction } from "./lib/agent-functions"

handleAgentAction({
  message: "Add John Doe with john@example.com to my CRM and book meeting.",
  language: "EN",
  email: "john@example.com",
  name: "John Doe"
})
