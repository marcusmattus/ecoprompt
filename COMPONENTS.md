# EcoPrompt Component Reference

Complete guide to all components in the Soft Brutalism design system.

## 📦 Core Components

### BaseCard
The foundation card component with neobrutalism styling.

```jsx
<BaseCard 
  color="bg-white"           // Background color class
  className=""               // Additional classes
  onClick={() => {}}         // Click handler
>
  <h2>Card Content</h2>
</BaseCard>
```

**Features:**
- 4px black border
- 32px border radius
- 8px offset shadow
- Hover lift effect
- Cursor pointer

**Color Options:**
- `bg-white` (default)
- `bg-[#00E599]/10` (Neo green tint)
- `bg-[#FFD93D]/10` (Yellow tint)
- `bg-[#B084FF]/10` (Purple tint)

---

### Button
Versatile button with 4 variants and 4 sizes.

```jsx
<Button 
  variant="primary"          // Style variant
  size="md"                  // Size
  icon={Zap}                 // Lucide icon component
  onClick={() => {}}         // Click handler
  disabled={false}           // Disabled state
  className=""               // Additional classes
>
  Button Text
</Button>
```

**Variants:**
- `primary` - Neo green bg, black text, hover yellow
- `secondary` - Black bg, white text, hover purple
- `danger` - Red bg, white text
- `outline` - Transparent bg, border, hover black

**Sizes:**
- `sm` - px-4 py-2, 16px radius, 14px text
- `md` - px-6 py-3, 24px radius, 16px text
- `lg` - px-8 py-4, 32px radius, 18px text
- `xl` - px-10 py-5, 48px radius, 20px text

**Features:**
- Active press-down effect
- Uppercase text
- Wide tracking
- Bold font
- Shadow transitions

---

### Input
Text input with label, icon, and focus effects.

```jsx
<Input 
  label="Field Label"        // Optional label
  icon={Search}              // Optional Lucide icon
  placeholder="Enter text"   // Placeholder text
  value={value}              // Controlled value
  onChange={(e) => {}}       // Change handler
  className=""               // Additional classes
/>
```

**Features:**
- Optional label (uppercase, bold, small)
- Left icon with 24px size
- 4px border, 20px radius
- Focus shadow and lift effect
- Bold text
- Placeholder opacity 40%

**Usage Example:**
```jsx
const [apiKey, setApiKey] = useState('');

<Input 
  label="API Key"
  icon={Key}
  placeholder="sk-proj-..."
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
/>
```

---

### Badge
Small pill-shaped tag for labels and status.

```jsx
<Badge 
  color="bg-[#00E599]"       // Background color
  icon={Leaf}                // Optional icon
>
  Badge Text
</Badge>
```

**Features:**
- 2px border
- 16px border radius
- Small shadow (2px offset)
- Uppercase text
- Bold font
- Wide tracking
- Inline-flex layout

**Common Uses:**
```jsx
<Badge color="bg-[#00E599]" icon={Check}>
  Optimized
</Badge>

<Badge color="bg-[#FFD93D]" icon={AlertTriangle}>
  Warning
</Badge>

<Badge color="bg-[#FF5252]">
  Error
</Badge>
```

---

### ProgressBar
Animated horizontal progress indicator.

```jsx
<ProgressBar 
  label="Task Progress"      // Label text
  value={75}                 // Current value
  max={100}                  // Maximum value (default 100)
  color="bg-[#00E599]"       // Fill color
/>
```

**Features:**
- Percentage calculation
- Label + percentage display
- Stripe pattern overlay
- Smooth 1s transition
- 4px border, rounded-full
- Right border on fill

**Visual Elements:**
- Track: White bg, 4px border
- Fill: Colored with stripes
- Animation: Duration 1000ms ease-out

---

## 🎯 Specialized Components

### StatCard
Display metric with icon, label, value, and trend.

```jsx
<StatCard 
  icon="💰"                  // Emoji or icon
  label="Total Savings"      // Metric label
  value="$452.30"           // Current value
  trend={12}                // Percentage change
  color="bg-[#FFD93D]"      // Accent color
/>
```

**Layout:**
- Icon circle (56x56px) top-left
- Trend badge top-right
- Label (small, uppercase, 60% opacity)
- Value (large, black font)

**Trend Display:**
- Positive: TrendingUp icon, green
- Negative: TrendingDown icon, red
- Shows absolute value with %

---

### EcoScoreGauge
Circular SVG progress indicator.

```jsx
<EcoScoreGauge score={92} />
```

**Features:**
- 160x160px SVG
- 16px stroke width
- Background circle (10% opacity)
- Progress circle (neo green)
- Center text (score + label)
- Rating badge below (yellow)
- 1s animation transition

**Automatic Rating:**
- 90-100: "EXCELLENT"
- 70-89: "GOOD"
- 50-69: "AVERAGE"
- 0-49: "NEEDS WORK"

---

## 📊 Layout Components

### Sidebar
Navigation sidebar with logo, menu, and profile.

```jsx
<Sidebar 
  activeTab="dashboard"      // Current active tab
  setActiveTab={setActiveTab}// Tab setter function
  isOpen={true}              // Mobile open state
  setIsOpen={setIsOpen}      // Open state setter
/>
```

**Menu Items Structure:**
```js
{
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard
}
```

**Sections:**
1. Logo Area (Neo green bg)
2. Navigation (scrollable)
3. User Profile (bottom)

**Mobile Behavior:**
- Fixed position with overlay
- Slide-in animation
- Closes on item click
- 300ms transition

---

## 📱 View Components

### DashboardView
Complete dashboard with stats, chart, and activity.

```jsx
<DashboardView />
```

**Includes:**
- 3x StatCard grid (responsive)
- Token usage AreaChart
- EcoScoreGauge with progress bars
- Recent activity feed

**Responsive Grid:**
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 3 columns + sidebar

---

### OptimizerView
Prompt optimization interface.

```jsx
<OptimizerView />
```

**Features:**
- Input textarea with char counter
- Optimize button with loading state
- Results display with savings
- Copy to clipboard
- 3-column savings grid

**Simulated Optimization:**
- 1.5s delay (replace with real API)
- Returns optimized text
- Calculates token/cost/CO2 savings

---

## 🎨 Styling Utilities

### Color Classes
```jsx
// Backgrounds
bg-[#00E599]  // Neo green
bg-[#FFD93D]  // Brutal yellow
bg-[#FF6BCB]  // Brutal pink
bg-[#4FFFB0]  // Brutal blue
bg-[#FF5252]  // Brutal red
bg-[#B084FF]  // Brutal purple
bg-[#0A0A0F]  // Brutal black
bg-[#FEFEFE]  // Brutal white

// With opacity
bg-[#00E599]/10  // 10% opacity
bg-[#00E599]/20  // 20% opacity
```

### Shadow Classes
```jsx
shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]   // Small
shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]   // Medium
shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]   // Large
shadow-[12px_12px_0px_0px_rgba(10,10,15,1)] // Extra Large
```

### Border Radius
```jsx
rounded-[12px]   // Small
rounded-[16px]   // Badge
rounded-[20px]   // Medium
rounded-[24px]   // Input
rounded-[32px]   // Card
rounded-[48px]   // Button XL
```

### Animation Classes
```jsx
animate-fadeIn        // Fade in from bottom
animate-slideUp       // Slide up from bottom
animate-pulse         // Pulsing effect
animate-bounce-slow   // Slow bounce (3s)
```

---

## 🔧 Custom Hooks & Utilities

### State Management Example
```jsx
const [activeTab, setActiveTab] = useState('dashboard');
const [isOptimizing, setIsOptimizing] = useState(false);
const [result, setResult] = useState(null);
```

### Simulated API Call
```jsx
const handleOptimize = () => {
  if (!prompt) return;
  setIsOptimizing(true);
  
  setTimeout(() => {
    setResult({
      optimized: "Your optimized prompt...",
      savings: { tokens: 45, money: 0.02, co2: 1.2 }
    });
    setIsOptimizing(false);
  }, 1500);
};
```

Replace with real API:
```jsx
const handleOptimize = async () => {
  setIsOptimizing(true);
  try {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    setResult(data);
  } catch (error) {
    console.error(error);
  } finally {
    setIsOptimizing(false);
  }
};
```

---

## 📐 Layout Patterns

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <BaseCard>Card 1</BaseCard>
  <BaseCard>Card 2</BaseCard>
  <BaseCard>Card 3</BaseCard>
</div>
```

### Two-Column Layout
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* Main content (2/3 width) */}
  </div>
  <div>
    {/* Sidebar content (1/3 width) */}
  </div>
</div>
```

### Centered Container
```jsx
<div className="max-w-4xl mx-auto space-y-8">
  {/* Centered content */}
</div>
```

---

## 🎯 Best Practices

### 1. Always Use Border + Shadow
```jsx
// Good ✅
<div className="border-4 border-[#0A0A0F] shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]">

// Bad ❌
<div className="border shadow-lg">
```

### 2. Generous Border Radius
```jsx
// Good ✅
<div className="rounded-[32px]">

// Bad ❌
<div className="rounded-md">
```

### 3. Bold Typography
```jsx
// Good ✅
<h1 className="text-4xl font-black uppercase">

// Bad ❌
<h1 className="text-2xl font-normal">
```

### 4. High Contrast Colors
```jsx
// Good ✅
<div className="bg-[#00E599] text-[#0A0A0F]">

// Bad ❌
<div className="bg-gray-200 text-gray-400">
```

### 5. Interactive Feedback
```jsx
// Good ✅
<button className="
  hover:translate-x-[-2px] 
  hover:translate-y-[-2px]
  hover:shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]
  transition-all duration-150
">

// Bad ❌
<button className="hover:opacity-80">
```

---

## 📚 Additional Resources

- **Tailwind Docs**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Recharts**: https://recharts.org

**Need more components?** Follow the Soft Brutalism pattern:
1. Thick border (4px)
2. Generous radius (20px+)
3. Offset shadow
4. Bold colors
5. Hover effects
