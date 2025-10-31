import express from 'express';
import {
  getCities,
  getCity,
  getCitiesByCountry,
  createCity,
  updateCity,
  deleteCity,
  searchCities,
} from '../controllers/city.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCities);
router.get('/search', searchCities);
router.get('/country/:countryId', getCitiesByCountry);
router.get('/:id', getCity);
router.post('/', protect, createCity);
router.put('/:id', protect, updateCity);
router.delete('/:id', protect, deleteCity);

export default router;
