import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './user/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'frontend/private-blog'),
    // }),
    MongooseModule.forRoot('mongodb://localhost:27017/private-blog'),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: User,
      },
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
