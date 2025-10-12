/**
 * NutritionSummary Component
 * Displays nutritional breakdown with charts
 */

import { Box, Card, CardContent, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function NutritionSummary({ dishes = [], preferences = null }) {
  // Calculate totals
  const totals = dishes.reduce((acc, dish) => ({
    calories: acc.calories + (dish.nutrition?.calories || 0),
    protein: acc.protein + (dish.nutrition?.protein || 0),
    carbs: acc.carbs + (dish.nutrition?.carbohydrates || 0),
    fat: acc.fat + (dish.nutrition?.fat || 0),
    fiber: acc.fiber + (dish.nutrition?.fiber || 0),
    price: acc.price + (dish.averagePrice || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, price: 0 });

  // Macro distribution data for doughnut chart
  const macroData = {
    labels: ['Protein', 'Carbohydrates', 'Fat'],
    datasets: [{
      data: [
        totals.protein * 4, // 4 cal per gram
        totals.carbs * 4,
        totals.fat * 9 // 9 cal per gram
      ],
      backgroundColor: [
        '#ff6b35',
        '#f7931e',
        '#4ecdc4'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Bar chart data
  const barData = {
    labels: ['Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)'],
    datasets: [{
      label: 'Your Meal',
      data: [totals.calories, totals.protein, totals.carbs, totals.fat, totals.fiber],
      backgroundColor: '#ff6b35'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Calculate progress towards goals
  const getProgress = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  if (dishes.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Select dishes to see nutritional summary
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Nutritional Summary
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Math.round(totals.calories)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Math.round(totals.protein)}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Protein
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Math.round(totals.carbs)}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Carbs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      ${totals.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Cost
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Macro Distribution
              </Typography>
              <Box sx={{ height: 250 }}>
                <Doughnut data={macroData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nutritional Breakdown
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar data={barData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Goals Progress */}
        {preferences && preferences.nutritionalGoals && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progress Towards Goals
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" gutterBottom>
                      Calories: {Math.round(totals.calories)} / {preferences.nutritionalGoals.dailyCalorieTarget / 3}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(totals.calories, preferences.nutritionalGoals.dailyCalorieTarget / 3)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" gutterBottom>
                      Protein: {Math.round(totals.protein)}g / {preferences.nutritionalGoals.proteinTarget / 3}g
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(totals.protein, preferences.nutritionalGoals.proteinTarget / 3)}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" gutterBottom>
                      Carbs: {Math.round(totals.carbs)}g / {preferences.nutritionalGoals.carbTarget / 3}g
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(totals.carbs, preferences.nutritionalGoals.carbTarget / 3)}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" gutterBottom>
                      Fat: {Math.round(totals.fat)}g / {preferences.nutritionalGoals.fatTarget / 3}g
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(totals.fat, preferences.nutritionalGoals.fatTarget / 3)}
                      color="error"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Dish List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selected Dishes ({dishes.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dishes.map((dish, index) => (
                  <Chip
                    key={index}
                    label={`${dish.name} (${dish.nutrition.calories} cal)`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NutritionSummary;

