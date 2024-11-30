import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WALLET_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateWalletBalance } from '@/redux/authSlice'; // Update balance in Redux
import Navbar from './shared/Navbar';

const AddMoney = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(''); // Use an empty string as the initial state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the amount entered is a valid positive number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Make the API call to add money
      const response = await axios.post(
        `${WALLET_API_END_POINT}/add-money`,
        { amount: numAmount, userId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Assuming the API response includes the updated wallet balance
      const updatedBalance = response.data.walletBalance;

      // Dispatch action to update Redux store with the new balance
      dispatch(updateWalletBalance(updatedBalance));

      setAmount(''); // Clear the input field after success
      alert(`$${numAmount.toFixed(2)} has been added to your wallet`);
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money to your wallet.');
    }
  };

  return (
    <div>
       <Navbar/>
   
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">Add Money to Wallet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="addAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount to Add ($)
          </label>
          <Input
            id="addAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            required
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Add Money
        </Button>
      </form>
    </div>
    </div>
  );
};

export default AddMoney;
