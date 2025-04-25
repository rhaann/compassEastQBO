import React from 'react';
import Head from 'next/head';

const Dashboard: React.FC = () => {

  return (
    <div className="min-h-screen p-8">
      <Head>
        <title>Dashboard | QuickBooks Integration</title>
      </Head>
      <main className="flex justify-center">
       
        <div 
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-2.5 rounded relative mb-6" 
          style={{ maxWidth: "40rem" }} 
          role="alert"
        >
          <span className="block sm:inline">Connection successful! Your QuickBooks account is now connected.</span>
        </div>
    
        
      </main>
    </div>
  );
};

export default Dashboard;
