import * as mongoose from 'mongoose';

export const User = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    nickname: {
      type: String,
      unique: true,
    },
    token: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  { collection: 'user' },
);
