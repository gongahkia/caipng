/**
 * DishesPage Component
 * Browse and search dish database
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { dishesAPI } from '../api/api';

function DishesPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDishes();
  }, [page, categoryFilter]);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...(categoryFilter && { category: categoryFilter })
      };

      const response = await dishesAPI.getAll(params);
      
      if (response.data.success) {
        setDishes(response.data.data);
        setTotalPages(response.data.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDishes();
      return;
    }

    setLoading(true);
    try {
      const response = await dishesAPI.search(searchQuery);
      if (response.data.success) {
        setDishes(response.data.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dish Database
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse our collection of 50+ cai fan dishes with detailed nutritional information
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="vegetable">Vegetables</MenuItem>
            <MenuItem value="protein">Proteins</MenuItem>
            <MenuItem value="starch">Starches</MenuItem>
            <MenuItem value="combination">Combinations</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Dishes Grid */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {dishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} key={dish._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {dish.imageUrl && (
                    <CardMedia
                      component="img"
                      height="180"
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

                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={dish.category} size="small" color="primary" />
                      {dish.characteristics?.isVegetarian && (
                        <Chip label="Veg" size="small" color="success" />
                      )}
                      {dish.characteristics?.spicyLevel > 0 && (
                        <Chip label={`🌶️ ${dish.characteristics.spicyLevel}`} size="small" />
                      )}
                    </Box>

                    {dish.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {dish.description}
                      </Typography>
                    )}

                    <Box sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 2, mb: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Calories
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {dish.nutrition.calories}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Protein
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {dish.nutrition.protein}g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Carbs
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {dish.nutrition.carbohydrates}g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Fat
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {dish.nutrition.fat}g
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        ${dish.averagePrice.toFixed(2)}
                      </Typography>
                      <Chip
                        label={`Health: ${dish.healthScore}`}
                        size="small"
                        color={dish.healthScore >= 70 ? 'success' : dish.healthScore >= 50 ? 'warning' : 'default'}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default DishesPage;

