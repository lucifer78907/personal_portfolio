import { createBrowserRouter, RouterProvider } from "react-router-dom"
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Layout
import RootLayout from "./layout/RootLayout";
// Pages
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import SkillDetail from "./pages/SkillDetail";

gsap.registerPlugin(SplitText, ScrollTrigger);

// Hoisted out of the component: createBrowserRouter() builds a new router on
// every call, so creating it during render would rebuild (and reset) routing
// state on any App re-render.
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/about', element: <About /> },
      { path: '/random-photos', element: <Gallery /> },
      { path: '/contact', element: <Contact /> },
      { path: '/projects', element: <Projects /> },
      // Opened by the skills board on the homepage, which hands the clicked
      // icon across as a shared element. Also valid as a direct URL — the page
      // falls back to a plain reveal when it arrives without one.
      { path: '/skills/:slug', element: <SkillDetail /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />
}
