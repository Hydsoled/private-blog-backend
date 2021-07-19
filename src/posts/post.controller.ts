import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';

@Controller('api/post')
export class PostController {
  constructor(
    private postService: PostService,
    private authService: AuthService,
  ) {
  }

  @Get()
  @UseGuards(AuthGuard)
  async getPosts(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    console.log('gamarjobat');
  }

  @Post('insert')
  @UseGuards(AuthGuard)
  async insertPosts(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Promise<any> {
    try {
      await this.postService.insertPost();
      return title;
    } catch (e) {
      throw new HttpException('wtf', HttpStatus.BAD_REQUEST);
    }
  }
}
