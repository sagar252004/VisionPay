import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Deposit', 'Withdrawal'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
});

// module.exports = mongoose.model('Transaction', TransactionSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
