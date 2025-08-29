# Custom Task Message System

Your ToDo application now features an intelligent message generation system that creates personalized notifications based on task types, priorities, and context.

## Overview

The **MessageGenerator** service creates contextual messages for different task types, ensuring users receive relevant and engaging notifications that match their task context.

## Task Types Supported

### 📋 Available Task Types

| Type | Icon | Use Case | Example |
|------|------|----------|---------|
| **work** | 💼 | Professional tasks, deadlines, meetings | "Submit quarterly report", "Client presentation" 
| **personal** | 🏠 | Personal goals, home tasks | "Clean garage", "Call family" |
| **health** | 🏥 | Medical appointments, wellness goals | "Doctor appointment", "Take vitamins" |
| **finance** | 💰 | Bills, budgeting, financial planning | "Pay rent", "Review budget" |
| **education** | 📚 | Learning, studying, courses | "Study for exam", "Complete assignment" |
| **shopping** | 🛒 | Shopping lists, purchases | "Buy groceries", "Order supplies" |
| **meeting** | 🤝 | Meetings, conferences, calls | "Team standup", "Client call" |
| **deadline** | ⏰ | Critical deadlines, time-sensitive tasks | "Project submission", "Contract signing" |
| **appointment** | 📅 | Scheduled appointments | "Dentist visit", "Car service" |
| **project** | 📋 | Project milestones, deliverables | "Website launch", "Phase completion" |
| **exercise** | 💪 | Fitness, workouts, sports | "Gym session", "Running" |
| **social** | 👥 | Social events, gatherings | "Birthday party", "Date night" |
| **travel** | ✈️ | Travel planning, trips | "Book flight", "Pack luggage" |
| **maintenance** | 🔧 | Maintenance, repairs, upkeep | "Oil change", "Clean filters" |
| **other** | 📝 | General tasks | "Miscellaneous tasks" |

## Message Types

### 1. **Reminder Messages**
Sent when tasks are approaching their due date.

**Example for Work Task:**
```
💼 Work Reminder

Professional reminder: "Submit quarterly report" needs attention

Description: Prepare and submit Q3 financial report
Due Date: August 28, 2025, 5:00:00 PM
Time Remaining: 1 hour, 30 minutes
Priority: HIGH
Tags: finance, reporting

⚠️⚠️ - Important!
```

### 2. **Overdue Alert Messages**
Sent when tasks become overdue.

**Example for Health Task:**
```
🏥 🚨 Health Priority

Health priority overdue: "Doctor appointment" needs immediate attention

Description: Annual physical checkup
Was Due: August 27, 2025, 10:00:00 AM
Overdue By: 1 day and 7 hours
Priority: HIGH

🚨 This task requires immediate attention! 🚨
⚠️⚠️ - Important!
```

### 3. **Completion Messages**
Sent when tasks are marked as complete.

**Example for Exercise Task:**
```
💪 ✅ Workout Completed

Great job! "Morning gym session" has been completed! 💪

Task: 30-minute cardio and strength training
Completed: August 28, 2025, 8:30:00 AM
Type: exercise
Priority: MEDIUM

Keep up the great work! 🎯
```

## Priority-Based Customization

### 🚨 Urgent Priority
- **Prefix**: "🚨 URGENT"
- **Suffix**: "- ACT NOW!"
- **Emphasis**: "⚠️⚠️⚠️"
- **Special Features**: More aggressive language, immediate action words

### ⚡ High Priority
- **Prefix**: "⚡ HIGH PRIORITY"
- **Suffix**: "- Important!"
- **Emphasis**: "⚠️⚠️"
- **Special Features**: Professional urgency, clear importance indicators

### 📌 Medium Priority
- **Prefix**: None
- **Suffix**: None
- **Emphasis**: "⚠️"
- **Special Features**: Standard messaging

### 📌 Low Priority
- **Prefix**: "📌"
- **Suffix**: "- When convenient"
- **Emphasis**: None
- **Special Features**: Gentle reminders, flexible timing

## Message Formats

### � Email Format (Brief)
Optimized for quick, concise notifications.
```
💼 🚨 URGENT Work deadline missed! "Submit quarterly report" requires immediate attention Was due: Aug 28, 5:00 PM. 2 hours overdue!
```

### 📧 Email Format (Full)
Comprehensive information with all task details.
```
💼 🚨 Work Task Overdue

Work deadline missed! "Submit quarterly report" requires immediate attention

Description: Prepare and submit Q3 financial report
Was Due: August 28, 2025, 5:00:00 PM
Overdue By: 2 hours and 15 minutes
Priority: URGENT
Tags: finance, reporting, deadline

🚨 This task requires immediate attention! 🚨
⚠️⚠️⚠️ - ACT NOW!
```

### 🔔 Push Notification Format (Title)
Brief, attention-grabbing titles for push notifications.
```
💼 🚨 Work Task Overdue
```

## Testing Custom Messages

### Test Different Task Types
```bash
# Test work task reminder
curl -X POST http://localhost:5000/api/test/custom-message \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "work",
    "priority": "urgent",
    "title": "Submit quarterly report",
    "description": "Prepare and submit Q3 financial report",
    "messageType": "reminder"
  }'
```

### Test All Message Types
```bash
# Test all message types for a health task
curl -X POST http://localhost:5000/api/test/custom-message \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "health",
    "priority": "high",
    "title": "Doctor appointment",
    "description": "Annual physical checkup",
    "messageType": "all"
  }'
```

### Get Available Task Types
```bash
# Get list of all supported task types
curl -X GET http://localhost:5000/api/test/task-types
```

## PowerShell Testing Commands

### Test Custom Messages
```powershell
$body = @{
    taskType = "deadline"
    priority = "urgent"
    title = "Project submission"
    description = "Submit final project deliverables"
    messageType = "all"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/custom-message" -Method POST -Body $body -ContentType "application/json"
```

### Test Different Scenarios
```powershell
# Health appointment reminder
$healthTask = @{
    taskType = "health"
    priority = "high"
    title = "Dentist appointment"
    messageType = "reminder"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/custom-message" -Method POST -Body $healthTask -ContentType "application/json"

# Work deadline overdue
$workTask = @{
    taskType = "work"
    priority = "urgent"
    title = "Client presentation"
    messageType = "overdue"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/custom-message" -Method POST -Body $workTask -ContentType "application/json"
```

## Integration with Your Application

### Automatic Message Generation

The system automatically generates appropriate messages based on:

1. **Task Type**: Determines icon, tone, and template
2. **Priority Level**: Adds urgency indicators and emphasis
3. **Context**: Reminder, overdue, or completion
4. **Message Format**: Email or push notification

### Frontend Integration

Update your task creation forms to include task type selection:

```javascript
// Task type options for frontend
const taskTypes = [
  { value: 'work', label: '💼 Work', description: 'Professional tasks and deadlines' },
  { value: 'personal', label: '🏠 Personal', description: 'Personal goals and home tasks' },
  { value: 'health', label: '🏥 Health', description: 'Medical and wellness tasks' },
  { value: 'finance', label: '💰 Finance', description: 'Bills and financial planning' },
  { value: 'education', label: '📚 Education', description: 'Learning and study tasks' },
  { value: 'meeting', label: '🤝 Meeting', description: 'Meetings and appointments' },
  { value: 'deadline', label: '⏰ Deadline', description: 'Critical time-sensitive tasks' },
  { value: 'exercise', label: '💪 Exercise', description: 'Fitness and workout tasks' },
  // ... more types
];
```

### Backend Usage

The MessageGenerator is automatically used in:

- **Task Reminders**: `NotificationService.sendTaskReminder()`
- **Overdue Alerts**: `NotificationService.sendOverdueAlert()`
- **Completion Notifications**: `NotificationService.sendTaskCompletionNotification()`

## Customization Options

### Adding New Task Types

1. **Update Task Model**: Add new type to enum in `models/Task.js`
2. **Configure Messages**: Add configuration in `MessageGenerator.js`
3. **Update Frontend**: Add new type to task creation forms

### Custom Templates

Each task type supports multiple message templates for variety:

```javascript
reminderTemplates: [
  'Time to focus on your work task: "{title}"',
  'Your work deadline is approaching: "{title}"',
  'Don\'t forget your work commitment: "{title}"',
  'Professional reminder: "{title}" needs attention'
]
```

### Priority Customization

Modify priority behaviors in `MessageGenerator.js`:

```javascript
priorityModifiers: {
  urgent: {
    prefix: '🚨 URGENT',
    suffix: '- ACT NOW!',
    emphasis: '⚠️⚠️⚠️'
  }
}
```

## Smart Features

### 1. **Template Rotation**
Messages randomly select from multiple templates to avoid repetition.

### 2. **Context-Aware Timing**
- Reminders use future tense
- Overdue alerts emphasize past deadlines
- Completions celebrate achievements

### 3. **Priority Escalation**
Higher priority tasks get more aggressive messaging and additional notification channels.

### 4. **Type-Specific Channels**
- Work tasks: Email + Push
- Health tasks: All channels
- Meetings: Email for immediate alerts
- Deadlines: All channels with urgency

### 5. **Smart Email for Overdue**
Email notifications for overdue tasks sent for all priorities with enhanced templates for urgent tasks.

## Performance Considerations

- **Template Caching**: Message templates are loaded once at service initialization
- **Efficient Generation**: Messages generated on-demand with minimal processing
- **Memory Optimized**: Lightweight configuration objects
- **Scalable Design**: Easy to add new types without performance impact

## Best Practices

### Task Type Selection
- **Be Specific**: Choose the most specific type for better messaging
- **Consider Context**: Think about when and how you want to be reminded
- **Use Priorities**: Combine types with appropriate priorities

### Message Testing
- **Test All Types**: Verify messaging for each task type you use
- **Check Priorities**: Ensure urgent tasks get appropriate emphasis
- **Validate Formats**: Test email and push notification formats

### User Experience
- **Consistent Types**: Use similar task types for related activities
- **Clear Priorities**: Set priorities that match real importance
- **Regular Review**: Update task types as your needs evolve

The custom message system ensures your ToDo application provides contextual, engaging, and effective notifications that help users stay organized and motivated! 🎯
