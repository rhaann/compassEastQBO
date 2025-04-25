import React from 'react';
import { useRouter } from 'next/router';

const ConnectButton: React.FC = () => {
  const router = useRouter();

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/auth/connect');
      const data = await response.json();
      
      if (data.authUri) {
        window.location.href = data.authUri;
      }
    } catch (error) {
      console.error('Error connecting to QuickBooks:', error);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      className="bg-[#1a9ad7] hover:bg-[#1792cc] text-white font-medium py-3 px-14 rounded-full text-lg"
      data-connect-button="true"
    >
      Connect to QuickBooks
    </button>
  );
};

export default ConnectButton;
