import constants from '../constants/constants.json' assert { type: 'json' };
import { SettingsDetail } from '../models/SettingsDetail.js';

// Get settings (siempre hay solo un documento)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SettingsDetail.findOne();
    
    // Si no existe, crear uno por defecto
    if (!settings) {
      settings = await SettingsDetail.create({
        app_name: constants.APP_NAME,
        partner_panel_name: constants.PARTNER_PANEL_NAME,
        dispatcher_panel_name: constants.DISPATCHER_PANEL_NAME,
        hotel_panel_name: constants.HOTEL_PANEL_NAME,
      });
    }

    res.json({
      success: true,
        data: {
        settings: settings.toObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update settings
export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    
    let settings = await SettingsDetail.findOne();
    
    if (!settings) {
      settings = await SettingsDetail.create(updates);
    } else {
      // Actualizar solo los campos enviados
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null) {
          settings[key] = updates[key];
        }
      });
      await settings.save();
    }

    // Convert to plain object to avoid circular references
    const settingsObject = settings.toObject();

    res.json({
      success: true,
      data: {
    settings: settingsObject,  // ← Agregar el wrapper "settings"
  },
  message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    next(error);
  }
};

// Get constants
export const getConstants = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        constants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Set default map provider
export const setDefaultMapProvider = async (req, res, next) => {
  try {
    const { provider } = req.body; // 'mapbox' or 'google'
    
    if (!['mapbox', 'google'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid provider. Must be "mapbox" or "google"',
      });
    }
    
    let settings = await SettingsDetail.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found',
      });
    }
    
    settings.default_map_provider = provider;
    
    // Enable the selected provider and disable the other
    if (provider === 'mapbox') {
      settings.is_mapbox_enabled = true;
      if (settings.map_providers) {
        settings.map_providers.mapbox.enabled = true;
        settings.map_providers.google.enabled = false;
      }
    } else if (provider === 'google') {
      settings.is_mapbox_enabled = false;
      if (settings.map_providers) {
        settings.map_providers.google.enabled = true;
        settings.map_providers.mapbox.enabled = false;
      }
    }
    
    await settings.save();
    
    res.json({
      success: true,
      data: settings.toObject(),
      message: `${provider} set as default map provider`,
    });
  } catch (error) {
    console.error('Error setting default map provider:', error);
    next(error);
  }
};

// Initialize default settings
export const initializeSettings = async (req, res, next) => {
  try {
    let settings = await SettingsDetail.findOne();
    
    if (settings) {
      return res.json({
        success: true,
        message: 'Settings already initialized',
        data: { settings },
      });
    }

    settings = await SettingsDetail.create({
      app_name: constants.APP_NAME,
      partner_panel_name: constants.PARTNER_PANEL_NAME,
      dispatcher_panel_name: constants.DISPATCHER_PANEL_NAME,
      hotel_panel_name: constants.HOTEL_PANEL_NAME,
      adminCurrencyCode: 'USD',
      adminCurrency: '$',
      adminTimeZone: 'America/New_York',
      push_notification: true,
      default_Search_radious: 100,
      scheduled_request_pre_start_minute: 30,
      provider_timeout: 60,
    });

    res.json({
      success: true,
      message: 'Settings initialized successfully',
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSettings,
  updateSettings,
  getConstants,
  setDefaultMapProvider,
  initializeSettings,
};