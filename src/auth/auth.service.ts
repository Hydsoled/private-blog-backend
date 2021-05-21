import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    private jwtService: JwtService,
  ) {
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

  cookieParser(cookie: string): any {
    const cookies = {};
    cookie.split(';').map((val) => {
      cookies[val.split('=')[0]] = val.split('=')[1];
    });
    return cookies;
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

  detectValue(value: string): string {
    const invalidChars = ((value.match(new RegExp('[!#$%@^&*()_<>?/\-=`~\'\"]')) || []).length > 0);
    const email = ((value.match(new RegExp('@', 'g')) || []).length === 1);
    if (!email && invalidChars) {
      return undefined;
    }
    if (email) return 'email';
    return 'nickname';
  }

  validRegistration(email, nickname): boolean {
    return 'email' === this.detectValue(email) && 'nickname' === this.detectValue(nickname);
  }
}
