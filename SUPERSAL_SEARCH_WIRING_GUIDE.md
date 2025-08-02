# 🔥 SUPERSAL SEARCH BAR WIRING GUIDE

## 🎯 EASY WAYS TO ADD SUPERSAL TO YOUR SITES:

### METHOD 1: Drop-in Search Enhancement (EASIEST!)
**Add this ONE line to any website:**
```html
<script src="https://cookin-knowledge-saintsal.vercel.app/supersal-search-enhancer.js"></script>
```

**What it does:**
- ✅ Finds ALL search bars on the page
- ✅ Adds 🧠 AI button to each one
- ✅ Ctrl+Enter triggers SuperSal AI search
- ✅ Shows AI results in beautiful popup

### METHOD 2: Full Chat Widget (COMPLETE AI!)
**Add this ONE line for full SuperSal chat:**
```html
<script src="https://cookin-knowledge-saintsal.vercel.app/supersal-ai-inject.js"></script>
```

**What you get:**
- ✅ Full floating chat widget
- ✅ File upload capability 
- ✅ Screenshot analysis
- ✅ Your business knowledge base
- ✅ Beautiful UI with your branding

### METHOD 3: Custom Integration (FOR DEVELOPERS)
**Wire SuperSal into specific elements:**
```javascript
// Add to your existing search function
async function searchWithSuperSal(query) {
  const response = await fetch('https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: query,
      userId: 'WebsiteUser',
      searchMode: true 
    })
  });
  
  const data = await response.json();
  return data.response;
}
```

## 🚀 QUICK DEPLOYMENT:

### For cookinknowledge.com:
1. **Add to header:** `<script src="https://cookin-knowledge-saintsal.vercel.app/supersal-search-enhancer.js"></script>`
2. **Test:** Search anything and press Ctrl+Enter
3. **See:** SuperSal AI results appear!

### For any other site:
1. **Copy the script tag above**
2. **Paste in HTML head or before closing body tag**
3. **SuperSal automatically enhances ALL search bars**

## 💡 WHAT USERS SEE:
- 🧠 AI indicator on search bars
- Ctrl+Enter for AI search
- Beautiful AI-powered results
- Your business knowledge in action

## 🔧 YOUR ENDPOINTS:
- **Main API:** https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io/api/chat
- **Fallback:** https://cookin-knowledge-saintsal.vercel.app/api/chat
- **Scripts:** https://cookin-knowledge-saintsal.vercel.app/supersal-*.js

**Just add one script tag and SuperSal powers ALL your search bars!** 🚀
