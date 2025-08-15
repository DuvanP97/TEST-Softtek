import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography, Tooltip, CircularProgress, Alert, Snackbar } from '@mui/material'
import { Grid as Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import client from '../api/client'
import type { Car } from '../api/types'

// Nota: asumo que Car tiene opcionalmente `id` (number | string).
// Campos mínimos usados: brand, model, year, plateNumber, color, id?

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Car | null>(null)
  const [form, setForm] = useState<Car>({ brand:'', model:'', year:2024, plateNumber:'', color:'' })

  async function load() {
    try {
      setLoading(true)
      const { data } = await client.get('/api/cars')
      setCars(data ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'No se pudo cargar la lista de autos')
      setCars([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm({ brand:'', model:'', year:new Date().getFullYear(), plateNumber:'', color:'' } as Car)
    setOpen(true)
  }
  function openEdit(car: Car) {
    setEditing(car)
    setForm({ ...car })
    setOpen(true)
  }

  async function saveCar() {
    try {
      // validaciones simples
      if (!form.brand || !form.model || !form.plateNumber || !form.color) {
        setError('Todos los campos son obligatorios')
        return
      }
      if (!form.year || Number(form.year) < 1900) {
        setError('Año inválido')
        return
      }

      if ((editing as any)?.id != null) {
        const id = (editing as any).id
        await client.put(`/api/cars/${id}`,[
          form
        ][0])
      } else {
        await client.post('/api/cars', form)
      }
      setOpen(false)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'No se pudo guardar el auto')
    }
  }

  async function deleteCar(car: Car) {
    try {
      const id = (car as any).id
      if (id == null) {
        setError('No encuentro el id del auto. Asegúrate que el backend incluya `id` en la respuesta de /api/cars.')
        return
      }
      const ok = window.confirm(`¿Eliminar ${car.brand} ${car.model} - ${car.plateNumber}?`)
      if (!ok) return
      await client.delete(`/api/cars/${id}`)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'No se pudo eliminar el auto')
    }
  }

  const emptyState = useMemo(() => !loading && cars.length === 0, [loading, cars])

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Autos</Typography>
        <Button variant="contained" onClick={openCreate}>Agregar</Button>
      </Stack>

      {loading && (
        <Stack alignItems="center" my={4}>
          <CircularProgress />
        </Stack>
      )}

      {emptyState && (
        <Paper sx={{ p:2 }}>
          <Typography color="text.secondary">No hay autos. Crea el primero con el botón "Agregar".</Typography>
        </Paper>
      )}

      {!loading && cars.length > 0 && (
        <Grid container spacing={2}>
          {cars.map((c) => (
            <Grid key={(c as any).id ?? `${c.plateNumber}-${c.model}`} size={{ xs:12, sm:6, md:4 }}>
              <Paper sx={{ p:2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography fontWeight={600}>{c.brand} {c.model}</Typography>
                    <Typography variant="body2" color="text.secondary">Año: {c.year}</Typography>
                    <Typography variant="body2" color="text.secondary">Placa: {c.plateNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">Color: {c.color}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => openEdit(c)}><EditIcon fontSize="small"/></IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => deleteCar(c)}><DeleteIcon fontSize="small"/></IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar auto' : 'Agregar auto'}</DialogTitle>
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
          <Button variant="contained" onClick={saveCar}>{editing ? 'Guardar cambios' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}