# Neo Wallet Setup Guide

## Wallet Detection & Connection Fixed! ✅

### What Was Fixed

1. **Provider Consistency**: Fixed the wallet provider mismatch that was causing the profile page to show a blank screen
2. **Wallet Detection**: Improved wallet readyState detection to better identify installed wallets
3. **Better Error Messages**: Added clear error messages for wallet connection issues
4. **Debug Logging**: Added console logs to help diagnose connection issues

### How to Test Wallet Connection

1. **Install a Neo Wallet Extension**:
   - **NeoLine** (Recommended): https://neoline.io/en
   - **O3 Wallet**: https://o3.network
   - **OneGate**: https://onegate.space

2. **Open the App**:
   - Navigate to http://localhost:3000
   - The app should load without errors

3. **Connect Your Wallet**:
   - Click "Connect Neo Wallet" button in the sidebar
   - A modal will appear showing available wallets
   - Click on your installed wallet (e.g., NeoLine)
   - Approve the connection in the wallet extension popup

4. **Verify Connection**:
   - Your wallet address should appear in the sidebar
   - Balance should load (may take a few seconds)
   - Profile page should now be accessible

### Checking Wallet Detection

Open the browser console (F12) and look for these logs:

```
Wallet State: {
  address: "...",
  connected: true/false,
  connecting: false,
  walletName: "NeoLine",
  availableWallets: [...]
}
```

### Common Issues & Solutions

#### Issue: "No Neo wallets detected"
**Solution**: 
- Make sure you have a Neo wallet extension installed
- Refresh the page after installing the extension
- Check if the extension is enabled in your browser

#### Issue: "Wallet not installed" error when clicking connect
**Solution**:
- The wallet extension may not be properly loaded
- Try refreshing the page
- Disable and re-enable the extension
- Check browser console for errors

#### Issue: Profile page shows "Connect Wallet First"
**Solution**:
- This is correct behavior when no wallet is connected
- Click "Connect Neo Wallet" and approve the connection
- Profile page will load once wallet is connected

#### Issue: Wallet connects but balance shows "0.0000"
**Solution**:
- This is normal for new TestNet wallets
- Get TestNet tokens from: https://neowish.ngd.network/
- Click the refresh button to reload balance

### Network Configuration

The app is configured to use **Neo N3 TestNet**:
- Network: TestNet
- Chain ID: 877933390
- RPC: https://testnet1.neo.coz.io:443

To switch to MainNet, edit `src/NeoWalletProvider.jsx`:
```javascript
const options = useMemo(() => ({
  network: 'MainNet',
  chainId: 860833102,
  rpcAddress: 'https://mainnet1.neo.coz.io:443',
  autoConnect: false,
}), []);
```

### Developer Notes

**Files Modified**:
- `src/main.jsx` - Uses correct NeoWalletProvider from rentfuse-labs
- `src/components/ProfileSetup.jsx` - Updated to use `useWallet` from rentfuse-labs
- `src/NeoWalletProvider.jsx` - Configured for TestNet
- `src/NeoWalletButton.jsx` - Improved wallet detection and error handling

**Wallet Adapter**:
- Using `@rentfuse-labs/neo-wallet-adapter-react` (v0.5.0)
- Supports NeoLine, O3, and OneGate wallets
- Auto-connect disabled to prevent errors on initial load

### Testing Checklist

- [ ] App loads without console errors
- [ ] "Connect Neo Wallet" button is visible
- [ ] Wallet modal shows available wallets with correct status
- [ ] Clicking installed wallet triggers connection
- [ ] Wallet popup appears and can be approved
- [ ] Address and balance display after connection
- [ ] Profile page is accessible after connection
- [ ] Disconnect button works properly
- [ ] Page refresh maintains connection (if wallet allows)

### Still Having Issues?

1. Check browser console (F12) for error messages
2. Verify wallet extension is installed and enabled
3. Try a different browser or incognito mode
4. Ensure you're using a supported Neo wallet (NeoLine, O3, OneGate)
5. Check network tab for failed API requests

### Support Links

- NeoLine Docs: https://neoline.io/en/docs
- O3 Wallet: https://docs.o3.network/
- Neo Developer Guide: https://docs.neo.org/
- Neo TestNet Faucet: https://neowish.ngd.network/
