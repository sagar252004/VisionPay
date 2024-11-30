import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const TransactionHistory = ({ transactions }) => {

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium">
                  {transaction.type === 'add' ? 'Added' : 'Withdrawn'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleString()}
                </p>
              </div>
              <p className={`font-bold ${transaction.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                ${transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
