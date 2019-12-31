import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  customName: {
    type: String,
    default: '',
  },
  money: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
});

const account = mongoose.model('Account', accountSchema);

export default account;
