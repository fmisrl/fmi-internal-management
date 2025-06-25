
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting FMI application...');

createRoot(document.getElementById("root")!).render(<App />);
