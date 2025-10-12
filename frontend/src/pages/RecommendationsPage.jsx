/**
 * RecommendationsPage Component
 * Generates and displays meal recommendations
 */

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import RecommendationDisplay from '../components/RecommendationDisplay';
import NutritionSummary from '../components/NutritionSummary';
import { recommendationAPI } from '../api/api';
import { useApp } from '../context/AppContext';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

function RecommendationsPage() {
  const { state, setRecommendations, clearSelectedDishes } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await recommendationAPI.getRecommendations({
        preferences: state.preferences,
        excludeDishes: state.selectedDishes.map(d => d._id)
      });

      if (response.data.success) {
        setRecommendations(response.data.data);
        toast.success(`Generated ${response.data.data.length} recommendations!`);
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (err) {
      console.error('Recommendation error:', err);
      setError(err.response?.data?.message || 'Failed to generate recommendations. Please try again.');
      toast.error('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecommendation = (recommendation) => {
    clearSelectedDishes();
    recommendation.dishes.forEach(dish => {
      // Add each dish from recommendation to selected dishes
      // This would need to be implemented in the context
    });
    toast.success('Meal selected!');
  };

  // Auto-generate on mount if preferences are set
  useEffect(() => {
    if (state.preferences && state.recommendations.length === 0) {
      handleGenerateRecommendations();
    }
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meal Recommendations
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Get personalized meal combinations based on your preferences and nutritional goals
      </Typography>

      {!state.preferences && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No preferences set. <a href="/preferences">Set your preferences</a> to get personalized recommendations.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleGenerateRecommendations}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
        >
          {loading ? 'Generating...' : 'Generate New Recommendations'}
        </Button>
      </Box>

      {loading && state.recommendations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Analyzing dishes and generating recommendations...
          </Typography>
        </Box>
      ) : (
        <RecommendationDisplay
          recommendations={state.recommendations}
          onSelectRecommendation={handleSelectRecommendation}
        />
      )}
    </Box>
  );
}

export default RecommendationsPage;

