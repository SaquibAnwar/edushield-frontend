import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/Admin';
import { StudentDashboard } from './pages/Student';
import { ParentDashboard } from './pages/Parent';
import { FacultyDashboard } from './pages/Faculty';
import { UserRole } from './types/auth';


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
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  console.log('App component rendering with routing...');
  console.log('Current URL:', window.location.pathname);
  
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={[UserRole.Admin]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/student" 
              element={
                <ProtectedRoute requiredRoles={[UserRole.Student]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/parent" 
              element={
                <ProtectedRoute requiredRoles={[UserRole.Parent]}>
                  <ParentDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/faculty" 
              element={
                <ProtectedRoute requiredRoles={[UserRole.Faculty]}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Test Route */}
            <Route 
              path="/test" 
              element={
                <div style={{ padding: '20px' }}>
                  <h1>Test Route Works!</h1>
                  <p>If you can see this, routing is working.</p>
                  <button onClick={() => window.history.back()}>Go Back</button>
                </div>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
