import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Paper,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Fade,
  Grow,
  Slide,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  TrendingUp,
  Today,
  Upcoming,
  PlayArrow,
  Refresh,
  Timeline,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedCard, GlassContainer } from '../components/UI';
import SkeletonCard from '../components/UI/SkeletonCard';
import { PriorityChip, StatusChip } from '../components/UI/TaskComponents';

const StatCard = ({ title, value, icon, color, subtitle, trend, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Grow in={true} timeout={300 + index * 100}>
        <AnimatedCard
          variant="glass"
          sx={{
            height: '100%',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            border: `1px solid ${color}30`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: isMobile ? 'none' : 'translateY(-8px)',
              boxShadow: `0 ${isMobile ? '8px' : '20px'} ${isMobile ? '16px' : '40px'} ${color}20`,
              border: `1px solid ${color}50`,
            },
          }}
        >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'center', sm: 'flex-start' }} 
            spacing={2}
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            <Avatar
              sx={{
                bgcolor: color,
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                boxShadow: `0 4px 12px ${color}40`,
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                fontWeight="500"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                color="text.primary"
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {trend && (
              <Stack alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="caption" color="success.main" fontWeight="600">
                  +{trend}%
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </AnimatedCard>
    </Grow>
  );
};

const ProgressCard = ({ title, completed, total, color, icon }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <AnimatedCard
      variant="glass"
      sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={2} 
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          <Avatar 
            sx={{ 
              bgcolor: color, 
              width: { xs: 36, sm: 40 }, 
              height: { xs: 36, sm: 40 } 
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              fontWeight="600"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {completed} of {total} completed
            </Typography>
          </Box>
          <Chip
            label={`${percentage}%`}
            size={isMobile ? "small" : "medium"}
            sx={{
              bgcolor: `${color}20`,
              color: color,
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
            }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: { xs: 6, sm: 8 },
            borderRadius: 4,
            bgcolor: `${color}10`,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              bgcolor: color,
            },
          }}
        />
      </CardContent>
    </AnimatedCard>
  );
};

const Dashboard = () => {
  const { stats, fetchStats, loading } = useTasks();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.profile?.firstName || 'User';
    let greeting = 'Hello';
    let emoji = '👋';
    
    if (hour < 12) {
      greeting = 'Good Morning';
      emoji = '🌅';
    } else if (hour < 18) {
      greeting = 'Good Afternoon';
      emoji = '☀️';
    } else {
      greeting = 'Good Evening';
      emoji = '🌙';
    }
    
    return { greeting, firstName, emoji };
  };

  if (loading && !stats) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <SkeletonCard lines={2} />
            </Grid>
          ))}
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={6} key={index + 4}>
              <SkeletonCard lines={3} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  const greetingData = getGreeting();

  const statsData = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: <Assignment />,
      color: '#14b8a6',
      subtitle: 'All time',
      trend: 12,
    },
    {
      title: 'Completed',
      value: stats?.completedTasks || 0,
      icon: <CheckCircle />,
      color: '#10b981',
      subtitle: 'Finished tasks',
      trend: 8,
    },
    {
      title: 'In Progress',
      value: stats?.pendingTasks || 0,
      icon: <PlayArrow />,
      color: '#f59e0b',
      subtitle: 'Active tasks',
    },
    {
      title: 'Overdue',
      value: stats?.overdueTasks || 0,
      icon: <Warning />,
      color: '#ef4444',
      subtitle: 'Need attention',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Fade in={true} timeout={600}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {greetingData.greeting}, {greetingData.firstName}! {greetingData.emoji}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Here's what's happening with your tasks today
              </Typography>
            </Box>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                p: { xs: 1, sm: 1.5 },
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'action.disabled' },
              }}
            >
              <Refresh 
                sx={{ 
                  transform: refreshing ? 'rotate(360deg)' : 'none', 
                  transition: 'transform 1s',
                  fontSize: { xs: 20, sm: 24 },
                }} 
              />
            </IconButton>
          </Stack>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard {...stat} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Featured Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={true} timeout={800}>
            <AnimatedCard
              variant="glass"
              sx={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                minHeight: { xs: 120, sm: 140 },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={{ xs: 1.5, sm: 2 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: { xs: 40, sm: 48 }, 
                      height: { xs: 40, sm: 48 } 
                    }}
                  >
                    <Today />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight="600"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Due Today
                    </Typography>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        lineHeight: 1,
                      }}
                    >
                      {stats?.dueToday || 0}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      Tasks requiring attention
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: -15, sm: -20 },
                  right: { xs: -15, sm: -20 },
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }}
              />
            </AnimatedCard>
          </Slide>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Slide direction="left" in={true} timeout={1000}>
            <AnimatedCard
              variant="glass"
              sx={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                minHeight: { xs: 120, sm: 140 },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={{ xs: 1.5, sm: 2 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: { xs: 40, sm: 48 }, 
                      height: { xs: 40, sm: 48 } 
                    }}
                  >
                    <Upcoming />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight="600"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Upcoming
                    </Typography>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        lineHeight: 1,
                      }}
                    >
                      {stats?.upcomingTasks || 0}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      Future scheduled tasks
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: -15, sm: -20 },
                  right: { xs: -15, sm: -20 },
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }}
              />
            </AnimatedCard>
          </Slide>
        </Grid>
      </Grid>

      {/* Progress Overview */}
      <Fade in={true} timeout={1200}>
        <Box>
          <Typography 
            variant="h5" 
            fontWeight="600" 
            gutterBottom 
            sx={{ 
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Progress Overview
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <ProgressCard
                title="Task Completion"
                completed={stats?.completedTasks || 0}
                total={stats?.totalTasks || 0}
                color="#10b981"
                icon={<CheckCircle />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProgressCard
                title="On Schedule"
                completed={(stats?.totalTasks || 0) - (stats?.overdueTasks || 0)}
                total={stats?.totalTasks || 0}
                color="#14b8a6"
                icon={<Schedule />}
              />
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard;
