/**
 * Footer Component
 */

import { Box, Container, Typography, Link } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          Made with <FavoriteIcon sx={{ fontSize: 16, color: 'error.main', verticalAlign: 'middle' }} /> for cai fan lovers
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} cAI-png - Smart Dish Recommendations
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;

