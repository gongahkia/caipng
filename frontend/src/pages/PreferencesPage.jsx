/**
 * PreferencesPage Component
 * User preferences management
 */

import { Box, Typography, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import PreferenceForm from '../components/PreferenceForm';
import { preferencesAPI } from '../api/api';
import { useApp } from '../context/AppContext';

function PreferencesPage() {
  const { setPreferences } = useApp();

  const handleSavePreferences = async (formData) => {
    try {
      const response = await preferencesAPI.setPreferences(formData);

      if (response.data.success) {
        setPreferences(formData);
        toast.success('Preferences saved successfully!');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (err) {
      console.error('Save preferences error:', err);
      
      // Save locally even if API call fails
      setPreferences(formData);
      toast.info('Preferences saved locally');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Preferences
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Set your dietary restrictions, nutritional goals, and meal preferences to get personalized recommendations
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        These preferences will be used to generate personalized meal recommendations that match your dietary needs and goals.
      </Alert>

      <PreferenceForm onSave={handleSavePreferences} />
    </Box>
  );
}

export default PreferencesPage;

