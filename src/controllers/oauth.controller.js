import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleAuth = async (req, res) => {
  try {
    const { role, callback } = req.query;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const BACKEND_URL = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const GOOGLE_REDIRECT_URI = `${BACKEND_URL}/api/v1/auth/google/callback`;
    
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, error: 'Google OAuth not configured' });
    }

    // Crear URL de autenticación de Google
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    
    const state = Buffer.from(JSON.stringify({ role, callback })).toString('base64');
    googleAuthUrl.searchParams.append('state', state);

    res.redirect(googleAuthUrl.toString());
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, error: 'Failed to initiate Google authentication' });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.joltcab.com';

    if (error || !code || !state) {
      return res.redirect(`${FRONTEND_URL}/Admin?error=${error || 'missing_code'}`);
    }

    const { role, callback } = JSON.parse(Buffer.from(state, 'base64').toString());
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const BACKEND_URL = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const GOOGLE_REDIRECT_URI = `${BACKEND_URL}/api/v1/auth/google/callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      return res.redirect(`${FRONTEND_URL}/Admin?error=token_exchange_failed`);
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userInfoResponse.json();
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        email: googleUser.email,
        first_name: googleUser.given_name || 'User',
        last_name: googleUser.family_name || 'OAuth',
        user_type: role === 'admin' ? 1 : 7,
        login_by: 'google',
        picture: googleUser.picture || '',
        is_approved: true,
      });
    } else {
      user.login_by = 'google';
      user.picture = googleUser.picture || user.picture;
      await user.save();
    }

    if (role === 'admin' && user.user_type !== 1) {
      return res.redirect(`${FRONTEND_URL}/Admin?error=not_admin`);
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const redirectUrl = new URL(callback || '/GoogleCallback', FRONTEND_URL);
    redirectUrl.searchParams.append('token', token);
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.joltcab.com';
    res.redirect(`${FRONTEND_URL}/Admin?error=auth_failed`);
  }
};

export default { googleAuth, googleCallback };
