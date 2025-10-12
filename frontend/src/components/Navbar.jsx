/**
 * Navbar Component
 * Main navigation bar with links and branding
 */

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RecommendIcon from '@mui/icons-material/Recommend';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function Navbar() {
  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            cAI-png
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              component={RouterLink}
              to="/analyze"
              color="inherit"
              startIcon={<CameraAltIcon />}
            >
              Analyze
            </Button>
            <Button
              component={RouterLink}
              to="/recommendations"
              color="inherit"
              startIcon={<RecommendIcon />}
            >
              Recommendations
            </Button>
            <Button
              component={RouterLink}
              to="/dishes"
              color="inherit"
              startIcon={<MenuBookIcon />}
            >
              Dishes
            </Button>
            <Button
              component={RouterLink}
              to="/preferences"
              color="inherit"
              startIcon={<SettingsIcon />}
            >
              Preferences
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

