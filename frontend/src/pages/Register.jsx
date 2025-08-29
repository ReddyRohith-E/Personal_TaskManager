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
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  TaskAltRounded,
  Email,
  Person,
  Lock,
  AdminPanelSettings,
  Support,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { GlassInput, GlassButton } from '../components/UI';

const Register = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setError('');
      const { confirmPassword, ...userData } = data;
      
      // Combine first and last name for the backend
      const registrationData = {
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      };
      
      await registerUser(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      <Container component="main" maxWidth="md">
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)',
                }}
              >
                <TaskAltRounded sx={{ fontSize: 40, color: 'white' }} />
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
                }}
              >
                TaskFlow
              </Typography>
              
              <Typography variant="h5" color="text.primary" fontWeight="600" gutterBottom>
                Create Your Account
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                Join thousands of users who trust TaskFlow for their productivity
              </Typography>
            </Box>
            
            <Fade in={!!error} timeout={300}>
              <Box sx={{ mb: 2 }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        alignItems: 'center',
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            </Fade>
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <GlassInput
                    fullWidth
                    label="First Name"
                    autoFocus
                    variant="default"
                    startIcon={<Person sx={{ color: 'rgba(148, 163, 184, 0.8)' }} />}
                    {...register('firstName', {
                      required: 'First name is required'
                    })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <GlassInput
                    fullWidth
                    label="Last Name"
                    variant="default"
                    startIcon={<Person sx={{ color: 'rgba(148, 163, 184, 0.8)' }} />}
                    {...register('lastName', {
                      required: 'Last name is required'
                    })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <GlassInput
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    variant="default"
                    startIcon={<Email sx={{ color: 'rgba(148, 163, 184, 0.8)' }} />}
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
                </Grid>
                
                {/* Email Notification Notice */}
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      mt: 2, 
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Email sx={{ color: 'info.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="info.main" fontWeight="600">
                            � Email Notifications Enabled
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Email notifications are automatically enabled for all users. You'll receive beautiful, detailed email reminders for your tasks.
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <GlassInput
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    variant="default"
                    startIcon={<Lock sx={{ color: 'rgba(148, 163, 184, 0.8)' }} />}
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
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <GlassInput
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    variant="default"
                    startIcon={<Lock sx={{ color: 'rgba(148, 163, 184, 0.8)' }} />}
                    endIcon={
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        sx={{ color: 'rgba(148, 163, 184, 0.8)' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    }
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                </Grid>
              </Grid>
              
              {/* Admin Contact Information */}
              <Card 
                sx={{ 
                  mt: 3, 
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <AdminPanelSettings sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" color="primary.main" fontWeight="600">
                      Admin Contact Information
                    </Typography>
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    For technical support and assistance with your account, contact our admin team:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            err2k24@gmail.com
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Support sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Support
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            err2k24@gmail.com
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Support Hours
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            Mon-Fri 9AM-5PM IST
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip 
                      label="� Email Support" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label="🔧 Technical Support" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label="⚙️ Account Configuration" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
              
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </GlassButton>
              
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Already have an account?{' '}
                  <Link 
                    to="/login"
                    style={{
                      color: '#14b8a6',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
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

export default Register;
