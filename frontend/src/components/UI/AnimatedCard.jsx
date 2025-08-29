import { Card, Fade, Grow, Slide } from '@mui/material';
import { forwardRef } from 'react';

const AnimatedCard = forwardRef(({
  children,
  animation = 'fade',
  timeout = 600,
  delay = 0,
  hover = true,
  variant = 'glass', // glass, dark, light, accent
  ...props
}, ref) => {
  const getAnimation = () => {
    switch (animation) {
      case 'grow':
        return Grow;
      case 'slide':
        return Slide;
      case 'fade':
      default:
        return Fade;
    }
  };

  const AnimationComponent = getAnimation();

  const getGlassVariant = () => {
    switch (variant) {
      case 'dark':
        return {
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        };
      case 'light':
        return {
          background: 'rgba(51, 65, 85, 0.3)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        };
      case 'accent':
        return {
          background: 'rgba(20, 184, 166, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)',
        };
      case 'glass':
      default:
        return {
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(20, 184, 166, 0.1)',
        };
    }
  };

  const cardStyles = {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: hover ? 'pointer' : 'default',
    ...getGlassVariant(),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      pointerEvents: 'none',
      borderRadius: 'inherit',
    },
    ...(hover && {
      '&:hover': {
        transform: 'translateY(-4px) scale(1.01)',
        borderColor: variant === 'accent' ? 'rgba(20, 184, 166, 0.3)' : 'rgba(255, 255, 255, 0.2)',
        boxShadow: variant === 'accent' 
          ? '0 12px 48px rgba(20, 184, 166, 0.25), 0 8px 24px rgba(0, 0, 0, 0.3)'
          : '0 12px 48px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(20, 184, 166, 0.2)',
        '&::before': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(20,184,166,0.05) 100%)',
        },
      },
    }),
    ...props.sx,
  };

  return (
    <AnimationComponent in={true} timeout={timeout} style={{ transitionDelay: `${delay}ms` }}>
      <Card ref={ref} {...props} sx={cardStyles}>
        {children}
      </Card>
    </AnimationComponent>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;
