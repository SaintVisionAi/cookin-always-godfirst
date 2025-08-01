import axios from "axios"

export async function sendSlackMessage(text: string) {
  return axios.post("https://slack.com/api/chat.postMessage", {
    channel: "#leads",
    text
  }, {
    headers: {
      Authorization: \`Bearer \${process.env.SLACK_API_TOKEN}\`
    }
  })
}
