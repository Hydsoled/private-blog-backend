import * as mongoose from 'mongoose';

export const Post = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    author: String,
    title: String,
    description: String,
    createdAt: Number,
    updatedAt: Number,
    imageUrl: String,
  },
  { collection: 'post' },
);
