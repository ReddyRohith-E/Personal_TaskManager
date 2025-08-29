import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  Stack,
  Chip,
  Divider,
  Paper,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore,
  Email,
  NotificationsActive,
  Refresh,
  Send,
  Message,
} from '@mui/icons-material';
import { TASK_TYPES, TaskTypeChip } from './TaskTypeChip';
import AnimatedCard from './AnimatedCard';

const MessagePreview = () => {
  const [testTask, setTestTask] = useState({
    title: 'Complete project proposal',
    description: 'Prepare and submit the quarterly project proposal for the new client',
    type: 'work',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    tags: ['project', 'deadline', 'client']
  });

  const [messageType, setMessageType] = useState('reminder');
  const [messages, setMessages] = useState({
    reminder: {
      custom: 'Reminder: Complete project proposal is due in 2 hours. Stay focused! 💼',
      full: 'Hi there!\n\nThis is a friendly reminder that your task "Complete project proposal" is due in 2 hours.\n\nDescription: Prepare and submit the quarterly project proposal for the new client\n\nDon\'t forget to complete it on time!\n\nBest regards,\nTaskFlow Team',
      push: 'Task Due Soon: Complete project proposal'
    },
    overdue: {
      custom: 'OVERDUE: Complete project proposal was due. Please complete ASAP! ⚠️',
      full: 'URGENT: Task Overdue\n\nYour task "Complete project proposal" is now overdue.\n\nDescription: Prepare and submit the quarterly project proposal for the new client\n\nPlease complete this task as soon as possible to stay on track.\n\nRegards,\nTaskFlow Team',
      push: 'OVERDUE: Complete project proposal'
    },
    completion: {
      custom: 'Great job! ✅ You completed "Complete project proposal". Keep up the momentum! 🚀',
      full: 'Congratulations!\n\nYou have successfully completed your task: "Complete project proposal"\n\nDescription: Prepare and submit the quarterly project proposal for the new client\n\nGreat work on staying productive!\n\nBest wishes,\nTaskFlow Team',
      push: 'Task Completed: Complete project proposal ✅'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const generateMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      const response = await fetch('/api/test/custom-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: testTask.type,
          priority: testTask.priority,
          title: testTask.title,
          description: testTask.description,
          messageType: 'all' // Get all message types
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setError(null);
      } else {
        throw new Error('API unavailable');
      }
    } catch (err) {
      console.warn('API not available, generating messages locally:', err.message);
      
      // Fallback to local generation
      const taskTitle = testTask.title || 'Your task';
      const taskDesc = testTask.description || '';
      const priorityText = testTask.priority === 'urgent' ? 'URGENT' : testTask.priority.toUpperCase();
      const taskTypeIcon = testTask.type === 'work' ? '💼' : 
                          testTask.type === 'health' ? '🏥' :
                          testTask.type === 'personal' ? '👤' :
                          testTask.type === 'finance' ? '💰' : '📋';
      
      const newMessages = {
        reminder: {
          custom: `Reminder: ${taskTitle} is due soon. ${priorityText} priority! ${taskTypeIcon}`,
          full: `Hi there!\n\nThis is a friendly reminder that your task "${taskTitle}" is due soon.\n\n${taskDesc ? `Description: ${taskDesc}\n\n` : ''}Priority: ${priorityText}\n\nDon't forget to complete it on time!\n\nBest regards,\nTaskFlow Team`,
          push: `Task Due Soon: ${taskTitle}`
        },
        overdue: {
          custom: `OVERDUE: ${taskTitle} was due. Please complete ASAP! ⚠️`,
          full: `URGENT: Task Overdue\n\nYour task "${taskTitle}" is now overdue.\n\n${taskDesc ? `Description: ${taskDesc}\n\n` : ''}Priority: ${priorityText}\n\nPlease complete this task as soon as possible to stay on track.\n\nRegards,\nTaskFlow Team`,
          push: `OVERDUE: ${taskTitle}`
        },
        completion: {
          custom: `Great job! ✅ You completed "${taskTitle}". Keep up the momentum! 🚀`,
          full: `Congratulations!\n\nYou have successfully completed your task: "${taskTitle}"\n\n${taskDesc ? `Description: ${taskDesc}\n\n` : ''}Great work on staying productive!\n\nBest wishes,\nTaskFlow Team`,
          push: `Task Completed: ${taskTitle} ✅`
        }
      };

      setMessages(newMessages);
      setError('Using local message generation (API connection restored)');
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = (messageType, format, content) => {
    setMessages(prev => ({
      ...prev,
      [messageType]: {
        ...prev[messageType],
        [format]: content
      }
    }));
  };

  useEffect(() => {
    generateMessages();
  }, [testTask.type, testTask.priority, messageType]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(generateMessages, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, testTask]);

  const handleTaskChange = (field, value) => {
    setTestTask(prev => ({ ...prev, [field]: value }));
  };

  const MessageCard = ({ title, content, icon, color, messageType, format, editable = true }) => (
    <AnimatedCard
      animation="slideUp"
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          {icon}
          <Typography variant="h6" fontWeight="600" color={color}>
            {title}
          </Typography>
        </Stack>
        <Paper
          sx={{
            p: 2,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {editMode && editable ? (
            <TextField
              fullWidth
              multiline
              rows={format === 'custom' ? 3 : 6}
              value={content}
              onChange={(e) => updateMessage(messageType, format, e.target.value)}
              variant="standard"
              InputProps={{
                style: {
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: 'inherit'
                }
              }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                fontSize: '0.85rem',
              }}
            >
              {content}
            </Typography>
          )}
        </Paper>
      </CardContent>
    </AnimatedCard>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Message Preview System
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test and preview custom notification messages based on task type and priority
      </Typography>

      {/* Configuration Panel */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600">
            Task Configuration
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={editMode}
                  onChange={(e) => setEditMode(e.target.checked)}
                  color="secondary"
                />
              }
              label="Edit Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  color="primary"
                />
              }
              label="Auto Refresh"
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={generateMessages}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Task Title"
              value={testTask.title}
              onChange={(e) => handleTaskChange('title', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={testTask.description}
              onChange={(e) => handleTaskChange('description', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Task Type"
              value={testTask.type}
              onChange={(e) => handleTaskChange('type', e.target.value)}
              sx={{ mb: 2 }}
            >
              {Object.entries(TASK_TYPES).map(([value, config]) => (
                <MenuItem key={value} value={value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Priority"
              value={testTask.priority}
              onChange={(e) => handleTaskChange('priority', e.target.value)}
            >
              <MenuItem value="low">Low Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="urgent">Urgent Priority</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Current Configuration
              </Typography>
              <Stack spacing={1}>
                <TaskTypeChip taskType={testTask.type} size="small" />
                <Chip 
                  label={`${testTask.priority.toUpperCase()} Priority`} 
                  size="small"
                  color={
                    testTask.priority === 'urgent' ? 'error' :
                    testTask.priority === 'high' ? 'warning' :
                    testTask.priority === 'medium' ? 'info' : 'success'
                  }
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Connection Status */}
      {error && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Connection Status:</strong> {error}
        </Alert>
      )}

      {/* Message Previews */}
      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography>Generating messages...</Typography>
        </Paper>
      ) : messages ? (
        <Box>
          {/* Message Type Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              centered
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                  fontWeight: 600,
                },
              }}
            >
              <Tab label="Reminder Messages" />
              <Tab label="Overdue Alerts" />
              <Tab label="Completion Messages" />
            </Tabs>
          </Paper>

          {/* Reminder Messages */}
          {activeTab === 0 && messages.reminder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Custom Message"
                  content={messages.reminder.custom}
                  icon={<Message color="primary" />}
                  color="primary.main"
                  messageType="reminder"
                  format="custom"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Email Format"
                  content={messages.reminder.full}
                  icon={<Email color="secondary" />}
                  color="secondary.main"
                  messageType="reminder"
                  format="full"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Push Notification"
                  content={messages.reminder.push}
                  icon={<NotificationsActive color="success" />}
                  color="success.main"
                  messageType="reminder"
                  format="push"
                />
              </Grid>
            </Grid>
          )}

          {/* Overdue Messages */}
          {activeTab === 1 && messages.overdue && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Custom Message"
                  content={messages.overdue.custom}
                  icon={<Message color="error" />}
                  color="error.main"
                  messageType="overdue"
                  format="custom"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Email Format"
                  content={messages.overdue.full}
                  icon={<Email color="error" />}
                  color="error.main"
                  messageType="overdue"
                  format="full"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Push Notification"
                  content={messages.overdue.push}
                  icon={<NotificationsActive color="error" />}
                  color="error.main"
                  messageType="overdue"
                  format="push"
                />
              </Grid>
            </Grid>
          )}

          {/* Completion Messages */}
          {activeTab === 2 && messages.completion && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Custom Message"
                  content={messages.completion.custom}
                  icon={<Message color="success" />}
                  color="success.main"
                  messageType="completion"
                  format="custom"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Email Format"
                  content={messages.completion.full}
                  icon={<Email color="success" />}
                  color="success.main"
                  messageType="completion"
                  format="full"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MessageCard
                  title="Push Notification"
                  content={messages.completion.push}
                  icon={<NotificationsActive color="success" />}
                  color="success.main"
                  messageType="completion"
                  format="push"
                />
              </Grid>
            </Grid>
          )}

          {/* Usage Tips */}
          <Paper sx={{ p: 3, mt: 4, borderRadius: 3, background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)' }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              💡 Message Customization Tips
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Custom Messages:</strong> Personalize notifications to match your style
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email Messages:</strong> Include task details and clear actions
                </Typography>
                <Typography variant="body2">
                  <strong>Push Notifications:</strong> Brief titles for immediate attention
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Edit Mode:</strong> Toggle edit mode to customize messages
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Auto Refresh:</strong> Messages update when you change task settings
                </Typography>
                <Typography variant="body2">
                  <strong>Template Preview:</strong> Test different task types and priorities
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ) : null}
    </Box>
  );
};

export default MessagePreview;
