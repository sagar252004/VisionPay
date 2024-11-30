import React from "react";
import { WalletProvider } from "./WalletContext";
import WalletCard from "./WalletCard";
import AddMoney from "./AddMoney";
import WithdrawMoney from "./WithdrawMoney";
import Navbar from "./shared/Navbar";
import TransactionHistory from "./TransactionHistory";


const Dashboard = () => {
  return (
    
    <WalletProvider>
      <div>
        <Navbar/>
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
          <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <h1 className="text-2xl font-semibold mb-6 text-center">
                Virtual Wallet Dashboard
              </h1>
              <div className="space-y-6">
                <WalletCard />
                {/* <TransactionHistory/> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default Dashboard;
