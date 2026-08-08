import { createRoot } from 'react-dom/client'
import './index.css'
import 'swiper/css';
import 'swiper/css/effect-cards';
import App from './App.jsx'
import { IntroProvider } from './context/introContext.jsx';

// Smooth scrolling is handled by GSAP ScrollSmoother in RootLayout, not a provider.
createRoot(document.getElementById('root')).render(
  <IntroProvider>
    <App />
  </IntroProvider>
)
