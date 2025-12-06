// Quick test to check if main components load
import('./src/EcoPromptApp.jsx').then(() => {
  console.log('✅ EcoPromptApp loads successfully');
}).catch(err => {
  console.error('❌ Error loading EcoPromptApp:', err.message);
});

import('./src/NeoWalletProvider.jsx').then(() => {
  console.log('✅ NeoWalletProvider loads successfully');
}).catch(err => {
  console.error('❌ Error loading NeoWalletProvider:', err.message);
});

import('./src/components/ProfileSetup.jsx').then(() => {
  console.log('✅ ProfileSetup loads successfully');
}).catch(err => {
  console.error('❌ Error loading ProfileSetup:', err.message);
});
