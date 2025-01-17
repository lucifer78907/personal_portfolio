import { createBrowserRouter, RouterProvider } from "react-router-dom"
// Layout
import RootLayout from "./layout/RootLayout";
// Pages
import HomePage from "./pages/HomePage";

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
          }
        ]
      }
    ]
  );


  return (
    <RouterProvider router={router} />
  )
}