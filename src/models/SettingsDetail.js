import mongoose from 'mongoose';

const settingsDetailSchema = new mongoose.Schema({
  // General Settings
  app_name: { type: String, default: '' },
  partner_panel_name: { type: String, default: '' },
  dispatcher_panel_name: { type: String, default: '' },
  hotel_panel_name: { type: String, default: '' },
  
  // Logo URLs
  panel_logo_url: { type: String, default: '' },
  panel_website: { type: String, default: '' },
  panel_favicon_url: { type: String, default: '' },
  panel_application_logo_url: { type: String, default: '' },
  
  // Contact
  panel_email: { type: String, default: '' },
  panel_phone: { type: String, default: '' },
  panel_address: { type: String, default: '' },
  panel_city: { type: String, default: '' },
  panel_zipcode: { type: String, default: '' },
  panel_country_name: { type: String, default: '' },
  panel_country_phone_code: { type: String, default: '' },
  panel_country_code: { type: String, default: '' },
  
  // Admin Settings
  adminCurrencyCode: { type: String, default: '' },
  adminCurrency: { type: String, default: '' },
  adminTimeZone: { type: String, default: '' },
  tax: { type: Number, default: 0 },
  tax_type: { type: String, default: '' },
  adminCommission: { type: Number, default: 0 },
  adminCommissionType: { type: String, default: '' },
  minimum_fare: { type: Number, default: 0 },
  minimum_distance: { type: Number, default: 0 },
  
  // Booking Settings
  push_notification: { type: Boolean, default: true },
  default_Search_radious: { type: Number, default: 100 },
  scheduled_request_pre_start_minute: { type: Number, default: 30 },
  provider_timeout: { type: Number, default: 60 },
  
  // Google Keys
  android_user_app_gcm_key: { type: String, default: '' },
  android_provider_app_gcm_key: { type: String, default: '' },
  android_user_app_google_key: { type: String, default: '' },
  android_provider_app_google_key: { type: String, default: '' },
  ios_user_app_google_key: { type: String, default: '' },
  ios_provider_app_google_key: { type: String, default: '' },
  web_app_google_key: { type: String, default: '' },
  road_api_google_key: { type: String, default: '' },
  google_map_lic_key: { type: String, default: '' },
  is_google_map_lic_key_expired: { type: Number, default: 0 },
  
  // Mapbox Keys
  mapbox_access_token: { type: String, default: '' },
  mapbox_secret_key: { type: String, default: '' },
  is_mapbox_enabled: { type: Boolean, default: false },
  
  // Map Provider Configuration
  default_map_provider: { type: String, enum: ['mapbox', 'google', ''], default: '' },
  map_providers: {
    mapbox: {
      enabled: { type: Boolean, default: false },
      access_token: { type: String, default: '' },
      secret_key: { type: String, default: '' },
    },
    google: {
      enabled: { type: Boolean, default: false },
      api_key: { type: String, default: '' },
    },
  },
  
  // Payment Settings
  stripe_secret_key: { type: String, default: '' },
  stripe_publishable_key: { type: String, default: '' },
  
  // SMS Settings
  twilio_account_sid: { type: String, default: '' },
  twilio_auth_token: { type: String, default: '' },
  twilio_phone_number: { type: String, default: '' },
  
  // Email Settings
  smtp_host: { type: String, default: '' },
  smtp_port: { type: Number, default: 587 },
  smtp_user: { type: String, default: '' },
  smtp_password: { type: String, default: '' },
  smtp_from_email: { type: String, default: '' },
  smtp_from_name: { type: String, default: '' },
  
  // Social Media
  facebook_url: { type: String, default: '' },
  twitter_url: { type: String, default: '' },
  instagram_url: { type: String, default: '' },
  linkedin_url: { type: String, default: '' },
  
  // Terms & Privacy
  terms_and_conditions: { type: String, default: '' },
  privacy_policy: { type: String, default: '' },
  
}, {
  timestamps: true,
});

export const SettingsDetail = mongoose.model('settings', settingsDetailSchema);
export default SettingsDetail;