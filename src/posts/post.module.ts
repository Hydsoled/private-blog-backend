import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../schema/post.schema';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserRepository } from '../repositories/user.repository';
import { PostRepository } from '../repositories/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    MulterModule.register({
      dest: './src/images',
    }),
    AuthModule,
  ],
  controllers: [PostController],
  providers: [PostService, UserRepository, PostRepository],
  exports: [PostService],
})
export class PostModule {
}
