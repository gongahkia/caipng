/**
 * ImageUpload Component
 * Drag-and-drop image upload with preview
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, IconButton, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

function ImageUpload({ onImageSelect, onImageRemove, loading = false }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Pass file to parent
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: loading
  });

  const handleRemove = () => {
    setPreview(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  return (
    <Box>
      {!preview ? (
        <Paper
          {...getRootProps()}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.400',
            backgroundColor: isDragActive ? 'primary.light' : 'background.paper',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.light',
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Supported formats: JPEG, PNG, WEBP (Max 10MB)
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            sx={{ p: 2, position: 'relative' }}
          >
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                borderRadius: 2
              }}
            />
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 2
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Paper>
          {!loading && (
            <IconButton
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'error.dark',
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ImageUpload;

