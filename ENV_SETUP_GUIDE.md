# ⚡ Quick Setup - SpoonAI API Keys

## ✅ I've Created Your `.env` File!

The file is located at: `/Users/marcusmattus/ecoprompt/.env`

## 🔑 Next Steps (2 Minutes)

### Option 1: OpenAI (Most Popular)
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-proj-...`)
4. Open `.env` file
5. Paste after `VITE_OPENAI_API_KEY=`
6. Save file

### Option 2: Anthropic Claude
1. Go to: https://console.anthropic.com/
2. Create account / Sign in
3. Go to API Keys
4. Create key
5. Paste in `.env` after `VITE_ANTHROPIC_API_KEY=`

### Option 3: Google Gemini (Free Tier)
1. Go to: https://makersuite.google.com/app/apikey
2. Create API key
3. Paste in `.env` after `VITE_GOOGLE_API_KEY=`

## 📝 Example `.env` (DO NOT USE THESE - Get Your Own!)

```bash
# Before (Empty):
VITE_OPENAI_API_KEY=

# After (With your key):
VITE_OPENAI_API_KEY=sk-proj-abc123xyz456...
```

## 🚀 After Adding Key

```bash
# 1. Save .env file
# 2. Restart dev server
npm run dev

# 3. Open http://localhost:3001/
# 4. SpoonAI tab should now work!
```

## ✨ What You'll Get

Once you add a key:
- ✅ SpoonAI chat interface
- ✅ Multi-provider AI support
- ✅ 5 different agent types
- ✅ Memory and context management
- ✅ Metrics dashboard
- ✅ Real-time streaming responses

## 💰 Free Tiers & Costs

### OpenAI
- No free tier
- GPT-3.5: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Start with $5 credit

### Anthropic
- No free tier
- Claude 3 Haiku: ~$0.008 per 1K tokens
- Start with $5 credit

### Google Gemini ⭐ (Recommended for Testing)
- **FREE tier available!**
- Generous limits for testing
- No credit card required initially
- ~$0.00025 per 1K tokens after free tier

## 🎯 Recommendation

**Start with Google Gemini** - it has a free tier perfect for testing!

1. Visit: https://makersuite.google.com/app/apikey
2. Get free API key
3. Add to `.env`
4. Test SpoonAI features for free!

## 📁 File Location

```bash
# Your .env file is here:
/Users/marcusmattus/ecoprompt/.env

# Edit with:
code .env          # VS Code
nano .env          # Terminal
open -e .env       # TextEdit (Mac)
```

## 🔒 Security

✅ `.env` is in `.gitignore` - won't be committed
✅ Keys are kept local only
✅ Never share your keys
✅ Rotate if exposed

## ⚠️ Important Notes

1. **You only need ONE key** - any provider works
2. **Keys are NOT included** - you must get your own
3. **File must be named `.env`** exactly (with the dot)
4. **Restart server** after adding keys
5. **Keep keys secret** - never share or commit

## 🎉 That's It!

Once you add a key and restart:
```bash
npm run dev
```

The SpoonAI features will automatically activate! No more "Setup Required" message.

## 🆘 Having Issues?

Check the console (F12) for:
```
SpoonAI: No API keys found. Running in demo mode.
```

If you see this after adding a key:
1. Make sure key is on correct line
2. No spaces before or after `=`
3. File saved
4. Server restarted

## 📚 More Info

- See `SPOONAI_QUICK_REF.md` for SpoonAI features
- See `SPOONAI_FULL_GUIDE.md` for detailed docs
- See `.env` file for all options and comments

---

**Ready?** Get a free Google Gemini key and start using SpoonAI in 2 minutes! 🚀
