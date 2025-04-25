declare module 'node-quickbooks' {
    // Interface for expected response structure, replace with actual shape
    interface Account {
      Id: string;
      Name: string;
      AccountType: string;
      AccountSubType: string;
      Active: boolean;
      // Add more properties based on your knowledge of the QuickBooks API
    }
  
    // Interface for customer object (replace with actual fields)
    interface Customer {
      Id: string;
      DisplayName: string;
      PrimaryEmailAddr: {
        Address: string;
      };
      // Add more properties as needed
    }
  
    export default class QuickBooks {
      constructor(
        consumerKey: string,
        consumerSecret: string,
        token: string,
        tokenSecret: string | boolean,
        realmId: string,
        useSandbox: boolean,
        debug: boolean,
        minorversion: string | null,
        oauthVersion: string,
        refreshToken: string
      );
  
      // Replace `any` with more specific types
      findAccounts?: (callback: (err: Error, result: Account[]) => void) => void;
      getCustomer?: (id: string, callback: (err: Error, result: Customer) => void) => void;
  
      // Example of specific function
      someOtherFunction?: (param1: string, param2: number) => string; // Adjust based on actual function signature
    }
  }
  