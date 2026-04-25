// ================================================================
// MUI THEME — keep colors in sync with src/styles/_variables.scss
// ================================================================
import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
    },
    success: {
      main: '#16A34A',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
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
        },
      },
    },
  },
})

export default muiTheme
