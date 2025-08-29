import { createTheme } from '@mui/material/styles';

// Enhanced dark glass morphism color palette - Better contrast ratios
const colors = {
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  glass: {
    dark: 'rgba(15, 23, 42, 0.6)',
    medium: 'rgba(30, 41, 59, 0.4)',
    light: 'rgba(51, 65, 85, 0.3)',
    accent: 'rgba(20, 184, 166, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// Enhanced dark theme configuration with glass morphism
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400], // Better contrast for dark backgrounds
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300], 
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    accent: {
      main: colors.accent[400],
      light: colors.accent[300],
      dark: colors.accent[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0e1a', // Deeper dark background
      paper: colors.glass.dark, // Glass morphism paper
    },
    surface: {
      main: colors.glass.medium,
      light: colors.glass.light,
      dark: colors.glass.dark,
    },
    text: {
      primary: '#f8fafc', // High contrast white
      secondary: colors.slate[300], // Better contrast secondary text
      hint: colors.slate[400],
    },
    error: {
      main: colors.error[400], // Better visibility in dark
      light: colors.error[300],
      dark: colors.error[600],
      contrastText: '#ffffff',
    },
    warning: {
      main: colors.warning[400],
      light: colors.warning[300],
      dark: colors.warning[600],
      contrastText: '#000000',
    },
    info: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    success: {
      main: colors.success[400],
      light: colors.success[300], 
      dark: colors.success[600],
      contrastText: '#ffffff',
    },
    divider: colors.glass.border,
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(20, 184, 166, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(20, 184, 166, 0.24)',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", "Segoe UI Variable", "Roboto Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFeatureSettings: '"cv11", "ss01"',
    fontVariationSettings: '"opsz" 32, "wght" 400',
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2.5rem, 4vw, 4rem)',
      lineHeight: 1.1,
      letterSpacing: '-0.04em',
      fontVariationSettings: '"opsz" 32, "wght" 700',
      textShadow: '0 4px 20px rgba(20, 184, 166, 0.3)',
    },
    h2: {
      fontWeight: 600,
      fontSize: 'clamp(2rem, 3.5vw, 3rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.03em',
      fontVariationSettings: '"opsz" 32, "wght" 600',
      textShadow: '0 2px 16px rgba(20, 184, 166, 0.2)',
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      fontVariationSettings: '"opsz" 28, "wght" 600',
    },
    h4: {
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontVariationSettings: '"opsz" 24, "wght" 600',
    },
    h5: {
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
      lineHeight: 1.5,
      fontVariationSettings: '"opsz" 20, "wght" 500',
    },
    h6: {
      fontWeight: 500,
      fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
      lineHeight: 1.5,
      fontVariationSettings: '"opsz" 18, "wght" 500',
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      lineHeight: 1.7,
      letterSpacing: '0.005em',
      fontVariationSettings: '"opsz" 16, "wght" 400',
    },
    body2: {
      fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      fontVariationSettings: '"opsz" 14, "wght" 400',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
      letterSpacing: '0.02em',
      fontVariationSettings: '"opsz" 14, "wght" 500',
    },
    caption: {
      fontSize: 'clamp(0.75rem, 1vw, 0.8125rem)',
      lineHeight: 1.66,
      letterSpacing: '0.03em',
      fontVariationSettings: '"opsz" 12, "wght" 400',
    },
    overline: {
      fontSize: 'clamp(0.6875rem, 1vw, 0.75rem)',
      fontWeight: 500,
      lineHeight: 2.66,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontVariationSettings: '"opsz" 12, "wght" 500',
    },
  },
  shape: {
    borderRadius: 20,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    // Glass morphism shadows with teal accent
    `0 8px 32px rgba(20, 184, 166, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)`,
    `0 12px 40px rgba(20, 184, 166, 0.2), 0 6px 20px rgba(0, 0, 0, 0.25)`,
    `0 16px 48px rgba(20, 184, 166, 0.25), 0 8px 24px rgba(0, 0, 0, 0.3)`,
    `0 20px 56px rgba(20, 184, 166, 0.3), 0 10px 28px rgba(0, 0, 0, 0.35)`,
    `0 24px 64px rgba(20, 184, 166, 0.35), 0 12px 32px rgba(0, 0, 0, 0.4)`,
    // Enhanced depth shadows
    '0 4px 20px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    '0 8px 30px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)',
    '0 12px 40px rgba(0, 0, 0, 0.3), 0 6px 16px rgba(0, 0, 0, 0.2)',
    '0 16px 50px rgba(0, 0, 0, 0.35), 0 8px 20px rgba(0, 0, 0, 0.25)',
    '0 20px 60px rgba(0, 0, 0, 0.4), 0 10px 24px rgba(0, 0, 0, 0.3)',
    // Ultra deep shadows for floating elements
    '0 32px 80px rgba(0, 0, 0, 0.45), 0 16px 32px rgba(20, 184, 166, 0.2)',
    '0 40px 100px rgba(0, 0, 0, 0.5), 0 20px 40px rgba(20, 184, 166, 0.25)',
    '0 48px 120px rgba(0, 0, 0, 0.55), 0 24px 48px rgba(20, 184, 166, 0.3)',
    // Extended shadows for higher elevations
    '0 56px 140px rgba(0, 0, 0, 0.6), 0 28px 56px rgba(20, 184, 166, 0.35)',
    '0 64px 160px rgba(0, 0, 0, 0.65), 0 32px 64px rgba(20, 184, 166, 0.4)',
    '0 72px 180px rgba(0, 0, 0, 0.7), 0 36px 72px rgba(20, 184, 166, 0.45)',
    '0 80px 200px rgba(0, 0, 0, 0.75), 0 40px 80px rgba(20, 184, 166, 0.5)',
    '0 88px 220px rgba(0, 0, 0, 0.8), 0 44px 88px rgba(20, 184, 166, 0.55)',
    '0 96px 240px rgba(0, 0, 0, 0.85), 0 48px 96px rgba(20, 184, 166, 0.6)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          '@supports (font-variation-settings: normal)': {
            fontFamily: '"Inter", system-ui, sans-serif',
          },
        },
        body: {
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1e293b 100%)',
          backgroundAttachment: 'fixed',
          scrollbarColor: `${colors.primary[400]} transparent`,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.primary[400],
            borderRadius: 3,
            '&:hover': {
              backgroundColor: colors.primary[300],
            },
          },
        },
        '*': {
          '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.glass.border,
            borderRadius: 3,
            '&:hover': {
              backgroundColor: colors.primary[500],
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
          fontWeight: 500,
          fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
          lineHeight: 1.5,
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            '&::before': {
              opacity: 1,
            },
          },
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          },
          '&.Mui-disabled': {
            background: colors.glass.dark,
            color: colors.slate[500],
            backdropFilter: 'blur(10px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.secondary[400]} 100%)`,
          border: `1px solid ${colors.glass.border}`,
          color: '#ffffff',
          boxShadow: `0 8px 32px rgba(20, 184, 166, 0.3)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary[300]} 0%, ${colors.secondary[300]} 100%)`,
            boxShadow: `0 12px 40px rgba(20, 184, 166, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)`,
          },
        },
        outlined: {
          background: colors.glass.light,
          border: `1px solid ${colors.primary[400]}`,
          color: colors.primary[300],
          backdropFilter: 'blur(20px)',
          '&:hover': {
            background: colors.glass.medium,
            borderColor: colors.primary[300],
            boxShadow: `0 8px 24px rgba(20, 184, 166, 0.2)`,
          },
        },
        text: {
          color: colors.primary[300],
          background: 'transparent',
          '&:hover': {
            background: colors.glass.accent,
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.glass.dark,
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: `1px solid ${colors.glass.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(20, 184, 166, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            pointerEvents: 'none',
          },
          '&:hover': {
            borderColor: colors.primary[400],
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(20, 184, 166, 0.2)',
            transform: 'translateY(-4px) scale(1.01)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: colors.glass.medium,
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: `1px solid ${colors.glass.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            background: colors.glass.light,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.glass.border}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover': {
              borderColor: colors.primary[400],
              background: colors.glass.medium,
              '& fieldset': {
                borderColor: 'transparent',
              },
            },
            '&.Mui-focused': {
              borderColor: colors.primary[400],
              background: colors.glass.medium,
              boxShadow: `0 0 0 3px rgba(20, 184, 166, 0.2)`,
              '& fieldset': {
                borderColor: 'transparent',
              },
            },
            '&.Mui-error': {
              borderColor: colors.error[400],
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.2)`,
              },
            },
          },
          '& .MuiInputBase-input': {
            padding: 'clamp(12px, 2vw, 14px) clamp(14px, 2.5vw, 16px)',
            fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
            color: colors.slate[50],
            '&::placeholder': {
              color: colors.slate[400],
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.slate[400],
            fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
            '&.Mui-focused': {
              color: colors.primary[300],
            },
            '&.Mui-error': {
              color: colors.error[400],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          fontSize: '0.8125rem',
          height: 32,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        colorPrimary: {
          backgroundColor: `${colors.primary[500]}20`,
          color: colors.primary[300],
          border: `1px solid ${colors.primary[500]}30`,
        },
        colorSecondary: {
          backgroundColor: `${colors.secondary[500]}20`,
          color: colors.secondary[300],
          border: `1px solid ${colors.secondary[500]}30`,
        },
        colorError: {
          backgroundColor: `${colors.error[500]}20`,
          color: colors.error[300],
          border: `1px solid ${colors.error[500]}30`,
        },
        colorWarning: {
          backgroundColor: `${colors.warning[500]}20`,
          color: colors.warning[300],
          border: `1px solid ${colors.warning[500]}30`,
        },
        colorSuccess: {
          backgroundColor: `${colors.success[500]}20`,
          color: colors.success[300],
          border: `1px solid ${colors.success[500]}30`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: `${colors.slate[800]}95`,
          backgroundImage: 'none',
          borderBottom: `1px solid ${colors.slate[700]}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.slate[800],
          borderRight: `1px solid ${colors.slate[700]}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundColor: colors.slate[800],
          backgroundImage: 'none',
          border: `1px solid ${colors.slate[700]}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px',
          fontSize: '1.5rem',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 8px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: colors.slate[700],
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          '&:hover': {
            backgroundColor: colors.slate[700],
          },
          '&.Mui-selected': {
            backgroundColor: colors.primary[500],
            '&:hover': {
              backgroundColor: colors.primary[600],
            },
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
            transform: 'scale(1.05) translateY(-2px)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.9375rem',
        },
        standardError: {
          backgroundColor: `${colors.error[500]}15`,
          borderLeft: `4px solid ${colors.error[500]}`,
          color: colors.error[300],
        },
        standardWarning: {
          backgroundColor: `${colors.warning[500]}15`,
          borderLeft: `4px solid ${colors.warning[500]}`,
          color: colors.warning[300],
        },
        standardInfo: {
          backgroundColor: `${colors.primary[500]}15`,
          borderLeft: `4px solid ${colors.primary[500]}`,
          color: colors.primary[300],
        },
        standardSuccess: {
          backgroundColor: `${colors.success[500]}15`,
          borderLeft: `4px solid ${colors.success[500]}`,
          color: colors.success[300],
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: colors.slate[700],
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.slate[700],
          color: colors.slate[100],
          fontSize: '0.8125rem',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
        arrow: {
          color: colors.slate[700],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.slate[700],
        },
      },
    },
  },
});

// Enhanced light theme configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[500],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[600],
      light: colors.secondary[500],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    background: {
      default: colors.gray[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
    },
    error: {
      main: colors.error[600],
      light: colors.error[500],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[600],
      light: colors.warning[500],
      dark: colors.warning[700],
    },
    info: {
      main: colors.primary[600],
      light: colors.primary[500],
      dark: colors.primary[700],
    },
    success: {
      main: colors.success[600],
      light: colors.success[500],
      dark: colors.success[700],
    },
    divider: colors.gray[200],
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: darkTheme.typography,
  shape: darkTheme.shape,
  spacing: darkTheme.spacing,
  breakpoints: darkTheme.breakpoints,
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    `0 8px 32px ${colors.primary[600]}15`,
    `0 12px 40px ${colors.primary[600]}20`,
    `0 16px 48px ${colors.primary[600]}25`,
    `0 20px 56px ${colors.primary[600]}30`,
    `0 24px 64px ${colors.primary[600]}35`,
    `0 32px 80px ${colors.primary[600]}30`,
    `0 40px 96px ${colors.primary[600]}25`,
    `0 48px 112px ${colors.primary[600]}20`,
    '0 4px 20px rgba(0, 0, 0, 0.08)',
    '0 8px 30px rgba(0, 0, 0, 0.06)',
    '0 12px 40px rgba(0, 0, 0, 0.05)',
    '0 16px 50px rgba(0, 0, 0, 0.04)',
    '0 20px 60px rgba(0, 0, 0, 0.03)',
    '0 24px 70px rgba(0, 0, 0, 0.025)',
    '0 32px 90px rgba(0, 0, 0, 0.02)',
    '0 40px 110px rgba(0, 0, 0, 0.015)',
    '0 64px 160px rgba(0, 0, 0, 0.01)',
  ],
  components: {
    ...darkTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...darkTheme.components.MuiCssBaseline.styleOverrides,
        body: {
          scrollbarColor: `${colors.gray[400]} ${colors.gray[200]}`,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: colors.gray[200],
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.gray[400],
            borderRadius: 4,
            '&:hover': {
              backgroundColor: colors.gray[500],
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            borderColor: colors.gray[300],
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: `1px solid ${colors.gray[200]}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            border: `1px solid ${colors.gray[300]}`,
            '&:hover': {
              borderColor: colors.primary[500],
            },
            '&.Mui-focused': {
              borderColor: colors.primary[500],
              boxShadow: `0 0 0 3px ${colors.primary[500]}20`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: `1px solid ${colors.gray[200]}`,
          color: colors.gray[900],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: `1px solid ${colors.gray[200]}`,
        },
      },
    },
  },
});

export { darkTheme, lightTheme, colors };
export default darkTheme;
