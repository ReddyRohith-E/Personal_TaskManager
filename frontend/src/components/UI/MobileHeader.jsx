import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Stack, 
  useTheme, 
  useMediaQuery,
  Slide,
  useScrollTrigger,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsNone,
  Search,
  MoreVert,
  Settings,
  Help,
  Logout,
  Person,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../theme/ThemeContext';
import { UserAvatar } from './TaskComponents';

const HideOnScroll = ({ children, window }) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const MobileHeader = ({ 
  title, 
  onMenuClick, 
  showSearch = false, 
  onSearchClick,
  hideOnScroll = true,
  transparent = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const headerContent = (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: transparent ? 'rgba(255, 255, 255, 0.9)' : 'background.paper',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        {/* Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ 
            mr: 2,
            p: 1.5,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Search Button */}
          {showSearch && (
            <Tooltip title="Search">
              <IconButton
                color="inherit"
                onClick={onSearchClick}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Search />
              </IconButton>
            </Tooltip>
          )}

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                p: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={{
                p: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          {isMobile ? (
            <Tooltip title="More options">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="User menu">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <UserAvatar user={user} size={40} showStatus />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <UserAvatar user={user} size={40} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Help fontSize="small" />
            </ListItemIcon>
            <ListItemText>Help & Support</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 300,
              maxWidth: 400,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <MenuItem>
              <Box>
                <Typography variant="subtitle2">
                  Task "Complete project" is due soon
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Typography variant="subtitle2">
                  New task assigned to you
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  1 day ago
                </Typography>
              </Box>
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );

  return hideOnScroll ? (
    <HideOnScroll>
      {headerContent}
    </HideOnScroll>
  ) : headerContent;
};

export default MobileHeader;
