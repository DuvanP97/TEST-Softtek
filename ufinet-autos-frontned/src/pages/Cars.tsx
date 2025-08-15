import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography, Tooltip, CircularProgress, Alert, Snackbar, Grid, AppBar, Toolbar, Avatar } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Car } from '../api/types'

import { api } from "../lib/api";

function CarCard({ car, onEdit, onDelete }: { car: any, onEdit: (c: any)=>void, onDelete: (c: any)=>void }) {
  return (
    <Paper sx={{ p:2 }}>
      <Box sx={{ width: '100%', height: 180, mb: 2, overflow: 'hidden', borderRadius: 1 }}>
        <img
          src={car.image || 'https://www.elcarrocolombiano.com/wp-content/webp-express/webp-images/uploads/2022/07/20220705-10-CARROS-MAS-BARATOS-DE-COLOMBIA-EN-2022-01.jpg.webp'}
          alt={`${car.brand} ${car.model}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Box>
          <Typography fontWeight={600}>{car.brand} {car.model}</Typography>
          <Typography variant="body2" color="text.secondary">Año: {car.year}</Typography>
          <Typography variant="body2" color="text.secondary">Placa: {car.plateNumber ?? car.plate}</Typography>
          <Typography variant="body2" color="text.secondary">Color: {car.color}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEdit(car)}><EditIcon fontSize="small"/></IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={() => onDelete(car)}><DeleteIcon fontSize="small"/></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Car | null>(null)
  const [form, setForm] = useState<Car>({ brand:'', model:'', year:2024, plateNumber:'', color:'', image: '' })
  const [userName, setUserName] = useState<string>('')

  async function fetchCars() {
    const token = getToken();
    const headers = authHeaders();
    try {
      if (token) {
        const p = JSON.parse(atob(String(token).split('.')[1]));
        console.log('[Cars] usando token de:', p?.sub, p?.userId);
      } else {
        console.log('[Cars] sin token (petición pública)');
      }
    } catch {}

    const { data } = await api.get('/cars', { headers });
    console.log('[Cars] /api/cars response:', data);

    const list = Array.isArray(data) ? data.map((it: any) => ({
      ...it,
      plateNumber: it.plate ?? it.plateNumber,
    })) : [];
    return list;
  }

  async function load() {
    try {
      setLoading(true);
      const data = await fetchCars();
      console.log('[Cars] normalized length:', Array.isArray(data) ? data.length : 'not-array');
      setCars(Array.isArray(data) ? data : []);
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      setError(msg || (status ? `Error ${status}: no se pudo cargar la lista de autos` : 'No se pudo cargar la lista de autos'));
      console.error('[Cars] load error', { status, msg, err: e });
      setCars([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { 
    load(); 
    const token = getToken();
    if (token) {
      try {
        const p = JSON.parse(atob(String(token).split('.')[1]));
        setUserName(p?.sub || '');
      } catch {
        setUserName('');
      }
    }
  }, [])

  function openCreate() {
    setEditing(null)
    setForm({ brand:'', model:'', year:new Date().getFullYear(), plateNumber:'', color:'', image: '' } as Car)
    setOpen(true)
  }
  function openEdit(car: Car) {
    setEditing(car)
    const c: any = car as any;
    setForm({ ...car, plateNumber: (c.plateNumber ?? (c as any).plate), year: car.year, image: c.image || '' } as Car)
    setOpen(true)
  }

  async function saveCar() {
    try {
      if (!form.brand || !form.model || !form.plateNumber || !form.color) {
        setError('Todos los campos son obligatorios');
        return;
      }
      if (!form.year || Number(form.year) < 1900) {
        setError('Año inválido');
        return;
      }

      if ((editing as any)?.id != null) {
        const id = (editing as any).id;
        const payload = { ...form, plate: form.plateNumber } as any;
        delete (payload as any).plateNumber;
        await api.put(`/cars/${id}`, payload, { headers: authHeaders() });
      } else {
        const payload = { ...form, plate: form.plateNumber } as any;
        delete (payload as any).plateNumber;
        await api.post('/cars', payload, { headers: authHeaders() });
      }
      setOpen(false);
      await load();
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
      const ok = window.confirm(`¿Eliminar ${car.brand} ${car.model} - ${(car as any).plateNumber ?? (car as any).plate}?`)
      if (!ok) return
      await api.delete(`/cars/${id}`, { headers: authHeaders() });
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'No se pudo eliminar el auto')
    }
  }

  function onLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  const emptyState = useMemo(() => !loading && cars.length === 0, [loading, cars])

  return (
    <>
      <AppBar position="fixed" sx={{ width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt="Logo" src="https://via.placeholder.com/40" />
            <Typography variant="body1" component="div" sx={{ textAlign: 'right' }}>
              {userName}
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" onClick={onLogout}>Cerrar sesión</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <br /><br /><br /><br />
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
              <Grid item key={(c as any).id ?? `${c.plateNumber}-${c.model}`} xs={12} sm={6} md={4}>
                <CarCard car={c} onEdit={openEdit} onDelete={deleteCar} />
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
              <TextField label="Año" type="number" value={form.year} onChange={e=>setForm({...form, year:Number(e.target.value)})} disabled={!!editing} />
              <TextField label="Placa" value={form.plateNumber} onChange={e=>setForm({...form, plateNumber:e.target.value})} disabled={!!editing} />
              <TextField label="Color" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} />
              <TextField label="Imagen (URL)" value={form.image || ''} onChange={e=>setForm({...form, image:e.target.value})} />
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

        {/* DEBUG: quita esto en producción */}
        <Box mt={2} sx={{ display: cars.length === 0 ? 'block' : 'none' }}>
          <Typography variant="caption" color="text.secondary">Debug: cars vacíos. Revisa la consola para ver la respuesta cruda de /api/cars.</Typography>
        </Box>
      </Box>
    </>
  )
}