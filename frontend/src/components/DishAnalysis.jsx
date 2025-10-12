/**
 * DishAnalysis Component
 * Displays identified dishes with confidence scores and details
 */

import { Grid, Card, CardContent, CardMedia, Typography, Chip, Box, LinearProgress, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { motion } from 'framer-motion';

function DishAnalysis({ identifiedDishes, onSelectDish, selectedDishIds = [] }) {
  if (!identifiedDishes || identifiedDishes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No dishes identified yet. Upload an image to get started!
        </Typography>
      </Box>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return 'success';
    if (confidence >= 0.5) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Identified Dishes ({identifiedDishes.length})
      </Typography>

      <Grid container spacing={3}>
        {identifiedDishes.map((item, index) => {
          const dish = item.dish;
          const isSelected = selectedDishIds.includes(dish._id);

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isSelected ? 2 : 0,
                  borderColor: 'primary.main'
                }}
              >
                {dish.imageUrl && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={dish.imageUrl}
                    alt={dish.name}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {dish.name}
                  </Typography>
                  
                  {dish.chineseName && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {dish.chineseName}
                    </Typography>
                  )}

                  <Box sx={{ my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Confidence</Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {Math.round(item.confidence * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.confidence * 100}
                      color={getConfidenceColor(item.confidence)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={dish.category} size="small" color="primary" />
                    {dish.characteristics?.isVegetarian && (
                      <Chip label="Vegetarian" size="small" color="success" />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {dish.nutrition.calories} cal • {dish.nutrition.protein}g protein
                  </Typography>

                  <Typography variant="body2" fontWeight="bold" color="primary">
                    ${dish.averagePrice.toFixed(2)}
                  </Typography>

                  <Button
                    fullWidth
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => onSelectDish(dish)}
                    startIcon={isSelected ? <CheckCircleIcon /> : <AddCircleIcon />}
                    sx={{ mt: 2 }}
                  >
                    {isSelected ? 'Selected' : 'Add to Meal'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default DishAnalysis;

