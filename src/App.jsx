import { createBrowserRouter, RouterProvider } from "react-router-dom"
// Layout
import RootLayout from "./layout/RootLayout";
// Pages
import HomePage from "./pages/HomePage";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";

export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HomePage />
          },
          {
            path: '/random-photos',
            element: <Gallery />
          },
          {
            path: '/contact',
            element: <Contact />
          },
          {
            path: '/projects',
            element: <Projects />
          }
        ]
      }
    ]
  );


  return (
    <RouterProvider router={router} />
  )
}