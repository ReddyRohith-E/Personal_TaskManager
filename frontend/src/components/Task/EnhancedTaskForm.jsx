import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon,
  Email as EmailIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TaskTypeChip } from '../UI/TaskTypeChip';

const TASK_TYPES = [
  'work', 'personal', 'health', 'finance', 'education',
  'shopping', 'meeting', 'deadline', 'appointment',
  'project', 'exercise', 'social', 'travel', 'maintenance', 'other'
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'info' },
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'urgent', label: 'Urgent', color: 'error' }
];

const EnhancedTaskForm = ({ open, onClose, onSubmit, task = null, isEditing = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    dueTime: null,
    reminderTime: null,
    priority: 'medium',
    type: 'other',
    tags: [],
    reminders: [],
    customNotifications: {
      email: {
        enabled: true,
        subject: '',
        body: ''
      },
      custom: {
        enabled: true,
        reminderMessage: '',
        overdueMessage: '',
        completionMessage: ''
      }
    }
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentReminder, setCurrentReminder] = useState({
    time: null,
    message: {
      custom: '',
      email: {
        subject: '',
        body: ''
      }
    }
  });
  const [errors, setErrors] = useState({});
  const [previewMessage, setPreviewMessage] = useState('');

  // Helper function to combine date and time
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  // Helper function to check if a date/time is in the past
  const isPastDateTime = (dateTime) => {
    if (!dateTime) return false;
    return new Date(dateTime) < new Date();
  };

  // Helper function to get combined due date/time
  const getCombinedDueDateTime = () => {
    return combineDateTime(formData.dueDate, formData.dueTime);
  };

  useEffect(() => {
    const defaultCustomNotifications = {
      email: { enabled: true, subject: '', body: '' },
      custom: { enabled: true, reminderMessage: '', overdueMessage: '', completionMessage: '' }
    };

    if (task && isEditing) {
      const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
      setFormData({
        ...task,
        dueDate: dueDateObj,
        dueTime: dueDateObj,
        reminderTime: task.reminderTime ? new Date(task.reminderTime) : null,
        reminders: task.reminders || [],
        customNotifications: {
          email: {
            ...defaultCustomNotifications.email,
            ...(task.customNotifications?.email || {})
          },
          custom: {
            ...defaultCustomNotifications.custom,
            ...(task.customNotifications?.custom || {})
          }
        }
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: null,
        dueTime: null,
        reminderTime: null,
        priority: 'medium',
        type: 'other',
        tags: [],
        reminders: [],
        customNotifications: defaultCustomNotifications
      });
    }
  }, [task, isEditing, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCustomNotificationChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      customNotifications: {
        ...prev.customNotifications,
        [type]: {
          ...(prev.customNotifications?.[type] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleAddReminder = () => {
    if (currentReminder.time) {
      // Check if reminder time is in the past
      if (isPastDateTime(currentReminder.time)) {
        setErrors(prev => ({
          ...prev,
          currentReminderTime: 'Cannot set reminder for past time'
        }));
        return;
      }

      const combinedDueDateTime = getCombinedDueDateTime();
      if (combinedDueDateTime && new Date(currentReminder.time) >= combinedDueDateTime) {
        setErrors(prev => ({
          ...prev,
          currentReminderTime: 'Reminder time must be before due date and time'
        }));
        return;
      }

      const newReminder = {
        ...currentReminder,
        id: Date.now().toString()
      };

      setFormData(prev => ({
        ...prev,
        reminders: [...prev.reminders, newReminder]
      }));

      setCurrentReminder({
        time: null,
        message: {
          custom: '',
          email: { subject: '', body: '' }
        }
      });

      // Clear any existing errors
      setErrors(prev => ({
        ...prev,
        currentReminderTime: ''
      }));
    }
  };

  const handleDeleteReminder = (reminderId) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(reminder => reminder.id !== reminderId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const combinedDueDateTime = getCombinedDueDateTime();
    if (!formData.dueDate || !formData.dueTime) {
      newErrors.dueDateTime = 'Both due date and time are required';
    } else if (isPastDateTime(combinedDueDateTime)) {
      newErrors.dueDateTime = 'Cannot set due date and time in the past';
    }

    if (formData.reminderTime && combinedDueDateTime && 
        new Date(formData.reminderTime) >= combinedDueDateTime) {
      newErrors.reminderTime = 'Reminder time must be before due date and time';
    }

    // Validate email subject length
    if (formData.customNotifications.email.subject && 
        formData.customNotifications.email.subject.length > 100) {
      newErrors.emailSubject = 'Email subject must be 100 characters or less';
    }

    // Validate email body length
    if (formData.customNotifications.email.body && 
        formData.customNotifications.email.body.length > 1000) {
      newErrors.emailBody = 'Email body must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const combinedDueDateTime = getCombinedDueDateTime();
      const submitData = {
        ...formData,
        dueDate: combinedDueDateTime ? combinedDueDateTime.toISOString() : null,
        reminderTime: formData.reminderTime ? formData.reminderTime.toISOString() : null,
        reminders: formData.reminders.map(reminder => ({
          ...reminder,
          time: new Date(reminder.time).toISOString()
        }))
      };
      onSubmit(submitData);
    }
  };

  const generatePreview = (type) => {
    // This would typically call an API endpoint to generate preview
    const combinedDueDateTime = getCombinedDueDateTime();
    const mockGenerator = {
      custom: `📋 Reminder: ${formData.title} is due soon! Type: ${formData.type}`,
      email_subject: `⏰ Task Reminder: ${formData.title}`,
      email_body: `Hello!\n\nThis is a reminder for your ${formData.type} task:\n\n"${formData.title}"\n\nDue: ${combinedDueDateTime ? combinedDueDateTime.toLocaleString() : 'No date/time set'}\n\nPriority: ${formData.priority}\n\nDescription: ${formData.description || 'No description'}\n\nBest regards,\nYour Task Manager`
    };
    
    setPreviewMessage(mockGenerator[type] || '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        disableEnforceFocus={false}
        disableAutoFocus={false}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationIcon />
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Task Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    label="Task Type"
                  >
                    {TASK_TYPES.map(type => (
                      <MenuItem key={type} value={type}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TaskTypeChip taskType={type} variant="minimal" />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    label="Priority"
                  >
                    {PRIORITIES.map(priority => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Chip 
                          label={priority.label} 
                          color={priority.color} 
                          size="small" 
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Dates and Times */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Due Date & Time
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(date) => handleChange('dueDate', date)}
                  format="dd-MM-yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDateTime,
                      required: true
                    }
                  }}
                  minDate={new Date()}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Due Time"
                  value={formData.dueTime}
                  onChange={(time) => handleChange('dueTime', time)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDateTime,
                      required: true
                    }
                  }}
                />
              </Grid>
              
              {errors.dueDateTime && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.dueDateTime}
                  </Alert>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Legacy Reminder Time"
                  value={formData.reminderTime}
                  onChange={(date) => handleChange('reminderTime', date)}
                  format="dd-MM-yyyy hh:mm a "
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.reminderTime,
                      helperText: errors.reminderTime || 'Optional: Use multiple reminders below for more control'
                    }
                  }}
                  minDateTime={new Date()}
                />
              </Grid>
              
              {/* Tags */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        deleteIcon={<DeleteIcon />}
                      />
                    ))}
                  </Box>
                  <Box display="flex" gap={1}>
                    <TextField
                      size="small"
                      label="Add Tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button 
                      variant="outlined" 
                      onClick={handleAddTag}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              {/* Multiple Reminders */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ScheduleIcon />
                      <Typography>Multiple Reminders ({formData.reminders.length})</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {/* Existing Reminders */}
                      {formData.reminders.length > 0 && (
                        <List>
                          {formData.reminders.map((reminder, index) => (
                            <ListItem key={reminder.id || index}>
                              <ListItemText
                                primary={`Reminder ${index + 1}`}
                                secondary={new Date(reminder.time).toLocaleString()}
                              />
                              <ListItemSecondaryAction>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleDeleteReminder(reminder.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      {/* Add New Reminder */}
                      <Typography variant="subtitle2" gutterBottom>
                        Add New Reminder
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Reminder Date"
                            value={currentReminder.time}
                            onChange={(date) => setCurrentReminder(prev => ({ ...prev, time: date }))}
                            format="dd-MM-yyyy"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "small",
                                error: !!errors.currentReminderTime
                              }
                            }}
                            minDate={new Date()}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TimePicker
                            label="Reminder Time"
                            value={currentReminder.time}
                            onChange={(time) => {
                              if (currentReminder.time) {
                                const combined = new Date(currentReminder.time);
                                combined.setHours(time.getHours());
                                combined.setMinutes(time.getMinutes());
                                setCurrentReminder(prev => ({ ...prev, time: combined }));
                              } else {
                                const now = new Date();
                                now.setHours(time.getHours());
                                now.setMinutes(time.getMinutes());
                                setCurrentReminder(prev => ({ ...prev, time: now }));
                              }
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "small",
                                error: !!errors.currentReminderTime
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                      
                      {errors.currentReminderTime && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {errors.currentReminderTime}
                        </Alert>
                      )}
                      
                      <TextField
                        fullWidth
                        size="small"
                        label="Custom Message (optional)"
                        value={currentReminder.message.custom}
                        onChange={(e) => setCurrentReminder(prev => ({
                          ...prev,
                          message: {
                            ...prev.message,
                            custom: e.target.value
                          }
                        }))}
                        placeholder="Custom reminder message"
                        sx={{ mb: 1 }}
                      />
                      
                      <TextField
                        fullWidth
                        size="small"
                        label="Custom Email Subject (optional)"
                        value={currentReminder.message.email.subject}
                        onChange={(e) => setCurrentReminder(prev => ({
                          ...prev,
                          message: {
                            ...prev.message,
                            email: {
                              ...prev.message.email,
                              subject: e.target.value
                            }
                          }
                        }))}
                        sx={{ mb: 1 }}
                      />
                      
                      <TextField
                        fullWidth
                        size="small"
                        label="Custom Email Body (optional)"
                        multiline
                        rows={2}
                        value={currentReminder.message.email.body}
                        onChange={(e) => setCurrentReminder(prev => ({
                          ...prev,
                          message: {
                            ...prev.message,
                            email: {
                              ...prev.message.email,
                              body: e.target.value
                            }
                          }
                        }))}
                        sx={{ mb: 2 }}
                      />
                      
                      <Button 
                        variant="outlined" 
                        onClick={handleAddReminder}
                        startIcon={<AddIcon />}
                        disabled={!currentReminder.time}
                      >
                        Add Reminder
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              
              {/* Custom Notifications */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MessageIcon />
                      <Typography>Custom Notification Messages</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {/* Email Notifications */}
                      <Box sx={{ mb: 3 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <EmailIcon />
                          <Typography variant="h6">Email Notifications</Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.customNotifications?.email?.enabled || false}
                                onChange={(e) => handleCustomNotificationChange('email', 'enabled', e.target.checked)}
                              />
                            }
                            label="Enabled"
                          />
                        </Box>
                        
                        <TextField
                          fullWidth
                          label="Custom Email Subject"
                          value={formData.customNotifications?.email?.subject || ''}
                          onChange={(e) => handleCustomNotificationChange('email', 'subject', e.target.value)}
                          disabled={!formData.customNotifications?.email?.enabled}
                          helperText={`${(formData.customNotifications?.email?.subject || '').length}/100 characters${errors.emailSubject ? ` - ${errors.emailSubject}` : ''}`}
                          error={!!errors.emailSubject}
                          placeholder="Leave empty to use auto-generated subject"
                          sx={{ mb: 2 }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Custom Email Body"
                          multiline
                          rows={4}
                          value={formData.customNotifications?.email?.body || ''}
                          onChange={(e) => handleCustomNotificationChange('email', 'body', e.target.value)}
                          disabled={!formData.customNotifications?.email?.enabled}
                          helperText={`${(formData.customNotifications?.email?.body || '').length}/1000 characters${errors.emailBody ? ` - ${errors.emailBody}` : ''}`}
                          error={!!errors.emailBody}
                          placeholder="Leave empty to use auto-generated email body"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />
                      
                      {/* Custom Message Notifications */}
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <MessageIcon />
                          <Typography variant="h6">Custom Message Notifications</Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.customNotifications?.custom?.enabled || false}
                                onChange={(e) => handleCustomNotificationChange('custom', 'enabled', e.target.checked)}
                              />
                            }
                            label="Enabled"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            fullWidth
                            label="Reminder Message"
                            value={formData.customNotifications?.custom?.reminderMessage || ''}
                            onChange={(e) => handleCustomNotificationChange('custom', 'reminderMessage', e.target.value)}
                            disabled={!formData.customNotifications?.custom?.enabled}
                            placeholder="Custom reminder notification message"
                          />
                          
                          <TextField
                            fullWidth
                            label="Overdue Message"
                            value={formData.customNotifications?.custom?.overdueMessage || ''}
                            onChange={(e) => handleCustomNotificationChange('custom', 'overdueMessage', e.target.value)}
                            disabled={!formData.customNotifications?.custom?.enabled}
                            placeholder="Custom overdue notification message"
                          />
                          
                          <TextField
                            fullWidth
                            label="Completion Message"
                            value={formData.customNotifications?.custom?.completionMessage || ''}
                            onChange={(e) => handleCustomNotificationChange('custom', 'completionMessage', e.target.value)}
                            disabled={!formData.customNotifications?.custom?.enabled}
                            placeholder="Custom completion notification message"
                          />
                        </Box>
                        
                        <Box mt={1} display="flex" gap={1}>
                          <Button 
                            size="small" 
                            startIcon={<PreviewIcon />}
                            onClick={() => generatePreview('custom_reminder')}
                          >
                            Preview Messages
                          </Button>
                        </Box>
                      </Box>
                      
                      {/* Preview Message */}
                      {previewMessage && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Auto-Generated Preview:
                          </Typography>
                          <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                            {previewMessage}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.dueDate || !formData.dueTime}
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EnhancedTaskForm;
