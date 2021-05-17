import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    private jwtService: JwtService,
  ) {
  }

  async findOne(condition): Promise<any> {
    const user = await this.userModel.findOne(condition).exec();
    return user && user.password ? user : false;
  }

  createUser(nickname: string, email: string, password: string, token: string): Promise<any> {
    return new this.userModel({
      nickname,
      email,
      password,
      token,
    }).save();
  }

  async updateUser(condition: any, token: string): Promise<any> {
    return this.userModel.updateOne(condition, { token: token });
  }

  generateToken(nickname: string, email: string, password: string) {
    return this.jwtService.signAsync({
      nickname,
      email,
      password,
    });
  }

  async authenticateUser(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
