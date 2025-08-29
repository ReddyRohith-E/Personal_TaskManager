// Enhanced UI Components for TaskFlow
export { default as LoadingButton } from './LoadingButton';
export { default as SkeletonCard } from './SkeletonCard';
export { default as AnimatedCard } from './AnimatedCard';
export { default as MobileHeader } from './MobileHeader';

// Glass morphism UI components
export { default as GlassContainer } from './GlassContainer';
export { default as GlassButton } from './GlassButton';
export { default as GlassInput } from './GlassInput';
export { default as AnimatedButton } from './AnimatedButton';
export { 
  NotificationProvider, 
  useNotification, 
  NotificationToast 
} from './NotificationSystem';
export {
  PriorityChip,
  StatusChip,
  UserAvatar,
  TaskCountBadge,
  OverdueIndicator,
} from './TaskComponents';

// Task Type and Message components
export { TaskTypeChip, TASK_TYPES, getTaskTypeInfo } from './TaskTypeChip';
export { default as MessagePreview } from './MessagePreview';

// Component variants and utilities
export const glassVariants = {
  default: 'default',
  dark: 'dark',
  light: 'light',
  accent: 'accent',
  card: 'card',
};

export const buttonVariants = {
  primary: 'primary',
  secondary: 'secondary',
  glass: 'glass',
  outlined: 'outlined',
};

export const inputVariants = {
  default: 'default',
  glassLight: 'glass-light',
  glassDark: 'glass-dark',
};

// Re-export common MUI components with custom styling
export { 
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Grid,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Fab,
  Paper,
  Container,
} from '@mui/material';
