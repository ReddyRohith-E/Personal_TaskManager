import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomThemeProvider } from './theme/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { TaskProvider } from './contexts/TaskContext'
import { SocketProvider } from './contexts/SocketContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import MessageTesting from './pages/MessageTesting'
import PrivateRoute from './components/PrivateRoute'
import CORSDebugger from './components/common/CORSDebugger'

function App() {
  // Show CORS debugger in development or when CORS debug is enabled
  const showCORSDebugger = !import.meta.env.PROD || localStorage.getItem('cors-debug') === 'true';

  return (
    <CustomThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <TaskProvider>
            {showCORSDebugger && <CORSDebugger isVisible={!import.meta.env.PROD} />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="profile" element={<Profile />} />
                <Route path="messages" element={<MessageTesting />} />
              </Route>
            </Routes>
          </TaskProvider>
        </SocketProvider>
      </AuthProvider>
    </CustomThemeProvider>
  )
}

export default App
