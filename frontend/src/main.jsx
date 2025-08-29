import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'

// Suppress specific MUI Grid deprecation warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && (
    message.includes('MUI Grid: The `item` prop has been removed') ||
    message.includes('MUI Grid: The `xs` prop has been removed') ||
    message.includes('MUI Grid: The `sm` prop has been removed') ||
    message.includes('MUI Grid: The `md` prop has been removed') ||
    message.includes('MUI Grid: The `lg` prop has been removed') ||
    message.includes('MUI Grid: The `xl` prop has been removed')
  )) {
    return; // Suppress these specific warnings
  }
  originalWarn.apply(console, args);
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
