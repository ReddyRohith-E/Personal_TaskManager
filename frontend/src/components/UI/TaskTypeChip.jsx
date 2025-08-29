import { Chip } from '@mui/material';

// Task type configurations
export const TASK_TYPES = {
  work: { icon: '💼', label: 'Work', color: '#3b82f6', description: 'Professional tasks and deadlines' },
  personal: { icon: '🏠', label: 'Personal', color: '#10b981', description: 'Personal goals and home tasks' },
  health: { icon: '🏥', label: 'Health', color: '#ef4444', description: 'Medical and wellness tasks' },
  finance: { icon: '💰', label: 'Finance', color: '#f59e0b', description: 'Bills and financial planning' },
  education: { icon: '📚', label: 'Education', color: '#8b5cf6', description: 'Learning and study tasks' },
  shopping: { icon: '🛒', label: 'Shopping', color: '#06b6d4', description: 'Shopping lists and purchases' },
  meeting: { icon: '🤝', label: 'Meeting', color: '#ec4899', description: 'Meetings and conferences' },
  deadline: { icon: '⏰', label: 'Deadline', color: '#ef4444', description: 'Critical time-sensitive tasks' },
  appointment: { icon: '📅', label: 'Appointment', color: '#6366f1', description: 'Scheduled appointments' },
  project: { icon: '📋', label: 'Project', color: '#14b8a6', description: 'Project milestones and deliverables' },
  exercise: { icon: '💪', label: 'Exercise', color: '#22c55e', description: 'Fitness and workout tasks' },
  social: { icon: '👥', label: 'Social', color: '#f97316', description: 'Social events and gatherings' },
  travel: { icon: '✈️', label: 'Travel', color: '#0ea5e9', description: 'Travel planning and trips' },
  maintenance: { icon: '🔧', label: 'Maintenance', color: '#84cc16', description: 'Maintenance and repairs' },
  other: { icon: '📝', label: 'Other', color: '#6b7280', description: 'General tasks' }
};

export const TaskTypeChip = ({ taskType, size = 'small', variant = 'filled', ...props }) => {
  const typeInfo = TASK_TYPES[taskType] || TASK_TYPES.other;

  if (variant === 'minimal') {
    return (
      <span 
        style={{ 
          fontSize: size === 'small' ? '16px' : '20px',
          marginRight: '4px',
          ...props.style
        }}
        {...props}
      >
        {typeInfo.icon}
      </span>
    );
  }

  return (
    <Chip
      icon={<span style={{ fontSize: size === 'small' ? '14px' : '16px' }}>{typeInfo.icon}</span>}
      label={typeInfo.label}
      size={size}
      sx={{
        background: variant === 'filled' 
          ? `${typeInfo.color}20` 
          : 'transparent',
        color: typeInfo.color,
        border: `1px solid ${typeInfo.color}40`,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
        '& .MuiChip-icon': {
          fontSize: `${size === 'small' ? '14px' : '16px'} !important`,
          marginLeft: '6px',
        },
        '&:hover': {
          background: `${typeInfo.color}30`,
          borderColor: `${typeInfo.color}60`,
        },
        ...props.sx
      }}
      {...props}
    />
  );
};

export const getTaskTypeInfo = (taskType) => {
  return TASK_TYPES[taskType] || TASK_TYPES.other;
};
