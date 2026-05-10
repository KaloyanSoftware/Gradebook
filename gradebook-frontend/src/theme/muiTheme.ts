// ================================================================
// MUI THEME — Princeps brand
// Keep colors in sync with src/styles/_variables.scss
// ================================================================
import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C9A24E',       // gold
      light: '#E8D29A',      // gold-soft
      dark: '#A8842F',       // gold-deep
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F1E7DA',    // bg-page
      paper: '#FFFFFF',      // bg-paper
    },
    error: {
      main: '#B23A2A',       // grade-2 red
    },
    success: {
      main: '#4E6B3A',       // grade-6 green
    },
    text: {
      primary: '#2A2520',    // ink
      secondary: '#5C5046',  // ink-soft
    },
    divider: '#E2D3C0',      // line
  },
  typography: {
    fontFamily: "'Manrope', 'Helvetica Neue', system-ui, sans-serif",
    h1: { fontFamily: "'Cormorant Garamond', Georgia, serif" },
    h2: { fontFamily: "'Cormorant Garamond', Georgia, serif" },
    h3: { fontFamily: "'Cormorant Garamond', Georgia, serif" },
    h4: { fontFamily: "'Cormorant Garamond', Georgia, serif" },
    h5: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 },
    h6: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase' as const,
          fontWeight: 700,
          letterSpacing: '0.12em',
          fontSize: '11px',
          fontFamily: "'Manrope', 'Helvetica Neue', system-ui, sans-serif",
        },
        containedPrimary: {
          background: '#2A2520',
          color: '#F8F2EA',
          borderColor: '#2A2520',
          '&:hover': {
            background: '#3d3530',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '& fieldset': {
            borderColor: '#E2D3C0',
          },
          '&:hover fieldset': {
            borderColor: '#C7B49C',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2A2520',
            boxShadow: '0 0 0 3px rgba(201,162,78,.20)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          color: '#5C5046',
          '&.Mui-focused': {
            color: '#2A2520',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
  },
})

export default muiTheme
