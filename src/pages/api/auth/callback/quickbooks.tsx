import type { NextApiRequest, NextApiResponse } from 'next';
import { oauthClient } from '../../../../lib/quickbook';  
import { storeQuickBooksToken } from '../../../../lib/supabase';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('QuickBooks callback endpoint hit!');
  console.log('Request URL:', req.url);
  
  if (!req.url) {
    console.log('Missing URL in request');
    return res.status(400).json({ error: 'Missing URL' });
  }
  let realmId: string  = "";
  const fullUrl = `http://localhost${req.url}` 

  try {
    const url = new URL(fullUrl); 
    realmId = url.searchParams.get('realmId') || "";
  } catch (e) {
      console.error("Error parsing callback URL:", e);
      return res.status(500).send("Error processing callback URL.");
  }

  try {
    console.log('Attempting to create token with URL');
    // Exchange the authorization code for tokens
    const authResponse = await oauthClient.createToken(req.url);
    console.log('Token creation successful');
    
    const tokens = authResponse.getJson();
    

    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`;
  
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokens.access_token}`
    };

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json(); 
    console.log(data);    

    
   
    storeQuickBooksToken({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      realmId: realmId,
      expiresIn: tokens.expires_in,
      clientName: data.CompanyInfo.CompanyName,
      updatedDate: new Date().toISOString()
    });

    // Set cookies for client-side access
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in * 1000, // Convert seconds to milliseconds
      path: '/',
    };

    // Set the access token cookie
    res.setHeader('Set-Cookie', [
      serialize('qb_access_token', tokens.access_token, cookieOptions),
      serialize('qb_refresh_token', tokens.refresh_token, cookieOptions),
      serialize('qb_realm_id', realmId, cookieOptions)
    ]);

    console.log('Redirecting to dashboard with token info');
    res.redirect(`/dashboard?connected=true`);
   
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    res.status(500).json({ error: 'Failed to complete OAuth flow' });
  }
} 