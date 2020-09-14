import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  money: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  queryId: {
    type: String,
  },
});

const transaction = mongoose.model('Transaction', transactionSchema);

export default transaction;
