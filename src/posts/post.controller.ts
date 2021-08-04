import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res, UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { CreatePostDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        filename(req: any, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
          console.log(file);
          callback(null, 'gamarjobat.png');
        },
      }),
    }),
  )
  @UseGuards(AuthGuard)
  async create(
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return true;
  }
}
