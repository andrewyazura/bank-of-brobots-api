import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  telegram_id: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  weekLimit: {
    type: Number,
    default: 40,
  },
  weekLeft: {
    type: Number,
    default: 40,
  },
  planCost: {
    type: Number,
    default: 0,
  },
  planName: {
    type: String,
    default: 'Free',
  },
});

const user = mongoose.model('User', userSchema);

export default user;
