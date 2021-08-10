import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<any>,
    private userRepository: UserRepository,
  ) {
  }

  posts: Post[] = [];

  async insertPost(
    body: CreatePostDto,
    photo,
    userToken: string,
  ): Promise<any> {
    const { description, title } = body;
    if (!photo) {
      throw new HttpException('File is invalid', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findByToken(userToken);
    return new this.postModel({
      author: user.nickname,
      title: title,
      description: description,
      imageUrl: photo.path,
    }).save();
  }
}
