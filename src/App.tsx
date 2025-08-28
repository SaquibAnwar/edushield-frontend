import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            EduShield Frontend
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary">
            Educational Management System
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Project foundation setup complete! ✅
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
