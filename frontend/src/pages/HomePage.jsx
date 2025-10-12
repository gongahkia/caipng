/**
 * HomePage Component
 * Landing page with overview and features
 */

import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RecommendIcon from '@mui/icons-material/Recommend';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function HomePage() {
  const features = [
    {
      icon: <CameraAltIcon sx={{ fontSize: 48 }} />,
      title: 'Image Analysis',
      description: 'Upload photos of cai fan dishes and let AI identify them with confidence scores',
      link: '/analyze'
    },
    {
      icon: <RecommendIcon sx={{ fontSize: 48 }} />,
      title: 'Smart Recommendations',
      description: 'Get personalized meal combinations based on your dietary preferences and goals',
      link: '/recommendations'
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 48 }} />,
      title: 'Custom Preferences',
      description: 'Set your dietary restrictions, nutritional goals, and budget preferences',
      link: '/preferences'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 48 }} />,
      title: 'Dish Database',
      description: 'Browse our extensive database of 50+ common cai fan dishes with nutritional info',
      link: '/dishes'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white',
          borderRadius: 4,
          mb: 6
        }}
      >
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          cAI-png 🍱
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Your AI-Powered Cai Fan Companion
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Analyze dishes, get personalized recommendations, and make healthier choices for your cai fan meals
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/analyze"
            variant="contained"
            size="large"
            startIcon={<CameraAltIcon />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Analyzing
          </Button>
          <Button
            component={RouterLink}
            to="/recommendations"
            variant="outlined"
            size="large"
            startIcon={<RecommendIcon />}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Get Recommendations
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Features
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => window.location.href = feature.link}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          p: 4,
          borderRadius: 4,
          mb: 6
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          How It Works
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary" fontWeight="bold">
                1
              </Typography>
              <Typography variant="h6" gutterBottom>
                Upload Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Take or upload a photo of your cai fan dishes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary" fontWeight="bold">
                2
              </Typography>
              <Typography variant="h6" gutterBottom>
                AI Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI identifies dishes and calculates nutrition
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary" fontWeight="bold">
                3
              </Typography>
              <Typography variant="h6" gutterBottom>
                Get Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive personalized meal suggestions based on your goals
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          bgcolor: 'primary.light',
          borderRadius: 4,
          color: 'white'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to optimize your cai fan meals?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Start making healthier and smarter food choices today
        </Typography>
        <Button
          component={RouterLink}
          to="/analyze"
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
        >
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
}

export default HomePage;

