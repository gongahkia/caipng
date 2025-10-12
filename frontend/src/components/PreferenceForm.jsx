/**
 * PreferenceForm Component
 * User dietary and nutritional preferences input form
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
  Slider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useApp } from '../context/AppContext';

function PreferenceForm({ onSave }) {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      halal: false
    },
    nutritionalGoals: {
      goalType: 'balanced',
      dailyCalorieTarget: 2000,
      proteinTarget: 50,
      carbTarget: 250,
      fatTarget: 65
    },
    budgetPreferences: {
      maxPricePerMeal: 10,
      preferBudgetOptions: false
    },
    tastePreferences: {
      maxSpicyLevel: 5,
      preferredCategories: [],
      dislikedIngredients: []
    },
    healthPriorities: {
      prioritizeHighProtein: false,
      prioritizeLowCalorie: false,
      prioritizeLowSodium: false,
      prioritizeHighFiber: false
    },
    mealComposition: {
      preferredVegetableCount: 2,
      preferredProteinCount: 1,
      includeStarch: true
    }
  });

  useEffect(() => {
    if (state.preferences) {
      setFormData(state.preferences);
    }
  }, [state.preferences]);

  const handleDietaryChange = (event) => {
    setFormData({
      ...formData,
      dietaryRestrictions: {
        ...formData.dietaryRestrictions,
        [event.target.name]: event.target.checked
      }
    });
  };

  const handleHealthPriorityChange = (event) => {
    setFormData({
      ...formData,
      healthPriorities: {
        ...formData.healthPriorities,
        [event.target.name]: event.target.checked
      }
    });
  };

  const handleNutritionalGoalChange = (field, value) => {
    setFormData({
      ...formData,
      nutritionalGoals: {
        ...formData.nutritionalGoals,
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Dietary Restrictions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dietary Restrictions
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.dietaryRestrictions.vegetarian}
                      onChange={handleDietaryChange}
                      name="vegetarian"
                    />
                  }
                  label="Vegetarian"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.dietaryRestrictions.vegan}
                      onChange={handleDietaryChange}
                      name="vegan"
                    />
                  }
                  label="Vegan"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.dietaryRestrictions.glutenFree}
                      onChange={handleDietaryChange}
                      name="glutenFree"
                    />
                  }
                  label="Gluten-Free"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.dietaryRestrictions.halal}
                      onChange={handleDietaryChange}
                      name="halal"
                    />
                  }
                  label="Halal"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Priorities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Priorities
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.healthPriorities.prioritizeHighProtein}
                      onChange={handleHealthPriorityChange}
                      name="prioritizeHighProtein"
                    />
                  }
                  label="High Protein"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.healthPriorities.prioritizeLowCalorie}
                      onChange={handleHealthPriorityChange}
                      name="prioritizeLowCalorie"
                    />
                  }
                  label="Low Calorie"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.healthPriorities.prioritizeLowSodium}
                      onChange={handleHealthPriorityChange}
                      name="prioritizeLowSodium"
                    />
                  }
                  label="Low Sodium"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.healthPriorities.prioritizeHighFiber}
                      onChange={handleHealthPriorityChange}
                      name="prioritizeHighFiber"
                    />
                  }
                  label="High Fiber"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Nutritional Goals */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nutritional Goals
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel>Goal Type</FormLabel>
                    <Select
                      value={formData.nutritionalGoals.goalType}
                      onChange={(e) => handleNutritionalGoalChange('goalType', e.target.value)}
                    >
                      <MenuItem value="weight-loss">Weight Loss</MenuItem>
                      <MenuItem value="muscle-gain">Muscle Gain</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="balanced">Balanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Daily Calorie Target"
                    type="number"
                    value={formData.nutritionalGoals.dailyCalorieTarget}
                    onChange={(e) => handleNutritionalGoalChange('dailyCalorieTarget', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1000, max: 5000 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Protein Target (g)"
                    type="number"
                    value={formData.nutritionalGoals.proteinTarget}
                    onChange={(e) => handleNutritionalGoalChange('proteinTarget', parseInt(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Carb Target (g)"
                    type="number"
                    value={formData.nutritionalGoals.carbTarget}
                    onChange={(e) => handleNutritionalGoalChange('carbTarget', parseInt(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Fat Target (g)"
                    type="number"
                    value={formData.nutritionalGoals.fatTarget}
                    onChange={(e) => handleNutritionalGoalChange('fatTarget', parseInt(e.target.value))}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget & Meal Composition */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Budget
              </Typography>
              <TextField
                fullWidth
                label="Max Price Per Meal ($)"
                type="number"
                value={formData.budgetPreferences.maxPricePerMeal}
                onChange={(e) => setFormData({
                  ...formData,
                  budgetPreferences: {
                    ...formData.budgetPreferences,
                    maxPricePerMeal: parseFloat(e.target.value)
                  }
                })}
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meal Composition
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Vegetables: {formData.mealComposition.preferredVegetableCount}</Typography>
                <Slider
                  value={formData.mealComposition.preferredVegetableCount}
                  onChange={(e, value) => setFormData({
                    ...formData,
                    mealComposition: {
                      ...formData.mealComposition,
                      preferredVegetableCount: value
                    }
                  })}
                  min={0}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              <Box>
                <Typography gutterBottom>Proteins: {formData.mealComposition.preferredProteinCount}</Typography>
                <Slider
                  value={formData.mealComposition.preferredProteinCount}
                  onChange={(e, value) => setFormData({
                    ...formData,
                    mealComposition: {
                      ...formData.mealComposition,
                      preferredProteinCount: value
                    }
                  })}
                  min={0}
                  max={3}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            fullWidth
          >
            Save Preferences
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PreferenceForm;

