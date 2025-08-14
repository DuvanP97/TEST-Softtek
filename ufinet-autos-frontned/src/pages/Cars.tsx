import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid as Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import client from '../api/client'
import type { Car } from '../api/types'

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Car>({ brand:'', model:'', year:2024, plateNumber:'', color:'' })

  async function load() {
    const { data } = await client.get('/api/cars')
    setCars(data)
  }
  useEffect(() => { load().catch(()=>setCars([])) }, [])

  async function createCar() {
    try {
      await client.post('/api/cars', form)
      setOpen(false)
      await load()
    } catch (e) {
      // manejar errores del backend
    }
  }

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Autos</Typography>
        <Button variant="contained" onClick={()=>setOpen(true)}>Agregar</Button>
      </Stack>

      <Grid container spacing={2}>
        {cars.length === 0 ? (
          <Grid size={12}>
            <Paper sx={{ p:2 }}>
              <Typography color="text.secondary">No hay autos (o API sin implementar).</Typography>
            </Paper>
          </Grid>
        ) : cars.map((c) => (
          <Grid key={`${c.plateNumber}-${c.model}`} size={{ xs:12, sm:6, md:4 }}>
            <Paper sx={{ p:2 }}>
              <Typography fontWeight={600}>{c.brand} {c.model}</Typography>
              <Typography variant="body2" color="text.secondary">Año: {c.year}</Typography>
              <Typography variant="body2" color="text.secondary">Placa: {c.plateNumber}</Typography>
              <Typography variant="body2" color="text.secondary">Color: {c.color}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar auto</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Marca" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} />
            <TextField label="Modelo" value={form.model} onChange={e=>setForm({...form, model:e.target.value})} />
            <TextField label="Año" type="number" value={form.year} onChange={e=>setForm({...form, year:Number(e.target.value)})} />
            <TextField label="Placa" value={form.plateNumber} onChange={e=>setForm({...form, plateNumber:e.target.value})} />
            <TextField label="Color" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createCar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}