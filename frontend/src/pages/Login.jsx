import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  InputAdornment,
  Fade,
  Slide,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  LoginRounded,
  TaskAltRounded,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';
import { GlassInput, GlassButton } from '../components/UI';

const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { toggleTheme, isDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(45, 212, 191, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <Container component="main" maxWidth="sm">
        <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={600}>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              background: 'rgba(30, 41, 59, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: 'inherit',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
              <Box
                sx={{
                  width: { xs: 70, sm: 80 },
                  height: { xs: 70, sm: 80 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(45deg, #14b8a6, #0ea5e9, #2dd4bf)',
                    borderRadius: 'inherit',
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(4px)',
                  },
                }}
              >
                <TaskAltRounded sx={{ fontSize: { xs: 36, sm: 40 }, color: 'white' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{ 
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '3rem' },
                }}
              >
                TaskFlow
              </Typography>
              
              <Typography 
                variant="h5" 
                color="text.primary" 
                fontWeight="600" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                Welcome Back
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Sign in to your account to continue your productivity journey
              </Typography>
            </Box>
            
            <Fade in={!!error} timeout={300}>
              <Box sx={{ mb: 2 }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 3,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      backdropFilter: 'blur(10px)',
                      '& .MuiAlert-icon': {
                        alignItems: 'center',
                      },
                      '& .MuiAlert-message': {
                        color: '#fecaca',
                        fontWeight: 500,
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            </Fade>
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ position: 'relative', zIndex: 2 }}>
              <Stack spacing={3}>
                <GlassInput
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  variant="default"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                
                <GlassInput
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  variant="default"
                  endIcon={
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(148, 163, 184, 0.8)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
              </Stack>
              
              <GlassButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={loading}
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </GlassButton>
              
              <Box textAlign="center">
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  }}
                >
                  Don't have an account?{' '}
                  <Link 
                    to="/register"
                    style={{
                      color: '#14b8a6',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2dd4bf'}
                    onMouseLeave={(e) => e.target.style.color = '#14b8a6'}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default Login;
