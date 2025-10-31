import { SettingsDetail } from '../models/SettingsDetail.js';

// Helper para validar si un string tiene contenido válido
const isValidKey = (key) => {
  return key && typeof key === 'string' && key.length > 10 && !key.includes('•');
};

// Verificar si Mapbox está configurado
export const requireMapbox = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    if (!settings || !isValidKey(settings.mapbox_access_token)) {
      return res.status(503).json({
        success: false,
        error: 'Mapbox not configured',
        message: 'Please configure Mapbox access token in settings',
        code: 'MAPBOX_NOT_CONFIGURED',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Verificar si Google Maps está configurado
export const requireGoogleMaps = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    if (!settings || !isValidKey(settings.web_app_google_key)) {
      return res.status(503).json({
        success: false,
        error: 'Google Maps API not configured',
        message: 'Please configure Google Maps API key in settings',
        code: 'GOOGLE_MAPS_NOT_CONFIGURED',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Verificar si Stripe está configurado
export const requireStripe = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    if (!settings || !isValidKey(settings.stripe_secret_key) || !isValidKey(settings.stripe_publishable_key)) {
      return res.status(503).json({
        success: false,
        error: 'Stripe not configured',
        message: 'Please configure Stripe API keys in settings',
        code: 'STRIPE_NOT_CONFIGURED',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Verificar si Twilio está configurado
export const requireTwilio = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    if (!settings || !isValidKey(settings.twilio_account_sid) || !isValidKey(settings.twilio_auth_token)) {
      return res.status(503).json({
        success: false,
        error: 'Twilio not configured',
        message: 'Please configure Twilio credentials in settings',
        code: 'TWILIO_NOT_CONFIGURED',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Verificar si SMTP está configurado
export const requireSMTP = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    if (!settings || !settings.smtp_host || !settings.smtp_port) {
      return res.status(503).json({
        success: false,
        error: 'SMTP not configured',
        message: 'Please configure SMTP settings for email',
        code: 'SMTP_NOT_CONFIGURED',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Verificar configuración general del sistema
export const checkSystemConfig = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    if (!settings) {
      return res.status(503).json({
        success: false,
        error: 'System not configured',
        message: 'Please run the setup wizard to configure the system',
        code: 'SYSTEM_NOT_CONFIGURED',
      });
    }
    
    // Adjuntar settings al request para uso posterior
    req.settings = settings;
    next();
  } catch (error) {
    next(error);
  }
};

// Obtener estado de configuración
export const getConfigStatus = async (req, res, next) => {
  try {
    const settings = await SettingsDetail.findOne();
    
    const status = {
      system_configured: !!settings,
      mapbox: !!(settings && isValidKey(settings.mapbox_access_token)),
      google_maps: !!(settings && isValidKey(settings.web_app_google_key)),
      stripe: !!(settings && isValidKey(settings.stripe_secret_key) && isValidKey(settings.stripe_publishable_key)),
      twilio: !!(settings && isValidKey(settings.twilio_account_sid) && isValidKey(settings.twilio_auth_token)),
      smtp: !!(settings && settings.smtp_host && settings.smtp_port && settings.smtp_user),
      sendgrid: !!(settings && isValidKey(settings.sendgrid_api_key)),
      firebase: !!(settings && settings.firebase_apiKey && settings.firebase_projectId),
      aws_s3: !!(settings && settings.is_use_aws_bucket && settings.aws_bucket_name),
      redis: false, // Redis configuration is handled separately
    };
    
    res.json({
      success: true,
      data: {
        status,
        configured_services: Object.keys(status).filter(key => status[key]),
        missing_services: Object.keys(status).filter(key => !status[key]),
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  requireMapbox,
  requireGoogleMaps,
  requireStripe,
  requireTwilio,
  requireSMTP,
  checkSystemConfig,
  getConfigStatus,
};