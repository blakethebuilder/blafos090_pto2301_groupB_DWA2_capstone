import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";

import "./styles/App.css";
import "./styles/index.css";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import App from "./App";
import Copyright from '../src/components/Copyright';
import Success from "./pages/Success";

const theme = createTheme({
  palette: {
    primary: {
      main: "#Ff4500", // Orange
    },
    secondary: {
      main: "#ffffff", // White
    },
    tertiary: {
      main: "#00ff80", // Complementary color 2: Green
    },
    quaternary: {
      main: "#8000ff", // Complementary color 3: Purple
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    children: [
      { path: "", element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "success", element: <Success /> },
      { path: "home", element: <Home /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Copyright sx={{ mt: 2 }} />
    </ThemeProvider>
  </React.StrictMode>
);