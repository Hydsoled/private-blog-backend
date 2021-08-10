import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../posts/dto/create.dto';
import { PostDocument } from '../schema/post.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<any>,
    private userRepository: UserRepository,
  ) {
  }

  async insert(
    postBody: CreatePostDto,
    photo,
    userToken: string,
  ): Promise<PostDocument> {
    const { title, description } = postBody;
    const user = await this.userRepository.findByToken(userToken);
    return new this.postModel({
      author: user.nickname,
      title: title,
      description: description,
      imageUrl: photo.path,
    }).save();
  }
}
