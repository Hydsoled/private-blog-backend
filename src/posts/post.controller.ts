import {
  Body,
  Controller, Delete,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { CreatePostDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserToken } from '../services/user.decorator';

import { saveImageToStorage } from '../helpers/image-uploader.conf';
import { UpdatePostDto } from './dto/update.dto';

@Controller('api/post')
export class PostController {
  constructor(
    private postService: PostService,
  ) {
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    console.log('gamarjobat');
  }

  @Post('insert')
  @UseInterceptors(FileInterceptor('photo', saveImageToStorage))
  @UseGuards(AuthGuard)
  async create(
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @UserToken() user,
  ): Promise<any> {
    return await this.postService.insertPost(body, file, user);
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('photo', saveImageToStorage))
  @UseGuards(AuthGuard)
  async update(
    @Body() body: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.postService.updatePost(body, file);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async delete(@Body('id') id: string): Promise<any> {
    return await this.postService.deletePost(id);
  }
}
