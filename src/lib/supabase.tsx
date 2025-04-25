import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABSE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anonymous Key is not set in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to store QuickBooks token data in Supabase
interface QuickBooksTokenData {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresIn: number;
  clientName: string;
  updatedDate: string;
}

export async function storeQuickBooksToken(tokenData: QuickBooksTokenData) {
  const TABLE_NAME = 'qbo_tokens';

  // --- Data Preparation ---
  let realmIdAsNumber: number | null = null;
  try {
    realmIdAsNumber = Number(tokenData.realmId);
    if (isNaN(realmIdAsNumber)) {
        throw new Error("realmId could not be parsed to a number");
    }
  } catch(e) {
      console.error("Error parsing realmId:", tokenData.realmId, e);
      throw new Error("Invalid realmId format.");
  }

  const dataToUpsert = {
    access_token: tokenData.accessToken,
    refresh_token: tokenData.refreshToken,
    realm_id: realmIdAsNumber, 
    expires_in: tokenData.expiresIn,
    client_name: tokenData.clientName,
    updated_date: tokenData.updatedDate 
  };
  // --- End Data Preparation ---

  try {
    console.log(`Attempting to upsert data for client: ${tokenData.clientName}`);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(dataToUpsert, {
        onConflict: 'realm_id',
      })
      .select();
    console.log(data);

    if (error) {
      console.error(`Error upserting data into ${TABLE_NAME} for client ${tokenData.clientName}:`, error);
      throw new Error(`Failed to store/update QuickBooks token: ${error.message}`);
    }

    if (data && data.length > 0) {
        console.log(`Data upserted successfully into ${TABLE_NAME} for client ${tokenData.clientName}:`, data[0]);
        return data[0]; 
    } else {
        console.warn(`Upsert successful for client ${tokenData.clientName}, but no data returned. Check RLS select policies.`);
        return null;
    }

  } catch (error) {
    console.error('An unexpected error occurred during token storage/update:', error);
    throw error;
  }
}
