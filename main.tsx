import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './src/App';

const domNode = document.getElementById('root');

if (domNode) {
  const root = createRoot(domNode);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
