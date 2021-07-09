import { Body, Controller, Get, HttpException, HttpStatus, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private authService: AuthService,
  ) {
  }

  @Get()
  @UseGuards(AuthGuard)
  async getPosts(
    @Next() next: NextFunction,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {

    } catch (e) {
      response.clearCookie('SESSID');
      response.redirect('/auth');
      return;
    }
    next();
  }

  @Post('insert')
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
