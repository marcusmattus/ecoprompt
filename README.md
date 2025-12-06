# EcoPrompt - Soft Brutalism Design System

![EcoPrompt Banner](https://img.shields.io/badge/Design-Soft_Brutalism-00E599?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)

**EcoPrompt** is a revolutionary AI token optimization dashboard featuring a unique "Soft Brutalism" design system — combining the bold, raw aesthetic of Brutalism with friendly rounded corners and vibrant colors.

## 🎨 Design Philosophy

**Soft Brutalism** = Brutalism meets Friendliness

- ✅ **Bold Colors**: Neo green (#00E599), Brutal yellow (#FFD93D), Pink (#FF6BCB)
- ✅ **Thick Borders**: 4px solid black borders everywhere
- ✅ **Rounded Corners**: 32px+ border radius for softness
- ✅ **Hard Shadows**: Offset box shadows (8px 8px 0px)
- ✅ **High Contrast**: Black text on bright backgrounds
- ✅ **Playful Interactions**: Hover effects, animations

## 🚀 Features

### Dashboard View
- **Token Usage Chart** - Beautiful area chart with neobrutalism styling
- **Eco Score Gauge** - Circular progress indicator
- **Stat Cards** - Cost savings, carbon reduction, API usage
- **Recent Activity Feed** - Real-time optimization wins

### Prompt Optimizer
- **AI-Powered Optimization** - Reduce token usage by 40-60%
- **Real-time Savings Calculator** - See cost & carbon savings
- **Before/After Comparison** - Visual prompt improvements
- **Copy to Clipboard** - One-click optimized prompt export

### 3D Node Universe (Coming Soon)
- Interactive globe showing global AI usage
- Node clustering by efficiency
- Real-time developer connections

## 📦 Installation

```bash
# Clone the repository
cd humain

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🛠️ Tech Stack

- **Framework**: React 18.2
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite 5.0
- **Fonts**: Space Grotesk (Google Fonts)

## 📐 Component Library

### Core Components

#### BaseCard
```jsx
<BaseCard color="bg-white">
  <h2>Card Content</h2>
</BaseCard>
```

#### Button
```jsx
<Button variant="primary" size="lg" icon={Zap}>
  Optimize Now
</Button>
```

Variants: `primary`, `secondary`, `danger`, `outline`
Sizes: `sm`, `md`, `lg`, `xl`

#### Input
```jsx
<Input 
  label="API Key" 
  icon={Search}
  placeholder="Enter key..."
/>
```

#### Badge
```jsx
<Badge color="bg-[#00E599]" icon={Leaf}>
  Token Saver
</Badge>
```

#### ProgressBar
```jsx
<ProgressBar 
  label="Efficiency" 
  value={92} 
  max={100}
  color="bg-[#00E599]"
/>
```

### Advanced Components

#### EcoScoreGauge
Circular progress indicator with SVG
```jsx
<EcoScoreGauge score={92} />
```

#### StatCard
Metric display with trend indicator
```jsx
<StatCard 
  icon="💰"
  label="Savings"
  value="$452.30"
  trend={12}
  color="bg-[#FFD93D]"
/>
```

## 🎯 Design System

### Colors
```css
--neo-green: #00E599      /* Primary brand */
--brutal-black: #0A0A0F   /* Text & borders */
--brutal-white: #FEFEFE   /* Backgrounds */
--brutal-yellow: #FFD93D  /* Warnings */
--brutal-pink: #FF6BCB    /* Accents */
--brutal-blue: #4FFFB0    /* Info */
--brutal-red: #FF5252     /* Danger */
--brutal-purple: #B084FF  /* Premium */
```

### Shadows
```css
--shadow-sm: 4px 4px 0px #0A0A0F
--shadow-md: 6px 6px 0px #0A0A0F
--shadow-lg: 8px 8px 0px #0A0A0F
--shadow-xl: 12px 12px 0px #0A0A0F
```

### Border Radius
```css
--radius-sm: 12px
--radius-md: 20px
--radius-lg: 32px
--radius-xl: 48px
```

## 📱 Responsive Design

- **Mobile First**: Fully responsive from 320px+
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Sidebar**: Collapsible on mobile with overlay

## 🧪 Development

### Project Structure
```
humain/
├── public/
├── src/
│   ├── components/
│   ├── EcoPromptApp.jsx    # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

### Available Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.js`:
```js
colors: {
  'neo-green': '#YOUR_COLOR',
  // ...
}
```

### Adding New Components
Follow the Soft Brutalism pattern:
```jsx
<div className="
  bg-white
  border-4 border-[#0A0A0F]
  rounded-[32px]
  shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
  p-6
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  transition-all duration-200
">
  Your content
</div>
```

## 🌍 Sustainability Mission

EcoPrompt helps developers:
- 💰 **Reduce AI costs** by 40-60%
- 🌱 **Lower carbon footprint** through efficient prompts
- ⚡ **Optimize API usage** with smart caching
- 📊 **Track impact** with real-time metrics

## 🤝 Contributing

Contributions welcome! Please follow the Soft Brutalism design guidelines.

## 📄 License

MIT License - feel free to use in your projects!

## 🙏 Credits

- **Design System**: Inspired by Neobrutalism trend
- **Icons**: Lucide React
- **Fonts**: Space Grotesk by Florian Karsten
- **Charts**: Recharts library

---

Built with 💚 for a sustainable AI future

**Live Demo**: Coming soon  
**Documentation**: [Full Design System Guide](./DESIGN_SYSTEM.md)
