import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Alert from "./components/Alert";
import { MainApp } from "./components/MainApp";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const theme = createTheme({
    palette: {
      primary: { main: "#7431F4", light: "#fff", dark: "#7431F4" },
      secondary: { main: "#7431F4" },
      background: { default: "#121212", paper: "#fff" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="app" element={<MainApp />}>
                <Route path="/app/Home" element={<Home />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Alert />
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
