import { Box, Button, Stack, Typography } from '@mui/material';

function App() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" component="h1">
          CanonWeaver
        </Typography>
        <Button variant="contained" size="large">
          Get Started
        </Button>
      </Stack>
    </Box>
  );
}

export default App;
