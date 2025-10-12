/**
 * AnalyzePage Component
 * Main page for image upload and dish analysis
 */

import { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import DishAnalysis from '../components/DishAnalysis';
import NutritionSummary from '../components/NutritionSummary';
import { analysisAPI } from '../api/api';
import { useApp } from '../context/AppContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function AnalyzePage() {
  const { state, setAnalyzedDishes, addSelectedDish, removeSelectedDish } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleImageRemove = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analysisAPI.analyzeImage(selectedFile);
      
      if (response.data.success) {
        setAnalysisResult(response.data.data);
        setAnalyzedDishes(response.data.data.identifiedDishes);
        toast.success(`Identified ${response.data.data.identifiedDishes.length} dishes!`);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDish = (dish) => {
    const isSelected = state.selectedDishes.find(d => d._id === dish._id);
    if (isSelected) {
      removeSelectedDish(dish._id);
      toast.info(`Removed ${dish.name}`);
    } else {
      addSelectedDish(dish);
      toast.success(`Added ${dish.name}`);
    }
  };

  const selectedDishIds = state.selectedDishes.map(d => d._id);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analyze Your Dish
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload a photo of your cai fan to identify dishes and get nutritional information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Image Upload Section */}
      <Box sx={{ mb: 4 }}>
        <ImageUpload
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          loading={loading}
        />

        {selectedFile && !analysisResult && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAnalyze}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Analysis Results */}
      {analysisResult && analysisResult.identifiedDishes && (
        <Box sx={{ mb: 4 }}>
          <DishAnalysis
            identifiedDishes={analysisResult.identifiedDishes}
            onSelectDish={handleSelectDish}
            selectedDishIds={selectedDishIds}
          />
        </Box>
      )}

      {/* Nutritional Summary */}
      {state.selectedDishes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <NutritionSummary
            dishes={state.selectedDishes}
            preferences={state.preferences}
          />
        </Box>
      )}
    </Box>
  );
}

export default AnalyzePage;

