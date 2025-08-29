# Personal Task Manager Application

A full-stack task management application with real-time notifications, countdown timers, and comprehensive task organization features. **✅ COMPLETED AND RUNNING**

## � Application Status

**🟢 LIVE AND FUNCTIONAL**
- **Backend**: Running on http://localhost:5000 
- **Frontend**: Running on http://localhost:5173
- **Database**: MongoDB connected and operational
- **Real-time**: Socket.io enabled for live updates

## 🚀 Key Features

### ✅ Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Status Tracking**: Pending, In-Progress, Completed, Cancelled
- **Priority Levels**: Low, Medium, High, Urgent
- **Due Date Management**: Set and track task deadlines
- **Tags & Categories**: Organize tasks with custom tags
- **Search & Filter**: Find tasks by title, description, status, or priority

### ⏰ Smart Notifications
- **Real-time Countdown**: Live countdown timers for task deadlines
- **Reminder System**: Set custom reminder times before due dates
- **Socket.io Integration**: Real-time updates across all devices
- **Dashboard Statistics**: Visual overview of task completion rates

### 🔐 User Management
- **JWT Authentication**: Secure login and registration
- **User Profiles**: Manage personal information and preferences
- **Password Security**: Bcrypt hashing with salt rounds
- **Session Management**: Automatic token refresh and logout

### � Modern UI/UX
- **Material-UI Design**: Clean, responsive interface
- **React Router**: Seamless single-page application navigation
- **Context API**: Efficient state management
- **Progressive Web App**: Mobile-friendly design

## 📦 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time updates
- **JWT** for authentication
- **Gmail SMTP** for email notifications
- **node-cron** for scheduled tasks

### Frontend
- **React** for web application
- **React Native** for mobile (future)
- **Socket.io-client** for real-time updates
- **Axios** for API calls
- **Material-UI** for styling

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- Gmail Account with App Password

### Environment Variables
Create `.env` files in both frontend and backend directories:

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
GMAIL_FROM_NAME=ToDo App
GMAIL_REPLY_TO=noreply@yourapp.com
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Installation

1. **Clone and setup backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Setup frontend:**
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
ToDo/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── config/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
└── docs/
    └── api/
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notifications
- `GET /api/notifications` - Get notification history
- `POST /api/notifications/test` - Test notification services

## 🎯 Usage

1. Register/Login to the application
2. Create tasks with deadlines and reminder times
3. Monitor real-time countdown timers
4. Receive custom email notifications
5. Track completion statistics

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Future Enhancements

- Mobile app (React Native)
- Calendar integration
- Team collaboration features
- Advanced analytics dashboard
- Voice notifications
- AI-powered task prioritization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
