import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../posts/dto/create.dto';
import { PostDocument } from '../schema/post.schema';
import { UserRepository } from './user.repository';
import { UpdatePostDto } from '../posts/dto/update.dto';
import { unlinkSync } from 'fs';

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
      imageUrl: photo ? photo.path : null,
    }).save();
  }

  async update(postBody: UpdatePostDto, photo): Promise<any> {
    const { _id, description, title } = postBody;
    try {
      const data = await this.postModel.findById(_id);
      unlinkSync(data.imageUrl);
      await this.postModel.updateOne(
        { _id },
        { title, description, updatedAt: new Date(), imageUrl: photo.path },
      );
    } catch (e) {
      throw new HttpException('Have not updated', HttpStatus.BAD_REQUEST);
    }
    return {
      success: true,
    };
  }

  async delete(id: string): Promise<any> {
    try {
      const data = await this.postModel.findById(id);
      unlinkSync(data.imageUrl);
      await this.postModel.deleteOne({ _id: id });
    } catch (e) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
    };
  }
}
