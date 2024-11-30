import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from 'react-hot-toast';
import TransactionHistory from './TransactionHistory';

const VirtualWalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleAddMoney = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setBalance(prevBalance => prevBalance + parsedAmount);
    setAmount('');
    addTransaction('add', parsedAmount);
    toast.success(`$${parsedAmount.toFixed(2)} added to your wallet`);
  };

  const handleWithdrawMoney = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (parsedAmount > balance) {
      toast.error('Insufficient funds');
      return;
    }
    setBalance(prevBalance => prevBalance - parsedAmount);
    setAmount('');
    addTransaction('withdraw', parsedAmount);
    toast.success(`$${parsedAmount.toFixed(2)} withdrawn from your wallet`);
  };

  const addTransaction = (type, amount) => {
    const newTransaction = {
      id: Date.now(),
      type,
      amount,
      date: new Date(),
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Virtual Wallet Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
              <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
            </div>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
              <div className="flex space-x-4">
                <Button onClick={handleAddMoney} className="flex-1">
                  Add Money
                </Button>
                <Button onClick={handleWithdrawMoney} className="flex-1" variant="outline">
                  Withdraw Money
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default VirtualWalletDashboard;
