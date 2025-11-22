import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'swiper/css';
import 'swiper/css/effect-cards';
import App from './App.jsx'
import SmoothScroll from './provider/smooth-scroll.jsx'
import { TimelineContextProvider } from './context/timelineContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <SmoothScroll>
    <ThemeProvider>
      <TimelineContextProvider>
        <App />
      </TimelineContextProvider>
    </ThemeProvider>
  </SmoothScroll>
)
