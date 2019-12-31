import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
});

const transaction = mongoose.model('Transaction', transactionSchema);

export default transaction;
