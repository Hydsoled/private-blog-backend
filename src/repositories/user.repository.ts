import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly User: Model<any>,
    private jwtService: JwtService,
  ) {
  }

  generateUserToken(nickname: string, email: string, password: string) {
    return this.jwtService.signAsync({
      nickname,
      email,
      password,
    });
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.User.findOne({ email }).exec();
    return user ? user : false;
  }

  createUser(
    nickname: string,
    email: string,
    password: string,
    token: string,
  ): Promise<any> {
    return new this.User({
      nickname,
      email,
      password,
      token,
    }).save();
  }

  async updateTokenByEmail(email: string, token: string): Promise<any> {
    return this.User.updateOne({ email: email }, { token: token });
  }

  async findByToken(token: string): Promise<any> {
    const user = await this.User.findOne({ token }).exec();
    return user ? user : false;
  }
}
