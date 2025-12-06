# 🚀 EcoPrompt Deployment Guide

Complete guide for deploying your Soft Brutalism app to production.

## 📋 Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Replace mock data with real API calls
- [ ] Add environment variables for API keys
- [ ] Test responsive design on all screen sizes
- [ ] Run build command successfully
- [ ] Optimize images and assets
- [ ] Set up analytics (optional)
- [ ] Configure domain (if custom)

---

## 🏗️ Build for Production

### 1. Create Production Build

```bash
cd /Users/marcusmattus/humain
npm run build
```

This creates an optimized build in `./dist` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps

### 2. Preview Production Build

```bash
npm run preview
```

Test the production build locally before deploying.

---

## ☁️ Deployment Options

### Option 1: Vercel (Recommended)

**Fastest and easiest deployment for React apps.**

#### Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/marcusmattus/humain
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ecoprompt
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

#### Via GitHub
1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - EcoPrompt Soft Brutalism"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecoprompt.git
git push -u origin main
```

2. Connect to Vercel:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Click "Deploy"

**Environment Variables on Vercel:**
```
Settings → Environment Variables
Add: VITE_API_KEY, VITE_API_URL, etc.
```

---

### Option 2: Netlify

**Great for static sites with forms.**

#### Via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

#### Via Drag & Drop
1. Build: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag `dist` folder to browser
4. Site is live!

#### Via GitHub
1. Push to GitHub
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Connect GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

### Option 3: GitHub Pages

**Free hosting for public repos.**

#### Setup
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Update vite.config.js for base path
export default defineConfig({
  plugins: [react()],
  base: '/ecoprompt/', // Your repo name
})

# Deploy
npm run deploy
```

Visit: `https://YOUR_USERNAME.github.io/ecoprompt/`

---

### Option 4: Railway

**Backend + Frontend hosting.**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

---

### Option 5: AWS S3 + CloudFront

**Enterprise-grade hosting.**

#### Steps:
1. Build: `npm run build`
2. Create S3 bucket
3. Enable static website hosting
4. Upload `dist` folder contents
5. Set up CloudFront distribution
6. Configure custom domain (Route 53)

---

## 🔐 Environment Variables

### Development (.env.local)
Create `.env.local` in root:
```env
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_dev_key
VITE_ENABLE_ANALYTICS=false
```

### Production
Set in hosting platform dashboard:
```env
VITE_API_URL=https://api.yoursite.com
VITE_API_KEY=your_prod_key
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Usage in Code
```jsx
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
```

---

## 🌐 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain: `ecoprompt.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

---

## ⚡ Performance Optimization

### 1. Code Splitting
Already handled by Vite automatically.

### 2. Image Optimization
```bash
# Install image optimizer
npm install vite-plugin-imagemin -D
```

Add to `vite.config.js`:
```js
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: { plugins: [{ removeViewBox: false }] }
    })
  ]
});
```

### 3. Enable Compression
Headers for hosting platform:
```
# Vercel (vercel.json)
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}

# Netlify (_headers file in public/)
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
```

### 4. Lazy Load Components
```jsx
import { lazy, Suspense } from 'react';

const OptimizerView = lazy(() => import('./OptimizerView'));

<Suspense fallback={<LoadingSpinner />}>
  <OptimizerView />
</Suspense>
```

---

## 📊 Analytics Setup

### Google Analytics
```bash
npm install react-ga4
```

```jsx
// src/main.jsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Track page views
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
```

### Plausible Analytics (Privacy-friendly)
Add to `index.html`:
```html
<script defer data-domain="ecoprompt.com" 
  src="https://plausible.io/js/script.js">
</script>
```

---

## 🔒 Security Best Practices

### 1. Sanitize User Input
```bash
npm install dompurify
```

```jsx
import DOMPurify from 'dompurify';

const cleanPrompt = DOMPurify.sanitize(userInput);
```

### 2. API Key Protection
Never commit API keys! Use environment variables.

```js
// Good ✅
const apiKey = import.meta.env.VITE_API_KEY;

// Bad ❌
const apiKey = 'sk-proj-12345...';
```

### 3. HTTPS Only
All modern hosting platforms enforce HTTPS by default.

### 4. Content Security Policy
Add to hosting platform headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com;
```

---

## 🐛 Debugging Production Issues

### Check Build Logs
```bash
npm run build 2>&1 | tee build.log
```

### Test Production Bundle Locally
```bash
npm run preview
```

### Check Console Errors
1. Open DevTools (F12)
2. Check Console tab
3. Check Network tab for 404s

### Rollback on Vercel
```bash
vercel rollback
```

### View Deployment Logs
- Vercel: Project → Deployments → Click deployment
- Netlify: Deploys → Click deployment → Deploy log

---

## 📈 Monitoring

### Uptime Monitoring
Free services:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://pingdom.com)
- StatusCake (https://statuscake.com)

### Error Tracking
```bash
npm install @sentry/react
```

Setup:
```jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

---

## 🎯 Post-Deployment Checklist

- [ ] Visit deployed URL and test all pages
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Verify forms submit correctly
- [ ] Test API integrations
- [ ] Check browser console for errors
- [ ] Verify analytics tracking
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Check page load speed (PageSpeed Insights)
- [ ] Set up monitoring alerts
- [ ] Share with team/users!

---

## 🚀 Quick Deploy Commands

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### GitHub Pages
```bash
npm run deploy
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**Your EcoPrompt app is ready for the world! 🌍💚**

Need help? Check the docs or open an issue on GitHub.
