/**
 * Main App Component
 * Root component with routing and layout
 */

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import RecommendationsPage from './pages/RecommendationsPage';
import PreferencesPage from './pages/PreferencesPage';
import DishesPage from './pages/DishesPage';
import Footer from './components/Footer';

// Context
import { AppProvider } from './context/AppContext';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35',
      light: '#ff8c5f',
      dark: '#e55a2b',
    },
    secondary: {
      main: '#f7931e',
      light: '#f9a74a',
      dark: '#dc8419',
    },
    success: {
      main: '#2ecc71',
    },
    warning: {
      main: '#f39c12',
    },
    error: {
      main: '#e74c3c',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/dishes" element={<DishesPage />} />
            </Routes>
          </Container>
          <Footer />
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

