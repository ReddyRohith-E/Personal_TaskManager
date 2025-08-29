import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  Avatar,
  Paper,
  Stack,
  IconButton,
  Divider,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Container,
  Tooltip,
  Collapse,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Badge,
  SecurityRounded,
  AccountCircle,
  Notifications,
  Palette,
  Language,
  Schedule,
  ExpandLess,
  ExpandMore,
  CheckCircle,
  Shield,
  Settings,
  Close,
  Logout,
  Message,
  NotificationImportant,
  VerifiedUser,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';
import { authService } from '../services/authService';
import { 
  LoadingButton, 
  AnimatedCard, 
  UserAvatar,
  GlassContainer,
  GlassButton,
  GlassInput,
} from '../components/UI';

const ProfileCard = ({ title, icon, children, action, collapsible = false }) => {
  const [expanded, setExpanded] = useState(!collapsible);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AnimatedCard
      animation="slideUp"
      sx={{
        height: 'auto',
        borderRadius: '12px', // Reduced from 16px
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        overflow: 'visible', // Ensure content isn't clipped
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(20, 184, 166, 0.25)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
        },
      }}
    >
      <CardContent sx={{ 
        p: { xs: 3, md: 4 }, // Increased padding
        '&:last-child': { pb: { xs: 3, md: 4 } }, // Ensure consistent bottom padding
      }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ mb: collapsible && !expanded ? 0 : 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              {icon}
            </Avatar>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="600">
              {title}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {action}
            {collapsible && (
              <IconButton
                onClick={() => setExpanded(!expanded)}
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Stack>
        </Stack>
        
        <Collapse in={expanded}>
          {expanded && (
            <>
              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
              {children}
            </>
          )}
        </Collapse>
      </CardContent>
    </AnimatedCard>
  );
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    taskReminders: true,
    overdueAlerts: true,
    completionMessages: true,
  });
  const { user, updateUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors }, 
    reset: resetPasswordForm 
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue('firstName', user.profile?.firstName || '');
      setValue('lastName', user.profile?.lastName || '');
      setValue('email', user.email || '');
      
      // Load notification preferences from user profile
      if (user.preferences?.notifications) {
        setNotificationSettings({
          email: user.preferences.notifications.email !== false,
          push: user.preferences.notifications.push !== false,
          taskReminders: user.preferences.notifications.taskReminders !== false,
          overdueAlerts: user.preferences.notifications.overdueAlerts !== false,
          completionMessages: user.preferences.notifications.completionMessages !== false,
        });
      }
    }
  }, [user, setValue]);

  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // Include notification settings in the update
      const updateData = {
        ...data,
        preferences: {
          ...user.preferences,
          notifications: notificationSettings
        }
      };
      
      const response = await authService.updateProfile(updateData);
      updateUser(response.data.user);
      setMessage('Profile updated successfully!');
      setEditingProfile(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      await authService.changePassword(data);
      setMessage('Password changed successfully!');
      resetPasswordForm();
      setShowPasswordDialog(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setShowLogoutDialog(false);
      // Navigation will be handled by the AuthContext
    } catch (err) {
      setError('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    reset({
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
    });
    // Reset notification settings
    if (user.preferences?.notifications) {
      setNotificationSettings({
        email: user.preferences.notifications.email !== false,
        push: user.preferences.notifications.push !== false,
        taskReminders: user.preferences.notifications.taskReminders !== false,
        overdueAlerts: user.preferences.notifications.overdueAlerts !== false,
        completionMessages: user.preferences.notifications.completionMessages !== false,
      });
    }
  };

  const handleNotificationChange = (setting) => (event) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const getUserStats = () => {
    const joinDate = new Date(user?.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const lastLogin = user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'Never';
    
    return { joinDate, lastLogin };
  };

  const stats = getUserStats();

  const PreferenceItem = ({ icon, title, description, action, color = 'primary' }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { xs: 3, md: 3.5 }, // Increased padding
        borderRadius: '10px', // Reduced border radius
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.12)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(14, 165, 233, 0.04) 100%)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{ 
            bgcolor: `${color}.main`, 
            width: { xs: 42, md: 44 }, // Slightly larger
            height: { xs: 42, md: 44 },
            borderRadius: '10px', // Less rounded
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            '& svg': { fontSize: { xs: 20, md: 22 } }
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="600">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Stack>
      {action}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Fade in={true} timeout={600}>
        <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"}
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
            Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>
      </Fade>

      {/* Alert Messages */}
      <Fade in={!!(message || error)} timeout={300}>
        <Box sx={{ mb: 3 }}>
          {message && (
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 3,
                mb: 2,
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                }
              }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          )}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 3,
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Profile Overview Card */}
      <Fade in={true} timeout={800}>
        <AnimatedCard
          variant="glass"
          animation="slideUp"
          sx={{
            p: { xs: 4, md: 5 }, // Increased padding
            mb: 4,
            borderRadius: '16px', // Slightly reduced
            background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(20, 184, 166, 0.3)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <UserAvatar 
                user={user} 
                size={isMobile ? 100 : 120} 
                showStatus 
                status="online"
                sx={{
                  border: '4px solid rgba(255,255,255,0.3)',
                  mx: { xs: 'auto', md: 0 },
                  mb: { xs: 2, md: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
                {user?.profile?.firstName} {user?.profile?.lastName}
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} sx={{ opacity: 0.9, mb: 2 }}>
                {user?.email}
              </Typography>
              <Stack 
                direction={isMobile ? "column" : "row"}
                spacing={1} 
                alignItems={isMobile ? "center" : "flex-start"}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Chip 
                  label={`Member since ${stats.joinDate}`}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 600,
                  }} 
                />
                <Chip 
                  label={`Last login: ${stats.lastLogin}`}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 600,
                  }} 
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <LoadingButton
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditingProfile(true)}
                loading={editingProfile}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  },
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                }}
              >
                Edit Profile
              </LoadingButton>
            </Grid>
          </Grid>
          
          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 160,
              height: 160,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          />
        </AnimatedCard>
      </Fade>

      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12} lg={8}>
          <ProfileCard
            title="Personal Information"
            icon={<AccountCircle />}
            action={
              editingProfile && (
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Cancel">
                    <IconButton
                      onClick={handleCancelEdit}
                      size="small"
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save Changes">
                    <span>
                      <LoadingButton
                        onClick={handleSubmit(onSubmitProfile)}
                        size="small"
                        loading={loading}
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'success.dark' },
                          minWidth: 'auto',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <Save />
                      </LoadingButton>
                    </span>
                  </Tooltip>
                </Stack>
              )
            }
          >
            <Box component="form" onSubmit={handleSubmit(onSubmitProfile)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <GlassInput
                    fullWidth
                    label="First Name"
                    disabled={!editingProfile}
                    startIcon={<Person sx={{ color: 'text.secondary' }} />}
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
                    disabled={!editingProfile}
                    startIcon={<Person sx={{ color: 'text.secondary' }} />}
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
                    disabled={!editingProfile}
                    startIcon={<Email sx={{ color: 'text.secondary' }} />}
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

                {/* Notification Preferences Section */}
                {editingProfile && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                      Notification Preferences
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.email}
                              onChange={handleNotificationChange('email')}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">Email Notifications</Typography>
                            </Box>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.push}
                              onChange={handleNotificationChange('push')}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Notifications sx={{ fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">Push Notifications</Typography>
                            </Box>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.taskReminders}
                              onChange={handleNotificationChange('taskReminders')}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">Task Reminders</Typography>
                            </Box>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.overdueAlerts}
                              onChange={handleNotificationChange('overdueAlerts')}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <NotificationImportant sx={{ fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">Overdue Alerts</Typography>
                            </Box>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.completionMessages}
                              onChange={handleNotificationChange('completionMessages')}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircle sx={{ fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">Completion Messages</Typography>
                            </Box>
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Box>
          </ProfileCard>
        </Grid>

        {/* Security & Settings */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            {/* Security Card */}
            <ProfileCard
              title="Security"
              icon={<SecurityRounded />}
              collapsible={isMobile}
            >
              <Stack spacing={3}>
                <LoadingButton
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setShowPasswordDialog(true)}
                  fullWidth
                  sx={{
                    py: 2, // Increased padding
                    borderRadius: '10px', // Consistent border radius
                    borderWidth: 1.5,
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(14, 165, 233, 0.03) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(20, 184, 166, 0.3)',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 1.5,
                      background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(20, 184, 166, 0.2)',
                    },
                  }}
                >
                  Change Password
                </LoadingButton>

                <GlassButton
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  onClick={() => setShowLogoutDialog(true)}
                  fullWidth
                  sx={{
                    py: 2, // Increased padding
                    borderRadius: '10px', // Consistent border radius
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.25)',
                    },
                  }}
                >
                  Logout
                </GlassButton>
                
                <PreferenceItem
                  icon={<Shield />}
                  title="Account Verified"
                  description="Your account is verified and secure"
                  action={
                    <Chip 
                      label="VERIFIED" 
                      size="small" 
                      color="success"
                      icon={<CheckCircle />}
                      sx={{ fontWeight: 600 }}
                    />
                  }
                  color="success"
                />
              </Stack>
            </ProfileCard>

            {/* Preferences Card */}
            <ProfileCard
              title="Preferences"
              icon={<Settings />}
              collapsible={isMobile}
            >
              <Stack spacing={3}>
                <PreferenceItem
                  icon={<Palette />}
                  title="Theme Mode"
                  description={`${isDarkMode ? 'Dark' : 'Light'} mode is active`}
                  action={
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={toggleTheme}
                      sx={{ borderRadius: 2, minWidth: 80 }}
                    >
                      {isDarkMode ? 'Light' : 'Dark'}
                    </Button>
                  }
                />
                
                <PreferenceItem
                  icon={<Message />}
                  title="Custom Messages"
                  description="Personalized notification messages enabled"
                  action={
                    <Chip 
                      label="ACTIVE" 
                      size="small" 
                      color="info"
                      sx={{ fontWeight: 600 }}
                    />
                  }
                  color="info"
                />
                
                <PreferenceItem
                  icon={<Notifications />}
                  title="Email Notifications"
                  description={notificationSettings.email ? "Enabled" : "Disabled"}
                  action={
                    <Chip 
                      label={notificationSettings.email ? "ON" : "OFF"} 
                      size="small" 
                      color={notificationSettings.email ? "success" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  }
                  color="info"
                />

                <PreferenceItem
                  icon={<NotificationImportant />}
                  title="Push Notifications"
                  description={notificationSettings.push ? "Enabled" : "Disabled"}
                  action={
                    <Chip 
                      label={notificationSettings.push ? "ON" : "OFF"} 
                      size="small" 
                      color={notificationSettings.push ? "success" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  }
                  color="warning"
                />

                <PreferenceItem
                  icon={<VerifiedUser />}
                  title="Security Level"
                  description="Enhanced security with email verification"
                  action={
                    <Chip 
                      label="HIGH" 
                      size="small" 
                      color="success"
                      icon={<Shield />}
                      sx={{ fontWeight: 600 }}
                    />
                  }
                  color="success"
                />

                <PreferenceItem
                  icon={<Language />}
                  title="Language"
                  description="English (US)"
                  action={
                    <Button
                      variant="text"
                      size="small"
                      disabled
                      sx={{ borderRadius: 2 }}
                    >
                      EN
                    </Button>
                  }
                  color="secondary"
                />
              </Stack>
            </ProfileCard>
          </Stack>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog 
        open={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)}
        maxWidth="xs" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px', // Consistent with ProfileCard
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: 'error.main',
                width: 40,
                height: 40,
              }}
            >
              <Logout />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Confirm Logout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Are you sure you want to logout?
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You will be redirected to the login page and will need to sign in again to access your account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <GlassButton 
            onClick={() => setShowLogoutDialog(false)}
            variant="outlined"
            fullWidth
          >
            Cancel
          </GlassButton>
          <GlassButton
            onClick={handleLogout}
            variant="contained"
            color="error"
            loading={loading}
            startIcon={<Logout />}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
            }}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </GlassButton>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog 
        open={showPasswordDialog} 
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : '12px', // Consistent border radius
            m: isMobile ? 0 : 2,
            background: isMobile ? 
              'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)' :
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(25px)',
            border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.15)',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <SecurityRounded sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="600">
                Change Password
              </Typography>
            </Stack>
            {isMobile && (
              <IconButton 
                onClick={() => setShowPasswordDialog(false)}
                edge="end"
              >
                <Close />
              </IconButton>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <GlassInput
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                {...registerPassword('currentPassword', {
                  required: 'Current password is required'
                })}
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword?.message}
                startIcon={<Lock sx={{ color: 'text.secondary' }} />}
                endIcon={
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
              <GlassInput
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword?.message}
                startIcon={<Lock sx={{ color: 'text.secondary' }} />}
                endIcon={
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <GlassButton 
            onClick={() => {
              setShowPasswordDialog(false);
              resetPasswordForm();
            }}
            variant="outlined"
          >
            Cancel
          </GlassButton>
          <GlassButton
            onClick={handlePasswordSubmit(onSubmitPassword)}
            variant="contained"
            loading={loading}
            startIcon={<Save />}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </GlassButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
