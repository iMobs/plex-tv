import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f4245',
      light: '#505256',
      dark: '#000002',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e5a00d',
      light: '#ffd14c',
      dark: '#ae7200',
      contrastText: '#000000',
    },
  },
});

export default theme;
