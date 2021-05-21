import { Injectable } from '@nestjs/common';
import { Post } from './post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<any>,
  ) {
  }

  posts: Post[] = [];

  async insertPost(): Promise<any> {
    return new this.postModel({
      author: 'string',
      title: 'string',
      description: 'string',
      createdAt: 2,
      updatedAt: 2,
      imageUrl: 'string',
    }).save();
  }
}
