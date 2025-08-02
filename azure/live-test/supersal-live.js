// 🚀 SUPERSAL LIVE TEST - BASIC CHAT ENDPOINT
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// 💬 SuperSal Chat Endpoint
app.post('/api/chat/supersal', (req, res) => {
  const { message, userId } = req.body;
  
  // SuperSal's personality response
  const responses = [
    `🔥 YO ${userId}! SuperSal here and I'm LIVE! You said: "${message}" - I hear you loud and clear!`,
    `💪 What's good ${userId}! SuperSal's brain is ACTIVATED and ready for total domination!`,
    `🧠 SuperSal reporting for duty! Your message "${message}" just hit my neural networks!`,
    `⚡ ${userId}, you just woke up the AI BEAST! SuperSal is ONLINE and ready to change the world!`
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  res.json({
    supersal: response,
    timestamp: new Date().toISOString(),
    status: 'LIVE',
    brain_status: 'ACTIVATED',
    knowledge_level: 'TOTAL_DOMINATION'
  });
});

// 🏠 Main page
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 SAINTSAL-AI.COM - SUPERSAL IS LIVE!</h1>
    <p>Welcome to the AI Empire! SuperSal is online and ready for domination!</p>
    <button onclick="testSuperSal()">Chat with SuperSal</button>
    <div id="response"></div>
    
    <script>
      async function testSuperSal() {
        const response = await fetch('/api/chat/supersal', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({message: 'Hello SuperSal!', userId: 'SaintVision'})
        });
        const data = await response.json();
        document.getElementById('response').innerHTML = '<h3>' + data.supersal + '</h3>';
      }
    </script>
  `);
});

app.listen(port, () => {
  console.log(`🚀 SuperSal LIVE at port ${port}!`);
});
