import React from 'react';
import ConnectButton from '../components/connectButton'; 
import Head from 'next/head';
import Image from 'next/image';

export default function HomePage() { 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Compass East | QuickBooks Analytics</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
      </Head>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center py-14 px-4">
        <div className="w-full max-w-2xl text-center bg-white p-12 rounded-lg shadow-sm border border-[#4ba6de]/20">
          <div className="mb-12 flex justify-center items-center">
            <Image 
              src="/compass_east_logo.jfif" 
              alt="Compass East Logo" 
              width={70} 
              height={70} 
              className="mr-3"
            />
            <div className="text-3xl font-medium">
              <span className="text-[#003853]">COMPASS</span>&nbsp;<span className="text-[#4ba6de]">EAST</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-medium mb-4 text-[#003853]">
            Connect QuickBooks<br/>to Get Started
          </h1>
          
          <div className="w-24 h-1.5 bg-[#4ba6de] mx-auto mb-12"></div>
          
          <p className="mb-16 text-xl text-gray-600 max-w-lg mx-auto">
            Connect QuickBooks in a few steps to securely unlock powerful accounting analytics from Compass East.          
          </p>

          <div className="mt-8">
            <button 
              onClick={() => {
                const connectButton = document.querySelector('button[data-connect-button="true"]') as HTMLButtonElement;
                if (connectButton) connectButton.click();
              }}
              className="bg-[#1a9ad7] hover:bg-[#0e8dc9] text-white font-medium py-3.5 px-10 rounded-full text-lg transition-colors"
            >
              Connect to QuickBooks
            </button>
            <div className="hidden">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Compass East — Secure QuickBooks Integration
      </footer>
    </div>
  );
}