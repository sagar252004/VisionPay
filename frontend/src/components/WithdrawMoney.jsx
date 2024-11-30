import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { WALLET_API_END_POINT } from '@/utils/constant';
import { updateWalletBalance } from '@/redux/authSlice';
import Navbar from './shared/Navbar';

const WithdrawMoney = () => {
  const [amount, setAmount] = useState('');
  
  const { user } = useSelector((store) => store.auth);
  const balance = user.walletBalance;
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (numAmount > balance) {
      alert('Insufficient funds');
      return;
    }

    try {
      // Perform the withdrawal operation on the server
      const response = await axios.post(
        `${WALLET_API_END_POINT}/remove-money`,
        { amount: numAmount, userId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Update the wallet balance in Redux store after successful withdrawal
      dispatch(updateWalletBalance(response.data.walletBalance));

      setAmount(''); // Clear the input field
      alert(`$${numAmount.toFixed(2)} has been withdrawn from your wallet`);
    } catch (error) {
      console.error('Error withdrawing money:', error);
      alert('Failed to withdraw money from your wallet.');
    }
  };

  return (
    <div>
      <Navbar/>
    
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">Withdraw Money from Wallet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Withdraw ($)
          </label>
          <Input
            id="withdrawAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            max={balance.toString()}
            required
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={balance <= 0}>
          {balance > 0 ? 'Withdraw Money' : 'No Funds Available'}
        </Button>
      </form>
      {balance <= 0 && (
        <p className="text-red-500 text-sm mt-2">You have no funds to withdraw.</p>
      )}
    </div>
    </div>
  );
};

export default WithdrawMoney;
