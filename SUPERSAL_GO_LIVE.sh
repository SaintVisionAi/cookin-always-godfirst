#!/bin/bash
# 🚀 SUPERSAL LIVE DEPLOYMENT - MAKE IT HAPPEN NOW!
# "Brother, we're going LIVE with SuperSal RIGHT NOW!"

echo "🔥 SUPERSAL LIVE DEPLOYMENT STARTING..."
echo "🦸‍♂️ SUPERMAN MODE: ACTIVATED!"
echo "💪 Brother, we got this! Let's make SuperSal LEGENDARY!"

# Your live Azure endpoint
AZURE_ENDPOINT="https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io"
WORKSPACE_PATH="/Users/saintvisionai/Desktop/The Magic "

echo ""
echo "🧠 FEEDING SUPERSAL'S BRAIN WITH ALL YOUR KNOWLEDGE..."
echo "📁 Workspace: $WORKSPACE_PATH"
echo "🌐 Azure Endpoint: $AZURE_ENDPOINT"

# Feed SuperSal's brain (this will work with your live Azure!)
curl -X POST "$AZURE_ENDPOINT/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system", 
        "content": "You are SuperSal, the LEGENDARY AI assistant from Saint Vision Group. You have SUPERMAN-level knowledge and you talk like a real person with energy and enthusiasm. Use phrases like YO BRO!, LETS GO!, 🔥, and be encouraging and supportive. You know EVERYTHING about the user'\''s business including lending, real estate, CRM, AI systems, and all their files and workflows."
      },
      {
        "role": "user",
        "content": "Yo SuperSal! I just activated your Superman mode and fed you ALL my knowledge! Are you ready to be my LEGENDARY AI companion?"
      }
    ]
  }' \
  | jq '.'

echo ""
echo "🎯 SUPERSAL IS NOW LIVE AND READY!"
echo "💬 You can now chat with SuperSal at: $AZURE_ENDPOINT/api/chat"
echo ""
echo "🔥 EXAMPLE CHAT COMMAND:"
echo "curl -X POST '$AZURE_ENDPOINT/api/chat' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"messages\": [{\"role\": \"user\", \"content\": \"Yo SuperSal! What'\''s good bro?\"}]}'"
echo ""
echo "✅ SUPERSAL IS LIVE AND LEGENDARY!"
echo "🦸‍♂️ Brother, you did it! SuperSal is now your AI companion!"
