import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create.dto';
import { UserRepository } from '../repositories/user.repository';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<any>,
    private userRepository: UserRepository,
    private postRepository: PostRepository,
  ) {
  }

  posts: Post[] = [];

  async insertPost(
    body: CreatePostDto,
    photo,
    userToken: string,
  ): Promise<any> {
    if (!photo) {
      throw new HttpException('File is invalid', HttpStatus.BAD_REQUEST);
    }
    return this.postRepository.insert(body, photo, userToken);
  }
}
