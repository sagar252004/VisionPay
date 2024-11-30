import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext(undefined);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);

  const addMoney = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const withdrawMoney = (amount) => {
    if (amount <= balance) {
      setBalance((prevBalance) => prevBalance - amount);
    } else {
      alert('Insufficient funds');
    }
  };

  return (
    <WalletContext.Provider value={{ balance, addMoney, withdrawMoney }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
