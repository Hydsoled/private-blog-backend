import { Injectable } from '@nestjs/common';
import { Post } from './post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create.dto';
import { UserRepository } from '../repositories/user.repository';
import { PostRepository } from '../repositories/post.repository';
import { UpdatePostDto } from './dto/update.dto';

@Injectable()
export class PostService {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
  ) {
  }

  async insertPost(
    body: CreatePostDto,
    photo,
    userToken: string,
  ): Promise<any> {
    return this.postRepository.insert(body, photo, userToken);
  }

  async updatePost(
    body: UpdatePostDto,
    photo,
  ): Promise<any> {
    return this.postRepository.update(body, photo);
  }

  async deletePost(id: string): Promise<any> {
    return this.postRepository.delete(id);
  }
}
