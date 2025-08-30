import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Grid,
  Fab,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Skeleton,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Send as SendIcon,
  CleaningServices as CleanupIcon
} from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TaskTypeChip } from "../UI/TaskTypeChip";
import EnhancedTaskForm from './EnhancedTaskForm';
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';

// Configure dayjs plugins
dayjs.extend(relativeTime);

const TaskCard = ({ task, onEdit, onDelete, onComplete, onTestNotification }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReminders, setShowReminders] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTimeString = (date) => {
    const taskDate = dayjs(date);
    const now = dayjs();
    
    if (taskDate.isSame(now, 'day')) return `Today at ${taskDate.format('HH:mm')}`;
    if (taskDate.isSame(now.add(1, 'day'), 'day')) return `Tomorrow at ${taskDate.format('HH:mm')}`;
    return taskDate.format('MMM DD, YYYY HH:mm');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const isOverdue = dayjs(task.dueDate).isBefore(dayjs()) && task.status === 'pending';

  return (
    <>
      <Card 
        sx={{ 
          mb: 2, 
          border: isOverdue ? `2px solid ${theme.palette.error.main}` : 'none',
          backgroundColor: isOverdue ? theme.palette.error.light + '10' : 'background.paper'
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TaskTypeChip taskType={task.type} variant="small" />
                <Chip 
                  label={task.priority} 
                  color={getPriorityColor(task.priority)} 
                  size="small" 
                />
                {isOverdue && (
                  <Chip 
                    icon={<WarningIcon />}
                    label="Overdue" 
                    color="error" 
                    size="small" 
                  />
                )}
              </Box>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                }}
              >
                {task.title}
              </Typography>
              
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {task.description}
                </Typography>
              )}
            </Box>
            
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1} alignItems={isMobile ? "flex-start" : "center"} mt={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {getTimeString(task.dueDate)}
              </Typography>
            </Box>
            
            {(task.reminders?.length > 0 || task.reminderTime) && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <NotificationsIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {task.reminders?.length > 0 ? `${task.reminders.length} reminders` : '1 reminder'}
                </Typography>
                <Button 
                  size="small" 
                  variant="text" 
                  onClick={() => setShowReminders(true)}
                >
                  View
                </Button>
              </Box>
            )}
          </Box>
          
          {task.tags && task.tags.length > 0 && (
            <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
              {task.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
        
        <CardActions>
          {task.status !== 'completed' && (
            <Button 
              startIcon={<CheckCircleIcon />}
              onClick={() => onComplete(task._id)}
              color="success"
              size="small"
            >
              Complete
            </Button>
          )}
          
          <Button 
            startIcon={<EditIcon />}
            onClick={() => onEdit(task)}
            size="small"
          >
            Edit
          </Button>
        </CardActions>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(task); handleMenuClose(); }}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { onTestNotification(task, 'email'); handleMenuClose(); }}>
          <ListItemIcon><EmailIcon /></ListItemIcon>
          <ListItemText>Test Email</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { onTestNotification(task, 'custom'); handleMenuClose(); }}>
          <ListItemIcon><NotificationsIcon /></ListItemIcon>
          <ListItemText>Test Custom Message</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => { onDelete(task._id); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
          <ListItemText>Delete Task</ListItemText>
        </MenuItem>
      </Menu>

      {/* Reminders Dialog */}
      <Dialog open={showReminders} onClose={() => setShowReminders(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Task Reminders</DialogTitle>
        <DialogContent>
          <List>
            {task.reminderTime && (
              <ListItem>
                <ListItemText
                  primary="Legacy Reminder"
                  secondary={getTimeString(task.reminderTime)}
                />
              </ListItem>
            )}
            
            {task.reminders?.map((reminder, index) => (
              <ListItem key={reminder.id || index}>
                <ListItemText
                  primary={`Reminder ${index + 1}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {getTimeString(reminder.time)}
                      </Typography>
                      {reminder.message?.custom?.reminderMessage && (
                        <Typography variant="caption" display="block">
                          Custom: {reminder.message.custom.reminderMessage}
                        </Typography>
                      )}
                      {reminder.message?.email?.subject && (
                        <Typography variant="caption" display="block">
                          Email: {reminder.message.email.subject}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={reminder.sent ? 'Sent' : 'Pending'} 
                    color={reminder.sent ? 'success' : 'default'} 
                    size="small" 
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReminders(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const TaskManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask, markComplete, fetchTasks } = useTasks();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [testNotificationDialog, setTestNotificationDialog] = useState({
    open: false,
    task: null,
    type: null,
    email: ''
  });
  const [cleanupDialog, setCleanupDialog] = useState(false);
  const [cleanupStats, setCleanupStats] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setFormOpen(false);
      setSnackbar({ open: true, message: 'Task created successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create task', severity: 'error' });
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask._id, taskData);
      setFormOpen(false);
      setEditingTask(null);
      setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update task', severity: 'error' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setSnackbar({ open: true, message: 'Task deleted successfully!', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await markComplete(taskId);
      setSnackbar({ open: true, message: 'Task completed!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to complete task', severity: 'error' });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleTestNotification = (task, type) => {
    setTestNotificationDialog({
      open: true,
      task,
      type,
      email: user?.email || ''
    });
  };

  const sendTestNotification = async () => {
    try {
      const { task, type, email } = testNotificationDialog;
      const endpoint = `/api/tasks/${task._id}/test-notification`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type,
          email: email,
          customMessage: type === 'custom' ? customMessage : undefined
        })
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: `Test ${type} notification sent!`, 
          severity: 'success' 
        });
      } else {
        let errorMsg = 'Failed to send test notification';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        setSnackbar({ 
          open: true, 
          message: errorMsg, 
          severity: 'error' 
        });
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to send test notification', 
        severity: 'error' 
      });
    }
    setTestNotificationDialog({ open: false, task: null, type: null, email: '' });
  };

  const fetchCleanupStats = async () => {
    try {
      const response = await fetch('/api/tasks/cleanup/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCleanupStats(data.data.stats);
      } else {
        console.warn('Failed to fetch cleanup stats:', response.status);
        // Set default stats to allow button to work
        setCleanupStats({
          totalCompletedTasks: 0,
          recentCompletedTasks: 0,
          oldCompletedTasks: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch cleanup stats:', error);
      // Set default stats to allow button to work
      setCleanupStats({
        totalCompletedTasks: 0,
        recentCompletedTasks: 0,
        oldCompletedTasks: 0
      });
    }
  };

  const runCleanup = async () => {
    try {
      const response = await fetch('/api/tasks/cleanup/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const deletedCount = data.data.result.deletedCount || 0;
        
        if (deletedCount > 0) {
          setSnackbar({ 
            open: true, 
            message: `Cleanup completed! ${deletedCount} old tasks removed.`, 
            severity: 'success' 
          });
        } else {
          setSnackbar({ 
            open: true, 
            message: 'No old tasks found to clean up. Your workspace is already organized!', 
            severity: 'info' 
          });
        }
        
        fetchTasks(); // Refresh tasks
        fetchCleanupStats(); // Refresh stats
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
      setSnackbar({ 
        open: true, 
        message: `Cleanup failed: ${error.message}. Please try again.`, 
        severity: 'error' 
      });
    }
  };

  const handleCleanupDialog = () => {
    fetchCleanupStats();
    setCleanupDialog(true);
  };

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const overdueTasks = pendingTasks.filter(task => dayjs(task.dueDate).isBefore(dayjs()));

  if (loading) {
    return (
      <Box p={3}>
        <Grid container spacing={2}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Task Management</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<CleanupIcon />}
            onClick={handleCleanupDialog}
            size={isMobile ? "small" : "medium"}
          >
            Cleanup
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending</Typography>
              <Typography variant="h4">{pendingTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Overdue</Typography>
              <Typography variant="h4" color="error">{overdueTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Completed</Typography>
              <Typography variant="h4" color="success.main">{completedTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total</Typography>
              <Typography variant="h4">{tasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}!
        </Alert>
      )}

      {/* Task Lists */}
      <Grid container spacing={3}>
        {/* Pending Tasks */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" gutterBottom>
            Pending Tasks ({pendingTasks.length})
          </Typography>
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No pending tasks. Create your first task to get started!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            pendingTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
                onTestNotification={handleTestNotification}
              />
            ))
          )}
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" gutterBottom>
            Recent Completed ({completedTasks.slice(0, 5).length})
          </Typography>
          {completedTasks.slice(0, 5).map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
              onTestNotification={handleTestNotification}
            />
          ))}
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
        }}
        onClick={() => setFormOpen(true)}
        disabled={formOpen}
      >
        <AddIcon />
      </Fab>

      {/* Enhanced Task Form */}
      <EnhancedTaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        isEditing={!!editingTask}
      />

      {/* Test Notification Dialog */}
      <Dialog
        open={testNotificationDialog.open}
        onClose={() => setTestNotificationDialog({ open: false, task: null, type: null, email: '' })}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
      >
        <DialogTitle>
          Test {testNotificationDialog.type === 'custom' ? 'Custom' : 'Email'} Notification
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Task: {testNotificationDialog.task?.title}
          </Typography>
          
          {testNotificationDialog.type === 'custom' ? (
            <>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={testNotificationDialog.email}
                onChange={(e) => setTestNotificationDialog(prev => ({ 
                  ...prev, 
                  email: e.target.value 
                }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Custom Message"
                multiline
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                margin="normal"
                placeholder="Enter your custom notification message..."
                required
              />
            </>
          ) : (
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={testNotificationDialog.email}
              onChange={(e) => setTestNotificationDialog(prev => ({
                ...prev,
                email: e.target.value
              }))}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestNotificationDialog({ open: false, task: null, type: null, email: '' })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SendIcon />}
            onClick={sendTestNotification}
            disabled={!testNotificationDialog.email.trim()}
          >
            Send Test
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cleanup Dialog */}
      <Dialog open={cleanupDialog} onClose={() => setCleanupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Task Cleanup</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Clean up old completed tasks to keep your workspace organized.
          </Typography>
          
          {cleanupStats && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>Cleanup Statistics:</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Total Completed Tasks"
                    secondary={cleanupStats.totalCompletedTasks}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Recent Completed Tasks (Last 30 days)"
                    secondary={cleanupStats.recentCompletedTasks}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Old Completed Tasks (30+ days)"
                    secondary={cleanupStats.oldCompletedTasks}
                  />
                </ListItem>
              </List>
              
              {cleanupStats.oldCompletedTasks > 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {cleanupStats.oldCompletedTasks} completed tasks older than 30 days will be permanently deleted.
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  No old completed tasks found. Your workspace is already clean!
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCleanupDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color={cleanupStats && cleanupStats.oldCompletedTasks > 0 ? "warning" : "primary"}
            onClick={() => {
              runCleanup();
              setCleanupDialog(false);
            }}
            disabled={!cleanupStats}
          >
            {cleanupStats && cleanupStats.oldCompletedTasks > 0 ? "Run Cleanup" : "Check Again"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskManagement;
