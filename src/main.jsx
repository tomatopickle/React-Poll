import CssBaseline from "@mui/material/CssBaseline";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";
import FormCreator from "./FormCreator.jsx";
import Forms from "./Forms.jsx";
import FormDash from "./FormDash.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Routes, Route } from "react-router";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/formCreator" element={<FormCreator />} />
      <Route path="/formDash" element={<FormDash />} />
      <Route path="/forms" element={<Forms />} />
    </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
