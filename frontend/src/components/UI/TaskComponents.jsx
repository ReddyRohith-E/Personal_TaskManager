import { Badge, Chip, Avatar, Box, Typography, Stack, useTheme } from '@mui/material';
import {
  Flag,
  CheckCircle,
  Schedule,
  PlayArrow,
  Pause,
  Cancel,
  Warning,
  Star,
} from '@mui/icons-material';

export const PriorityChip = ({ priority, size = 'small' }) => {
  const theme = useTheme();
  
  const getPriorityConfig = () => {
    switch (priority) {
      case 'low':
        return {
          label: 'Low',
          color: theme.palette.success.main,
          icon: <Flag fontSize="small" />,
          bgcolor: `${theme.palette.success.main}20`,
        };
      case 'medium':
        return {
          label: 'Medium',
          color: theme.palette.warning.main,
          icon: <Flag fontSize="small" />,
          bgcolor: `${theme.palette.warning.main}20`,
        };
      case 'high':
        return {
          label: 'High',
          color: theme.palette.error.main,
          icon: <Flag fontSize="small" />,
          bgcolor: `${theme.palette.error.main}20`,
        };
      case 'urgent':
        return {
          label: 'Urgent',
          color: theme.palette.error.dark,
          icon: <Star fontSize="small" />,
          bgcolor: `${theme.palette.error.dark}20`,
        };
      default:
        return {
          label: 'Normal',
          color: theme.palette.grey[500],
          icon: <Flag fontSize="small" />,
          bgcolor: `${theme.palette.grey[500]}20`,
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <Chip
      size={size}
      icon={config.icon}
      label={config.label}
      sx={{
        color: config.color,
        bgcolor: config.bgcolor,
        border: `1px solid ${config.color}30`,
        fontWeight: 600,
        '&:hover': {
          bgcolor: config.color,
          color: 'white',
        },
      }}
    />
  );
};

export const StatusChip = ({ status, size = 'small' }) => {
  const theme = useTheme();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          color: theme.palette.success.main,
          icon: <CheckCircle fontSize="small" />,
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: theme.palette.warning.main,
          icon: <PlayArrow fontSize="small" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: theme.palette.error.main,
          icon: <Cancel fontSize="small" />,
        };
      case 'pending':
      default:
        return {
          label: 'Pending',
          color: theme.palette.info.main,
          icon: <Schedule fontSize="small" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      size={size}
      icon={config.icon}
      label={config.label}
      sx={{
        bgcolor: config.color,
        color: 'white',
        fontWeight: 600,
        '&:hover': {
          bgcolor: config.color,
          filter: 'brightness(0.9)',
        },
      }}
    />
  );
};

export const UserAvatar = ({ user, size = 48, showStatus = false, status = 'online' }) => {
  const getInitials = () => {
    if (user?.profile?.firstName && user?.profile?.lastName) {
      return `${user.profile.firstName.charAt(0)}${user.profile.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'success.main';
      case 'busy':
        return 'warning.main';
      case 'away':
        return 'warning.light';
      case 'offline':
      default:
        return 'grey.500';
    }
  };

  return (
    <Box position="relative">
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: 'primary.main',
          fontSize: size > 40 ? '1.2rem' : '0.9rem',
          fontWeight: 'bold',
        }}
      >
        {getInitials()}
      </Avatar>
      {showStatus && (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: getStatusColor(),
              width: size > 40 ? 12 : 8,
              height: size > 40 ? 12 : 8,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'background.paper',
            },
          }}
        />
      )}
    </Box>
  );
};

export const TaskCountBadge = ({ count, variant = 'standard', color = 'primary' }) => {
  if (count === 0) return null;

  return (
    <Badge
      badgeContent={count > 99 ? '99+' : count}
      color={color}
      variant={variant}
      sx={{
        '& .MuiBadge-badge': {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      }}
    />
  );
};

export const OverdueIndicator = ({ isOverdue, timeRemaining }) => {
  if (!isOverdue && (!timeRemaining || timeRemaining > 24)) return null;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Warning 
        fontSize="small" 
        sx={{ 
          color: isOverdue ? 'error.main' : 'warning.main',
          animation: isOverdue ? 'pulse 2s infinite' : 'none',
        }} 
      />
      <Typography 
        variant="caption" 
        sx={{ 
          color: isOverdue ? 'error.main' : 'warning.main',
          fontWeight: 600,
        }}
      >
        {isOverdue ? 'Overdue' : `${Math.floor(timeRemaining)}h remaining`}
      </Typography>
    </Stack>
  );
};

export default {
  PriorityChip,
  StatusChip,
  UserAvatar,
  TaskCountBadge,
  OverdueIndicator,
};
