import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABSE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    // Attempt to parse realmId as BigInt first, then fallback to Number if needed, or handle error
    // Supabase client might handle large numbers, but explicit parsing is safer.
    // Using Number directly might lose precision for very large realmIds (int8/bigint)
    // For simplicity here, using Number. If precision issues arise, consider BigInt.
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
        onConflict: 'realm_id', // Changed from 'client_name' to 'realm_id'
      })
      .select(); // Optionally select the upserted data
    console.log(data);
    
    if (error) {
      console.error(`Error upserting data into ${TABLE_NAME} for client ${tokenData.clientName}:`, error);
      // Check for specific error types if needed
      throw new Error(`Failed to store/update QuickBooks token: ${error.message}`);
    }

    // Check if data was returned (indicates successful upsert)
    if (data && data.length > 0) {
        console.log(`Data upserted successfully into ${TABLE_NAME} for client ${tokenData.clientName}:`, data[0]);
        return data[0]; // Return the single upserted record
    } else {
        // This case might occur if RLS prevents returning the row even after upsert
        console.warn(`Upsert successful for client ${tokenData.clientName}, but no data returned. Check RLS select policies.`);
        // Decide how to handle this - return null, or an empty object?
        return null;
    }

  } catch (error) {
    // Catch errors from parsing or the Supabase call
    console.error('An unexpected error occurred during token storage/update:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}