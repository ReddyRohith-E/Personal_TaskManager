# Personal Task Manager - Vercel Unified Deployment

A full-stack task management application with real-time notifications, countdown timers, and comprehensive task organization features. **✅ READY FOR VERCEL DEPLOYMENT**

## 🚀 Deployment Status

**🟢 UNIFIED VERCEL DEPLOYMENT**
- **Platform**: Single Vercel deployment for both frontend and backend
- **Backend**: Node.js serverless functions
- **Frontend**: Static React build served from Vercel CDN
- **Database**: MongoDB Atlas (cloud)
- **Real-time**: Socket.io enabled for live updates
- **Environment**: Single `.env` file at project root

## 🎯 Key Advantages Over Render + Netlify

✅ **No Cold Starts**: Vercel doesn't spin down like Render's free tier  
✅ **Better Performance**: Global CDN for frontend, edge functions for backend  
✅ **Unified Deployment**: Single command deploys both frontend and backend  
✅ **Automatic HTTPS**: SSL certificates managed automatically  
✅ **Zero Config**: Minimal configuration required  
✅ **Better Free Tier**: More generous limits than Render free tier

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
- Node.js (v18+)
- MongoDB Atlas Account (cloud database)
- Gmail Account with App Password
- Vercel Account (for deployment)

### Environment Configuration
Create a single `.env` file in the project root with all environment variables:

```bash
# =====================================
# UNIFIED ENVIRONMENT CONFIGURATION
# =====================================

# General
NODE_ENV=development

# Backend Configuration
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Configuration
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
GMAIL_FROM_NAME=Task Flow
GMAIL_REPLY_TO=your_gmail@gmail.com

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Installation

**Option 1: Quick Setup**
```bash
npm run setup
npm run dev
```

**Option 2: Manual Setup**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Start development servers
cd .. && npm run dev
```

### Deployment to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your Vercel project settings
   - Add all environment variables from your `.env` file
   - Set `NODE_ENV=production`

4. **Deploy**
```bash
npm run deploy:vercel
```

## 📁 Project Structure

```
ToDo/
├── .env                    # ← SINGLE environment file for everything
├── package.json           # Root package with unified scripts
├── vercel.json            # Vercel deployment configuration
├── backend/
│   ├── server.js          # Main server file (loads root .env)
│   ├── package.json       # Backend dependencies
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── frontend/
│   ├── vite.config.js     # Configured to use root .env
│   ├── package.json       # Frontend dependencies
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── utils/
└── docs/
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
# Run all tests
npm run test

# Test backend only
cd backend && npm test

# Test frontend only
cd frontend && npm test

# Test production build locally
npm run build
npm start
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Production
npm run build           # Build frontend and install backend deps
npm run start           # Start production server
npm run deploy:vercel   # Deploy to Vercel

# Maintenance
npm run setup          # Initial project setup
npm run clean          # Clean all node_modules and dist folders
```

## 🌍 Environment Variables Reference

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Backend port | `5000` | Auto-set by Vercel |
| `MONGODB_URI` | Database connection | Your MongoDB Atlas URI | Same |
| `JWT_SECRET` | JWT signing key | Your secret | Same (set in Vercel) |
| `VITE_API_URL` | Frontend API URL | `http://localhost:5000/api` | `/api` |
| `VITE_SOCKET_URL` | Socket.io URL | `http://localhost:5000` | Auto-set |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` | Auto-set |

## 📈 Future Enhancements

- ✅ Mobile-responsive Progressive Web App
- 🔄 Real-time collaboration features
- 📊 Advanced analytics dashboard
- 🤖 AI-powered task prioritization
- 📱 Mobile app (React Native)
- 🔔 Push notifications
- 📅 Calendar integration
- 🎤 Voice commands

## 🆚 Migration Benefits

### Before (Render + Netlify)
❌ Backend spins down after 15 minutes  
❌ Cold start delays (up to 1 minute)  
❌ Separate deployments to manage  
❌ CORS complexity between platforms  
❌ Limited free tier resources  

### After (Unified Vercel)
✅ Serverless functions stay warm longer  
✅ Near-instant cold starts (< 1 second)  
✅ Single deployment command  
✅ Automatic CORS handling  
✅ Better free tier limits  
✅ Global CDN for faster loading  

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

**Ready for deployment!** 🚀 Your app is now configured for optimal performance on Vercel's unified platform.
