import mongoose from 'mongoose';
import { subscriptions } from '../config';

let sub = subscriptions[0];

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
  money: {
    type: Number,
    default: 0,
  },
  weekLimit: {
    type: Number,
    default: sub['limit'],
  },
  weekLeft: {
    type: Number,
    default: sub['limit'],
  },
  planCost: {
    type: Number,
    default: sub['cost'],
  },
  planName: {
    type: String,
    default: sub['name'],
  },
  planId: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
});

const user = mongoose.model('User', userSchema);

export default user;
