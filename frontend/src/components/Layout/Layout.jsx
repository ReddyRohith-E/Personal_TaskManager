import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Tooltip,
  Stack,
  Chip,
  Collapse,
  Badge,
  SwipeableDrawer,
  Backdrop,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Person,
  Logout,
  LightMode,
  DarkMode,
  NotificationsNone,
  Close,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../theme/ThemeContext';
import { UserAvatar } from '../UI/TaskComponents';
import MobileHeader from '../UI/MobileHeader';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Auto-collapse on tablet
  useEffect(() => {
    if (isTablet && !isMobile) {
      setCollapsed(true);
    } else if (!isTablet) {
      setCollapsed(false);
    }
  }, [isTablet, isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard', 
      color: 'primary',
      badge: null,
    },
    { 
      text: 'Tasks', 
      icon: <Assignment />, 
      path: '/tasks', 
      color: 'secondary',
      badge: 5, // Example badge count
    },
    { 
      text: 'Profile', 
      icon: <Person />, 
      path: '/profile', 
      color: 'info',
      badge: null,
    },
    {
      text: 'Message Testing',
      icon: <NotificationsNone />,
      path: '/messages',
      color: 'warning',
      badge: null,
    },
  ];

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || user?.email?.charAt(0).toUpperCase();
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.text || 'TaskFlow';
  };

  const drawer = (collapsed) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: collapsed ? 1 : 3, minHeight: 80, display: 'flex', alignItems: 'center' }}>
        {!collapsed ? (
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ 
                background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskFlow
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Productivity Suite
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              T
            </Avatar>
          </Box>
        )}
        
        {!isMobile && (
          <Tooltip title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
            <IconButton
              onClick={handleDrawerCollapse}
              size="small"
              sx={{
                bgcolor: 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              {collapsed ? <ChevronLeft sx={{ transform: 'rotate(180deg)' }} /> : <ChevronLeft />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider />

      {/* User Profile Section */}
      {!collapsed && (
        <>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <UserAvatar user={user} size={48} showStatus status="online" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight="600" noWrap>
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Divider />
        </>
      )}

      {/* Navigation Menu */}
      <List sx={{ flex: 1, py: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <Tooltip
              key={item.text}
              title={collapsed ? item.text : ''}
              placement="right"
              disableHoverListener={!collapsed}
            >
              <ListItem
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  cursor: 'pointer',
                  bgcolor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                  px: collapsed ? 1 : 2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                  minHeight: 48,
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isSelected ? 'primary.contrastText' : `${item.color}.main`,
                    minWidth: collapsed ? 'auto' : 40,
                    justifyContent: 'center',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" variant="dot">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                
                {!collapsed && (
                  <>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '0.9375rem',
                      }}
                    />
                    {isSelected && (
                      <Chip 
                        size="small" 
                        label="Active" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'primary.contrastText',
                          fontSize: '0.7rem',
                          height: 20,
                        }} 
                      />
                    )}
                  </>
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider />
      
      {/* Theme Toggle */}
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        <Tooltip title={collapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              width: '100%',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 0 : 2,
              py: 1,
              borderRadius: 2,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            {isDarkMode ? <LightMode sx={{ mr: collapsed ? 0 : 2 }} /> : <DarkMode sx={{ mr: collapsed ? 0 : 2 }} />}
            {!collapsed && (
              <Typography variant="body2">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawer(collapsed)}
        </Drawer>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          onMenuClick={() => setMobileOpen(true)}
          title={getCurrentPageTitle()}
          user={user}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawer(false)}
        </SwipeableDrawer>
      )}

      {/* Backdrop for mobile drawer */}
      {isMobile && mobileOpen && (
        <Backdrop
          open={mobileOpen}
          onClick={() => setMobileOpen(false)}
          sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: 0 },
          mt: isMobile ? '64px' : 0,
          minHeight: '100vh',
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        <Fade in timeout={300}>
          <Box sx={{ height: '100%', p: { xs: 2, md: 3 } }}>
            <Outlet />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Layout;
