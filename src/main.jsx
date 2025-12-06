import React from 'react'
import ReactDOM from 'react-dom/client'
import NeoWalletProvider from './NeoWalletProvider.jsx'
import EcoPromptApp from './EcoPromptApp.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NeoWalletProvider>
      <EcoPromptApp />
    </NeoWalletProvider>
  </React.StrictMode>,
)
