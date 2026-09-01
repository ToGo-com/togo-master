import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

const colors = {
  logoBlue: '#1A2D42',
  logoOrange: '#F49730',
  slatePrimary: '#1E293B',
  mutedSlate: '#64748B',
  borderLight: '#E2E8F0',
  white: '#FFFFFF',
  background: '#f8fbfe',
  graySecondary: '#647b8b',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.logoBlue,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.logoOrange,
      contrastText: colors.white,
    },
    background: {
      default: colors.background,
      paper: colors.white,
    },
    text: {
      primary: colors.slatePrimary,
      secondary: colors.mutedSlate,
    },
    divider: colors.borderLight,
  },
  typography: {
    fontFamily: '"Poppins", "System", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 32,
      fontWeight: 700,
    },
    h2: {
      fontSize: 24,
      fontWeight: 700,
    },
    h3: {
      fontSize: 18,
      fontWeight: 600,
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
    },
    caption: {
      fontSize: 10,
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});
