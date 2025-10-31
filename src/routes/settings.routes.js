import express from 'express';
import {
  getConstants,
  getSettings,
  initializeSettings,
  setDefaultMapProvider,
  updateSettings,
} from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.js';
import { getConfigStatus } from '../middleware/validateConfig.js';

const router = express.Router();

// Public routes
router.get('/constants', getConstants);
router.get('/config-status', getConfigStatus);

// Protected routes
router.use(protect);
router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/initialize', initializeSettings);
router.post('/map-provider', setDefaultMapProvider);

export default router;