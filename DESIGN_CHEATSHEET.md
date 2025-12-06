# 🎨 EcoPrompt Design Cheat Sheet

Quick reference for building with the Soft Brutalism design system.

---

## 🎯 Core Principle

**Soft Brutalism = Bold + Friendly**

Every element needs:
1. ✅ Thick border (4px)
2. ✅ Rounded corners (20px+)
3. ✅ Offset shadow
4. ✅ Bold color
5. ✅ Hover effect

---

## 🎨 Color Quick Reference

```jsx
// Copy-paste ready classes

// Backgrounds
bg-[#00E599]  // 💚 Neo Green (Primary)
bg-[#FFD93D]  // 💛 Brutal Yellow (Warning)
bg-[#FF6BCB]  // 💗 Brutal Pink (Accent)
bg-[#4FFFB0]  // 💙 Brutal Blue (Info)
bg-[#FF5252]  // ❤️ Brutal Red (Danger)
bg-[#B084FF]  // 💜 Brutal Purple (Premium)
bg-[#0A0A0F]  // ⚫ Brutal Black (Text)
bg-[#FEFEFE]  // ⚪ Brutal White (BG)

// With opacity
bg-[#00E599]/10
bg-[#00E599]/20
```

---

## 📏 Essential Classes

### Borders
```jsx
border-4 border-[#0A0A0F]  // Standard border
border-3 border-[#0A0A0F]  // Lighter border
```

### Border Radius
```jsx
rounded-[12px]   // Small (badges)
rounded-[16px]   // Badge
rounded-[20px]   // Input
rounded-[24px]   // Medium
rounded-[32px]   // Card (most common)
rounded-[48px]   // Button XL
rounded-full     // Circular
```

### Shadows
```jsx
shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]    // Small
shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]    // Medium  
shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]    // Large (default)
shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]  // XL
```

### Hover Effects
```jsx
hover:translate-x-[-2px] hover:translate-y-[-2px]
hover:shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]
transition-all duration-200
```

---

## 🧱 Component Patterns

### Card Pattern
```jsx
<div className="
  bg-white
  border-4 border-[#0A0A0F]
  rounded-[32px]
  shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
  p-6
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  hover:shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]
  transition-all duration-200
">
  Content here
</div>
```

### Button Pattern
```jsx
<button className="
  px-6 py-3
  bg-[#00E599]
  text-[#0A0A0F]
  border-4 border-[#0A0A0F]
  rounded-[24px]
  font-bold
  uppercase
  tracking-wide
  shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
  hover:bg-[#FFD93D]
  active:translate-x-[2px] active:translate-y-[2px]
  active:shadow-none
  transition-all duration-150
">
  Click Me
</button>
```

### Input Pattern
```jsx
<input className="
  w-full
  px-6 py-4
  bg-white
  border-4 border-[#0A0A0F]
  rounded-[20px]
  font-bold text-lg
  placeholder:text-[#0A0A0F]/40
  focus:outline-none
  focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]
  focus:-translate-y-1 focus:-translate-x-1
  transition-all duration-150
" />
```

### Badge Pattern
```jsx
<span className="
  inline-flex items-center gap-2
  px-3 py-1
  bg-[#00E599]
  text-[#0A0A0F]
  border-2 border-[#0A0A0F]
  rounded-[16px]
  text-sm font-bold
  uppercase tracking-wide
  shadow-[2px_2px_0px_0px_rgba(10,10,15,1)]
">
  Badge
</span>
```

---

## 📐 Layout Patterns

### Full Page Container
```jsx
<div className="min-h-screen bg-[#FEFEFE] p-6">
  {/* Content */}
</div>
```

### Centered Container
```jsx
<div className="max-w-4xl mx-auto space-y-8">
  {/* Content */}
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### Two Column
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

---

## ✍️ Typography

### Headings
```jsx
<h1 className="text-5xl font-black uppercase tracking-tight">
<h2 className="text-4xl font-black uppercase">
<h3 className="text-2xl font-black uppercase">
<h4 className="text-xl font-bold uppercase">
```

### Body Text
```jsx
<p className="text-base font-medium">         // Normal
<p className="text-lg font-bold">            // Important
<p className="text-sm font-medium">          // Small
<p className="text-xs font-bold uppercase">  // Label
```

### Special
```jsx
<span className="font-mono text-sm">         // Code
<span className="tracking-wide uppercase">   // Caps
```

---

## 🎬 Animations

### Fade In
```jsx
className="animate-fadeIn"

// Or custom
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Slide Up
```jsx
className="animate-slideUp"
```

### Bounce (Logo)
```jsx
className="animate-bounce-slow"
```

### Pulse
```jsx
className="animate-pulse"
```

---

## 🎯 Spacing Scale

```jsx
space-y-2   // 16px  (tight)
space-y-4   // 32px  (normal)
space-y-6   // 48px  (relaxed)
space-y-8   // 64px  (loose)

gap-4       // 32px  (grid)
gap-6       // 48px  (grid wide)

p-4         // 32px  (padding)
p-6         // 48px  (padding generous)
```

---

## 📱 Responsive Breakpoints

```jsx
// Mobile first approach
<div className="
  grid-cols-1           // Mobile
  md:grid-cols-2        // Tablet (768px+)
  lg:grid-cols-3        // Desktop (1024px+)
">

// Hidden on mobile
<div className="hidden md:block">

// Sidebar toggle
<div className="md:hidden">  // Mobile menu button
<div className="hidden md:block">  // Desktop always visible
```

---

## 🎨 Icon Usage

```jsx
import { Zap, Leaf, TrendingUp } from 'lucide-react';

<Zap size={24} strokeWidth={3} />
<Leaf className="text-[#00E599]" />
<TrendingUp size={16} strokeWidth={2.5} />
```

Common sizes:
- 12-16px: Badges
- 20-24px: Buttons, inputs
- 32-48px: Feature icons
- 64px+: Hero sections

---

## 🔥 Common Combinations

### Success Card
```jsx
<div className="
  bg-[#00E599]/20
  border-4 border-[#00E599]
  rounded-[24px]
  p-6
">
  Success message
</div>
```

### Warning Card
```jsx
<div className="
  bg-[#FFD93D]/20
  border-4 border-[#FFD93D]
  rounded-[24px]
  p-6
">
  Warning message
</div>
```

### Danger Card
```jsx
<div className="
  bg-[#FF5252]/20
  border-4 border-[#FF5252]
  rounded-[24px]
  p-6
">
  Error message
</div>
```

### Info Card
```jsx
<div className="
  bg-[#4FFFB0]/20
  border-4 border-[#4FFFB0]
  rounded-[24px]
  p-6
">
  Info message
</div>
```

---

## 💡 Pro Tips

### 1. Consistency
Always use the same border width (4px) and style (solid black).

### 2. Generous Radius
Minimum 20px border-radius for the "soft" in Soft Brutalism.

### 3. Hover Feedback
Every clickable element should have a hover state.

### 4. Color Contrast
Maintain at least 4.5:1 contrast ratio for accessibility.

### 5. Shadow Direction
Keep shadow offset consistent (bottom-right: 8px 8px).

---

## ⚡ Quick Copy Templates

### Stat Card
```jsx
<div className="bg-white border-4 border-[#0A0A0F] rounded-[32px] shadow-[8px_8px_0px_0px_rgba(10,10,15,1)] p-6">
  <div className="w-14 h-14 bg-[#00E599] rounded-full border-4 border-[#0A0A0F] flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]">
    💚
  </div>
  <div className="mt-4">
    <div className="text-xs font-bold text-[#0A0A0F]/60 uppercase">Label</div>
    <div className="text-3xl font-black text-[#0A0A0F]">Value</div>
  </div>
</div>
```

### CTA Button
```jsx
<button className="px-10 py-5 bg-[#00E599] text-[#0A0A0F] border-4 border-[#0A0A0F] rounded-[48px] text-xl font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(10,10,15,1)] hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150">
  Get Started
</button>
```

### Form Field
```jsx
<div className="space-y-2">
  <label className="block text-sm font-black uppercase tracking-wide">
    Field Label
  </label>
  <input className="w-full px-6 py-4 bg-white border-4 border-[#0A0A0F] rounded-[20px] font-bold text-lg focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)] transition-all" />
</div>
```

---

## 🎯 Design Checklist

When creating a new component, verify:
- [ ] Has 4px black border
- [ ] Border radius is 20px or more
- [ ] Has offset shadow
- [ ] Uses brand colors
- [ ] Has hover state
- [ ] Text is bold/black weight
- [ ] Spacing follows 8px grid
- [ ] Responsive on mobile
- [ ] Accessible (contrast, focus states)
- [ ] Animated transitions

---

## 📚 Resources

**Files to Reference:**
- `src/EcoPromptApp.jsx` - All components
- `COMPONENTS.md` - Component API docs
- `tailwind.config.js` - Theme configuration

**External:**
- Colors: Use color picker for exact values
- Icons: https://lucide.dev
- Fonts: Google Fonts (Space Grotesk)

---

**Print this cheat sheet and keep it handy! 📌**

*Last updated: December 2024*
