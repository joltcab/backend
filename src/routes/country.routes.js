import express from 'express';
import {
  getCountries,
  getCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  getBusinessCountries,
} from '../controllers/country.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCountries);
router.get('/business', getBusinessCountries);
router.get('/:id', getCountry);

// Protected routes (require authentication)
router.post('/', protect, createCountry);
router.put('/:id', protect, updateCountry);
router.delete('/:id', protect, deleteCountry);

export default router;