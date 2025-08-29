# Personal Task Manager - Netlify + Fly.io Deployment

A full-stack task management application with real-time notifications, countdown timers, and comprehensive task organization features. **✅ READY FOR NETLIFY + FLY.IO DEPLOYMENT**

## 🚀 Deployment Status
## 🌍 Environment Variables Reference

### Backend (.env in /backend/)
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Backend port | `5000` | Auto-set by Fly.io |
| `MONGODB_URI` | Database connection | Your MongoDB Atlas URI | Same |
| `JWT_SECRET` | JWT signing key | Your secret | Same |
| `GMAIL_USER` | Gmail username | your_gmail@gmail.com | Same |
| `GMAIL_APP_PASSWORD` | Gmail app password | Your app password | Same |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` | Your Netlify URL |

### Frontend (.env in /frontend/)
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | `https://your-fly-app.fly.dev/api` |
| `VITE_SOCKET_URL` | Socket.io URL | `http://localhost:5000` | `https://your-fly-app.fly.dev` |FY + FLY.IO DEPLOYMENT**
- **Frontend**: Netlify (static hosting with CDN)
- **Backend**: Fly.io (Docker containerized Node.js)
- **Database**: MongoDB Atlas (cloud)
- **Real-time**: Socket.io enabled for live updates
- **Environment**: Separate environment variables for each service

## 🎯 Key Advantages

✅ **Optimized Performance**: Netlify's global CDN for frontend, Fly.io's containerized backend  
✅ **Scalable Backend**: Fly.io handles traffic spikes better than serverless  
✅ **Cost Effective**: Generous free tiers on both platforms  
✅ **Easy Deployment**: Simple git-based deployments  
✅ **Real-time Features**: Socket.io works seamlessly across platforms  

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

**Backend** (`.env` in `/backend/`):
```bash
# Environment
NODE_ENV=development

# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
GMAIL_FROM_NAME=Task Flow
GMAIL_REPLY_TO=your_gmail@gmail.com

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env` in `/frontend/`):
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
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

### Deployment to Netlify + Fly.io

#### 1. Backend Deployment (Fly.io)

1. **Install Fly CLI**
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

2. **Login to Fly.io**
```bash
fly auth login
```

3. **Initialize Fly app**
```bash
cd backend
fly launch
# Follow prompts, choose region, etc.
```

4. **Set Environment Variables**
```bash
fly secrets set NODE_ENV=production
fly secrets set MONGODB_URI=your_mongodb_atlas_uri
fly secrets set JWT_SECRET=your_jwt_secret
fly secrets set GMAIL_USER=your_gmail@gmail.com
fly secrets set GMAIL_APP_PASSWORD=your_app_password
fly secrets set FRONTEND_URL=https://your-netlify-site.netlify.app
```

5. **Deploy Backend**
```bash
fly deploy
```

#### 2. Frontend Deployment (Netlify)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Set Environment Variables in Netlify**
   - `VITE_API_URL`: `https://your-fly-app.fly.dev/api`
   - `VITE_SOCKET_URL`: `https://your-fly-app.fly.dev`

3. **Deploy Frontend**
   - Push to main branch or trigger manual deploy

## 📁 Project Structure

```
ToDo/
├── .env.example                    # ← Environment variables template
├── backend/
│   ├── .env                        # ← Backend environment variables
│   ├── server.js                   # ← Loads .env from backend directory
│   ├── package.json
│   ├── Dockerfile
│   ├── fly.toml
│   └── ... (other backend files)
├── frontend/
│   ├── .env                        # ← Frontend environment variables
│   ├── vite.config.js              # ← Loads .env from frontend directory
│   ├── package.json
│   ├── netlify.toml
│   └── ... (other frontend files)
└── README.md
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

## 🆚 Deployment Benefits

### Netlify + Fly.io Advantages
✅ **Global CDN**: Netlify's worldwide CDN for fast frontend loading  
✅ **Containerized Backend**: Fly.io runs your app in Docker containers  
✅ **Persistent Connections**: Fly.io keeps your backend running 24/7  
✅ **Real-time Ready**: Socket.io works perfectly with persistent backend  
✅ **Easy Scaling**: Both platforms scale automatically  
✅ **Developer Friendly**: Great developer experience and tooling  

### Architecture Overview
- **Frontend**: React SPA hosted on Netlify
- **Backend**: Node.js API running on Fly.io
- **Database**: MongoDB Atlas (cloud)
- **Real-time**: Socket.io for live updates
- **Email**: Gmail SMTP for notifications

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

**Ready for deployment!** 🚀 Your app is now configured for optimal performance on Netlify + Fly.io.
