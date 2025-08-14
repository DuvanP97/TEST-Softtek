import { useState } from 'react'
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: reemplazar por:
      // const { data } = await client.post('/api/auth/login', { email, password })
      // localStorage.setItem('token', data.token)
      localStorage.setItem('token', 'dev-token')
      navigate('/cars')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box display="grid" sx={{ placeItems: 'center', minHeight: '100vh', p: 2 }}>
      <Card sx={{ width: 360, p: 1 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}