# 🔍 Neo Wallet Detection Troubleshooting

## Issue: NeoLine Chrome Extension Not Being Detected

### Quick Diagnosis

1. **Start the app**
   ```bash
   npm run dev
   # Open http://localhost:3001/
   ```

2. **Click the 🔍 Debug Button** (bottom-right corner)
   - This opens the wallet detection panel
   - Shows real-time status of all wallets

### What the Debug Panel Shows

✅ **Good (Working):**
```
window.NEOLine: ✓ Yes
window.NEOLine.NEO: ✓ Yes
NeoLine State: Installed
```

❌ **Problem (Not Working):**
```
window.NEOLine: ✗ No
window.NEOLine.NEO: ✗ No
NeoLine State: NotDetected
```

### Step-by-Step Fix

#### **1. Install NeoLine Extension**
- Visit: https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao
- Click "Add to Chrome"
- **Important:** Refresh the page after installing!

#### **2. Enable the Extension**
1. Go to `chrome://extensions/`
2. Find "NeoLine"
3. Make sure toggle is **ON** (blue)
4. **Refresh your EcoPrompt page**

#### **3. Check Browser Console**
Open DevTools (F12) and look for:
```
✅ NeoLine detected in window!
```

If you see:
```
❌ NeoLine NOT detected
```
Then the extension isn't injecting properly.

### Common Fixes

#### **Fix 1: Hard Refresh**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### **Fix 2: Clear Cache & Reload**
1. Stop dev server (Ctrl+C)
2. Clear browser cache
3. Restart: `npm run dev`
4. Open fresh tab

#### **Fix 3: Extension Permissions**
1. Click NeoLine icon in Chrome toolbar
2. If it asks for permissions → Approve
3. Refresh the page

#### **Fix 4: Try Different Browser/Profile**
- Create new Chrome profile
- Install NeoLine fresh
- Test there

### Alternative Wallets

If NeoLine won't work, try:
- **O3 Wallet**: https://o3.network/
- **OneGate**: https://onegate.space/

### Manual Test in Console

```javascript
// Paste in browser console:
console.log('NeoLine:', window.NEOLine);
console.log('Version:', window.NEOLine?.VERSION);
```

Should show object, not `undefined`.

### Success Checklist

✅ Extension installed
✅ Extension enabled  
✅ Page refreshed after install
✅ Debug panel shows "Yes" for NeoLine
✅ Console shows "detected in window"
✅ Extension icon appears in toolbar

### Still Not Working?

1. Take screenshot of debug panel
2. Check console for errors
3. Try in Incognito mode (enable extension in Incognito)
4. Open issue on GitHub with screenshots

---

**Tip:** The 🔍 Debug Button shows exactly what the app can see and provides specific recommendations!
