import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './shared/Navbar';

const WalletCard = () => {
  const { user } = useSelector((store) => store.auth);

  // Check if user exists and has a walletBalance
  const balance = user?.walletBalance ?? 0; // Default to 0 if walletBalance is not available

  return (
    <div>
     
      
    <div className="bg-blue-500 text-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
      {/* Ensure balance is a valid number */}
      <p className="text-3xl font-bold">${balance.toFixed(2)}</p> 
    </div>
    </div>
  );
};

export default WalletCard;
