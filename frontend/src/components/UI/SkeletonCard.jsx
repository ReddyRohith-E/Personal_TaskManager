import { Card, CardContent, Skeleton, Box, Stack } from '@mui/material';

const SkeletonCard = ({ lines = 3, avatar = false, actions = false, height = 'auto' }) => {
  return (
    <Card sx={{ height, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {avatar && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Stack>
          )}
          
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              width={index === lines - 1 ? '60%' : '100%'}
              height={20}
            />
          ))}
          
          {actions && (
            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              <Skeleton variant="rounded" width={80} height={32} />
              <Skeleton variant="rounded" width={80} height={32} />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
