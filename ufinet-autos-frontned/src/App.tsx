import { CssBaseline, Container, ThemeProvider } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import theme from './theme'
import Login from './pages/Login'
import Cars from './pages/Cars'
import SignUp from './pages/SingUp'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cars" element={<RequireAuth><Cars /></RequireAuth>} />
          <Route path="/" element={localStorage.getItem('token') ? <Navigate to="/cars" /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}