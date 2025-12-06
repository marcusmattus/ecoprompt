# EcoPrompt Quick Start Guide

## 🎉 Your App is Running!

**Local URL**: http://localhost:3000/

The development server is now live with hot-reload enabled.

## 🎨 What You Get

### ✅ Complete Soft Brutalism Design System
- Bold colors (Neo Green, Brutal Yellow, Pink)
- 4px thick borders on everything
- Rounded corners (32px+)
- Hard offset shadows (8px 8px 0px)
- Playful hover effects

### ✅ Fully Functional Pages

1. **Dashboard** (Default view)
   - Token usage chart with area graph
   - 3 stat cards (Savings, Carbon, Requests)
   - Eco Score circular gauge (92/100)
   - Progress bars for Efficiency & Cache Hit Rate
   - Recent activity feed with token savings

2. **Prompt Optimizer**
   - Textarea for input prompt
   - Character counter
   - "Optimize Now" button
   - Results show optimized prompt
   - Savings breakdown (Tokens, Cost, CO2)
   - Copy to clipboard functionality

3. **Node Universe** (Coming Soon placeholder)
   - Visual placeholder with Globe icon
   - Message about 3D experience

4. **Settings**
   - API Key input field
   - Max Token Limit input
   - Save Changes button

### ✅ Responsive Design
- Mobile-friendly sidebar (hamburger menu)
- Tablet & desktop layouts
- Breakpoints: 768px (md), 1024px (lg)

## 🎯 Key Features

### Component Library Included
- `BaseCard` - Rounded brutalist cards
- `Button` - 4 variants, 4 sizes with icons
- `Input` - Labels, icons, focus states
- `Badge` - Pill-shaped tags
- `ProgressBar` - Animated with stripes
- `EcoScoreGauge` - SVG circular gauge
- `StatCard` - Metrics with trends

### Color Palette
```
Neo Green:     #00E599 (Primary)
Brutal Black:  #0A0A0F (Borders/Text)
Brutal White:  #FEFEFE (Backgrounds)
Brutal Yellow: #FFD93D (Warnings)
Brutal Pink:   #FF6BCB (Accents)
Brutal Blue:   #4FFFB0 (Info)
Brutal Red:    #FF5252 (Danger)
Brutal Purple: #B084FF (Premium)
```

## 🚀 Next Steps

### 1. Customize Content
Edit `/src/EcoPromptApp.jsx`:
- Change mock data in `CHART_DATA` and `RECENT_ACTIVITY`
- Update stat card values
- Modify user profile info

### 2. Add Real API Integration
```jsx
const handleOptimize = async () => {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  setResult(data);
};
```

### 3. Build 3D Node Universe
Install Three.js:
```bash
npm install three @react-three/fiber @react-three/drei
```

### 4. Add Authentication
Install auth library:
```bash
npm install @clerk/clerk-react
# or
npm install @auth0/auth0-react
```

### 5. Deploy to Production
```bash
npm run build
# Outputs to ./dist folder

# Deploy to Vercel
npm install -g vercel
vercel
```

## 📝 Component Usage Examples

### Creating a New View
```jsx
const MyCustomView = () => (
  <div className="space-y-6 animate-fadeIn">
    <BaseCard>
      <h2 className="text-2xl font-black uppercase mb-4">
        My Feature
      </h2>
      <p>Content here...</p>
    </BaseCard>
  </div>
);

// Add to main app
{activeTab === 'myfeature' && <MyCustomView />}
```

### Custom Stat Card
```jsx
<StatCard 
  icon="🚀"
  label="API Calls Today"
  value="2,543"
  trend={25}
  color="bg-[#4FFFB0]"
/>
```

### Custom Button with Action
```jsx
<Button 
  variant="primary"
  size="lg"
  icon={Sparkles}
  onClick={() => console.log('Clicked!')}
>
  Magic Button
</Button>
```

## 🐛 Troubleshooting

### Port 3000 Already in Use?
Edit `vite.config.js`:
```js
server: {
  port: 3001, // Change port
  open: true
}
```

### Styles Not Loading?
Ensure Tailwind is configured:
```bash
# Reinstall if needed
npm install -D tailwindcss postcss autoprefixer
```

### Chart Not Rendering?
Check that recharts is installed:
```bash
npm install recharts
```

## 📚 Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/icons
- **Recharts Docs**: https://recharts.org/
- **React Docs**: https://react.dev/

## 🎨 Design Inspiration

This design follows the "Soft Brutalism" trend:
- Thick borders + Rounded corners
- Bold colors + High contrast
- Playful + Functional
- Digital brutalism meets friendly UX

## ✨ Features to Add

- [ ] Dark mode toggle
- [ ] User authentication
- [ ] Real-time WebSocket updates
- [ ] Export dashboard as PDF
- [ ] Social sharing of optimizations
- [ ] Team collaboration features
- [ ] API key management
- [ ] Usage analytics graphs
- [ ] Cost calculator tool
- [ ] Carbon footprint comparisons

---

**Need Help?**
- Check console for errors (F12)
- Review README.md for full docs
- Edit `EcoPromptApp.jsx` for changes

**Happy Building! 🌍💚**
