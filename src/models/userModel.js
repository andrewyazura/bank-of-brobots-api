import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
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

userSchema.pre('save', function() {
  if (!this.isModified('password')) return;

  const hashedPassword = bcrypt.hashSync(this.password, 10);
  this.password = hashedPassword;
});

const user = mongoose.model('User', userSchema);

export default user;
