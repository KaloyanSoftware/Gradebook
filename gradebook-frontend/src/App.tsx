import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRoutes } from './router'
import muiTheme from './theme/muiTheme'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
