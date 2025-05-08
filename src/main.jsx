import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'swiper/css';
import 'swiper/css/effect-cards';
import App from './App.jsx'
import SmoothScroll from './provider/smooth-scroll.jsx'
import { TimelineContextProvider } from './context/timelineContext.jsx';

createRoot(document.getElementById('root')).render(
  <SmoothScroll>
    <StrictMode>
      <TimelineContextProvider>
        <App />
      </TimelineContextProvider>
    </StrictMode>
  </SmoothScroll>
)
