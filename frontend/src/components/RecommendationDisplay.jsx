/**
 * RecommendationDisplay Component
 * Shows recommended meal combinations with scores
 */

import { Grid, Card, CardContent, Typography, Box, Chip, Button, Rating } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { motion } from 'framer-motion';

function RecommendationDisplay({ recommendations, onSelectRecommendation }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No recommendations available. Set your preferences to get personalized suggestions!
        </Typography>
      </Box>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Recommended Meals ({recommendations.length})
      </Typography>

      <Grid container spacing={3}>
        {recommendations.map((recommendation, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Score Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    icon={<ThumbUpIcon />}
                    label={getScoreLabel(recommendation.score)}
                    color={recommendation.score >= 80 ? 'success' : recommendation.score >= 60 ? 'warning' : 'default'}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color={getScoreColor(recommendation.score)}>
                      {Math.round(recommendation.score)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / 100
                    </Typography>
                  </Box>
                </Box>

                {/* Dishes */}
                <Typography variant="h6" gutterBottom>
                  Meal Combination #{index + 1}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {recommendation.dishes.map((dish, dishIndex) => (
                    <Box key={dishIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalDiningIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {dish.name}
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({dish.category})
                        </Typography>
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Nutritional Summary */}
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Calories
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(recommendation.nutritionalSummary.totalCalories)} cal
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Protein
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(recommendation.nutritionalSummary.totalProtein)}g
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Carbs
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(recommendation.nutritionalSummary.totalCarbs)}g
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Fat
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(recommendation.nutritionalSummary.totalFat)}g
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Price */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Price
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${recommendation.estimatedPrice.toFixed(2)}
                  </Typography>
                </Box>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onSelectRecommendation && onSelectRecommendation(recommendation)}
                >
                  Select This Meal
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecommendationDisplay;

