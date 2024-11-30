import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

// Add money to wallet
export const addMoney = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += amount; // Add the amount to wallet
    await user.save();

    const transaction = new Transaction({
      userId,
      type: 'Deposit', // Deposit type for adding money
      amount,
    });
    await transaction.save();

    res.status(200).json({ walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove money from wallet
export const removeMoney = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' }); // Check for sufficient balance
    }

    user.walletBalance -= amount; // Subtract the amount from wallet
    await user.save();

    const transaction = new Transaction({
      userId,
      type: 'Withdrawal', // Withdrawal type for removing money
      amount,
    });
    await transaction.save();

    res.status(200).json({ walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
