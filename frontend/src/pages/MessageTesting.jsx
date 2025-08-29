import { MessagePreview } from '../components/UI';
import { Container } from '@mui/material';

const MessageTesting = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <MessagePreview />
    </Container>
  );
};

export default MessageTesting;
