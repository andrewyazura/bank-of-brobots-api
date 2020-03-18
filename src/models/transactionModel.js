import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
});

const transaction = mongoose.model('Transaction', transactionSchema);

export default transaction;
