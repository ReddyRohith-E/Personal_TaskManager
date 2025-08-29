# Personal Task Manager - Netlify + Render Deployment

A full-stack task management application with real-time notifications, countdown timers, and comprehensive task organization features. **✅ READY FOR NETLIFY + RENDER DEPLOYMENT**

## 🚀 Deployment Status
## 🌍 Environment Variables Reference

### Backend (.env in /backend/)
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Backend port | `5000` | Auto-set by Render |
| `MONGODB_URI` | Database connection | Your MongoDB Atlas URI | Same |
| `JWT_SECRET` | JWT signing key | Your secret | Same |
| `GMAIL_USER` | Gmail username | your_gmail@gmail.com | Same |
| `GMAIL_APP_PASSWORD` | Gmail app password | Your app password | Same |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` | Your Netlify URL |

### Frontend (.env in /frontend/)
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | `https://your-render-app.onrender.com/api` |
| `VITE_SOCKET_URL` | Socket.io URL | `http://localhost:5000` | `https://your-render-app.onrender.com` |FY + FLY.IO DEPLOYMENT**
- **Frontend**: Netlify (static hosting with CDN)
- **Backend**: Render (Node.js web service)
- **Database**: MongoDB Atlas (cloud)
- **Real-time**: Socket.io enabled for live updates
- **Environment**: Separate environment variables for each service

## 🎯 Key Advantages

✅ **Simple Deployment**: Render's one-click deployment from GitHub  
✅ **Auto-Scaling**: Render handles traffic spikes automatically  
✅ **Free Tier**: Generous free tier for small applications  
✅ **Managed Service**: No server management required  
✅ **Real-time Ready**: Socket.io works seamlessly with persistent backend  

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

### Uptime Pinger Setup

To keep your Render backend alive and avoid cold starts:

**Option 1: GitHub Actions (Recommended)**
1. Add `RENDER_BACKEND_URL` secret in GitHub repo settings
2. The workflow automatically pings every 8 minutes

**Option 2: Local Pinger**
```bash
# Set your backend URL
set BACKEND_URL=https://your-render-app.onrender.com

# Run the pinger
node uptime-pinger.js
```

**Option 3: Third-party Services**
- UptimeRobot (free tier available)
- Cron-job.org
- Other monitoring services

### Deployment to Netlify + Render

#### 1. Backend Deployment (Render)

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Choose "Web Service" for Node.js

2. **Configure Build Settings**
   - **Runtime**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Your JWT secret
   - `GMAIL_USER`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: Your Gmail app password
   - `FRONTEND_URL`: `https://your-netlify-site.netlify.app`

4. **Deploy Backend**
   - Render will automatically deploy when you push to main branch

#### 2. Frontend Deployment (Netlify)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Set Environment Variables in Netlify**
   - `VITE_API_URL`: `https://your-render-app.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-render-app.onrender.com`

3. **Deploy Frontend**
   - Push to main branch or trigger manual deploy

## 📁 Project Structure

```
ToDo/
├── .env.example                    # ← Environment variables template
├── .github/
│   └── workflows/
│       └── uptime-pinger.yml      # ← GitHub Actions uptime pinger
├── uptime-pinger.js               # ← Local uptime pinger script
├── uptime-pinger-package.json     # ← Pinger dependencies
├── start-pinger.bat               # ← Windows startup script
├── start-pinger.sh                # ← Linux/Mac startup script
├── UPTIME-PINGER-README.md        # ← Pinger documentation
├── backend/
│   ├── .env                        # ← Backend environment variables
│   ├── server.js                   # ← Loads .env from backend directory
│   ├── package.json                # ← Backend dependencies
│   └── ... (other backend files)
├── frontend/
│   ├── .env                        # ← Frontend environment variables
│   ├── vite.config.js              # ← Loads .env from frontend directory
│   ├── package.json                # ← Frontend dependencies
│   ├── netlify.toml                # ← Netlify deployment config
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

### Netlify + Render Advantages
✅ **Simple Deployment**: Render's one-click deployment from GitHub  
✅ **Managed Service**: Render handles server management and scaling  
✅ **Persistent Connections**: Render keeps your backend running continuously  
✅ **Real-time Ready**: Socket.io works perfectly with persistent backend  
✅ **Developer Friendly**: Easy environment variable management  

### Architecture Overview
- **Frontend**: React SPA hosted on Netlify
- **Backend**: Node.js API running on Render
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