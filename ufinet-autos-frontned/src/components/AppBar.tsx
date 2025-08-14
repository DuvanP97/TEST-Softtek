import { AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';

export default function AppBar() {
  return (
    <MuiAppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ufinet Autos
        </Typography>
      </Toolbar>
    </MuiAppBar>
  )
}