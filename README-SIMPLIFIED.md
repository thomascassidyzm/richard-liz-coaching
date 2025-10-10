# Richard & Liz - Broadband Consciousness Coaching (Simplified)

A streamlined consciousness coaching platform featuring live AI coaching with Richard and Liz.

## ✨ What Changed

This is a **simplified version** of the original Richard & Liz coaching platform. We've:

- ✅ **Removed all complexity** - No assessments, no programs, no corporate features
- ✅ **Focused on coaching** - Just live chat with Richard & Liz
- ✅ **Implemented best practices** - Direct Anthropic API with prompt caching
- ✅ **Clean architecture** - Simple, maintainable code

## 🎯 Features

- **Live Coaching Chat** with Richard (Deep Consciousness Architect) or Liz (Intuitive Expansion Catalyst)
- **Anthropic Claude Integration** with prompt caching for efficiency
- **Conversation Persistence** - Chats saved locally for 24 hours
- **Smooth Typing Animation** - Natural feeling responses
- **Mobile Responsive** - Works beautifully on all devices

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Ensure your `.env.local` file exists with:**
   ```
   RICHARD_LIZ_API_KEY=your_anthropic_api_key_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Deploy to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Environment Variable:**
   - `RICHARD_LIZ_API_KEY` = your Anthropic API key
4. **Deploy!**

The `api/chat.js` file is already configured for Vercel's serverless functions.

## 📁 File Structure

```
richard-liz-coaching/
├── index-new.html              # Simplified chat interface
├── assets/
│   └── js/
│       └── chat-simple.js      # Clean chat implementation
├── api/
│   └── chat.js                 # Vercel API endpoint
├── server.js                   # Local development server
├── .env.local                  # API keys (not in git)
└── package.json
```

## 🔑 Key Technical Features

### Prompt Caching
The coaching system prompts are cached by Anthropic, significantly reducing costs and improving response times for longer conversations.

```javascript
system: [
    {
        type: "text",
        text: COACHING_PROMPTS[coach],
        cache_control: { type: "ephemeral" } // ← Cached!
    }
]
```

### Conversation History
Keeps last 10 messages for context while preventing token overflow:

```javascript
const recentHistory = conversationHistory.slice(-10);
```

### Coach System Prompts
Each coach has a distinct personality and approach:
- **Richard**: Direct, penetrating, consciousness-expanding
- **Liz**: Intuitive, creative, multidimensional awareness

## 🎨 Customization

### Modify Coach Personalities
Edit the `COACHING_PROMPTS` in both:
- `api/chat.js` (for production)
- `server.js` (for local development)

### Change Styling
All styles are inline in `index-new.html` for simplicity. Modify the CSS variables:

```css
:root {
    --primary-gold: #FFD700;
    --bg-dark: #0a0a0a;
    /* etc... */
}
```

## 💡 Best Practices from Alexander Project

This implementation uses patterns from the Alexander (APML) project:

1. **Intent Preservation** - Core coaching logic is consistent
2. **Contextual Adaptation** - UI adapts to different devices
3. **Prompt Caching** - System prompts cached for efficiency
4. **Clean API Structure** - Simple, maintainable endpoints

## 🔐 Security Notes

- API key is stored in `.env.local` (never committed to git)
- CORS is enabled for local development
- Rate limiting should be added for production
- Consider adding authentication for production use

## 📊 API Usage

Each conversation benefits from prompt caching:
- **First message**: System prompt is cached (~500 tokens)
- **Subsequent messages**: Cache is reused (massive savings!)
- **Cache stats**: Logged in console for monitoring

## 🆚 Old vs New

| Feature | Old Version | New Version |
|---------|------------|-------------|
| Coaches | 6 (Tom, Alastair, etc.) | 2 (Richard, Liz) |
| Pages | 5+ (programs, assessment, etc.) | 1 (chat only) |
| Dependencies | Many | Minimal |
| API | Complex routing | Single endpoint |
| Focus | Multi-purpose platform | Pure coaching |

## 🚧 Future Enhancements (Optional)

If you want to add features:
- [ ] User authentication
- [ ] Export conversation transcripts
- [ ] Voice input/output
- [ ] Session scheduling
- [ ] Payment integration

## 📝 Notes

- Chat history is stored in `localStorage` and expires after 24 hours
- The original files are preserved (not deleted)
- This is a parallel implementation - you can run both versions

## 🆘 Troubleshooting

**API calls failing?**
- Check your `.env.local` file has the correct API key
- Ensure you're using Node 18+
- Check Anthropic API status

**Styling issues?**
- Clear browser cache
- Check console for errors
- Verify file paths are correct

**Deployment issues?**
- Ensure environment variables are set in Vercel
- Check serverless function logs
- Verify API endpoint path matches frontend

## 📄 License

MIT

---

**Built with consciousness expansion in mind** 🌟
