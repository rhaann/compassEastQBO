import OAuthClient from 'intuit-oauth';
import QuickBooks from 'node-quickbooks';

// Define environment variables
const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI!;
const environment = process.env.QUICKBOOKS_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';

// Create OAuth client
export const oauthClient = new OAuthClient({
  clientId,
  clientSecret,
  redirectUri,
  environment,
});

// Function to create QuickBooks client with tokens
export const createQBClient = (
  realmId: string,
  accessToken: string,
  refreshToken: string
): QuickBooks => {
  return new QuickBooks(
    clientId,
    clientSecret,
    accessToken,
    false, // no token secret for OAuth2
    realmId,
    environment === 'sandbox', // use sandbox?
    false, // debug
    null, // minor version
    '2.0', // OAuth version
    refreshToken // refresh token
  );
};

// Function to get authorization URL
export const getAuthorizationUrl = (): string => {
  return oauthClient.authorizeUri({
    scope: [
      OAuthClient.scopes.Accounting,
      OAuthClient.scopes.OpenId,
      OAuthClient.scopes.Profile,
      OAuthClient.scopes.Email,
    ],
    state: 'randomState',
  });
};
