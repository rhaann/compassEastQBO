import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthorizationUrl } from '../../../lib/quickbook';
import { oauthClient } from '../../../lib/quickbook';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const authUri = getAuthorizationUrl();
    res.status(200).json({ authUri });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
}

export async function callbackHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    // Exchange the authorization code for tokens
    const authResponse = await oauthClient.createToken(req.url);
    const tokens = authResponse.getJson();
    
    res.setHeader('Set-Cookie', [
      `qb_access_token=${tokens.access_token}; Path=/; HttpOnly; SameSite=Strict`,
      `qb_refresh_token=${tokens.refresh_token}; Path=/; HttpOnly; SameSite=Strict`,
      `qb_realm_id=${tokens.realmId}; Path=/; HttpOnly; SameSite=Strict`,
    ]);

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: 'Failed to complete OAuth flow' });
  }
} 