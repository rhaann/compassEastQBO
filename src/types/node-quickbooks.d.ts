declare module 'node-quickbooks' {
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
  
      // Add only what you use — here's a basic example:
      findAccounts?: (callback: Function) => void;
      getCustomer?: (id: string, callback: Function) => void;
      // or use index signature:
      [key: string]: any;
    }
  }
  