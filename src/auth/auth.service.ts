import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    private userRepository: UserRepository,
  ) {
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    let user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const token = await this.userRepository.generateUserToken(
      user.nickname,
      user.email,
      user.password,
    );
    user = await this.userRepository.updateTokenByEmail(email, token);
    if (!user) {
      throw new BadRequestException();
    }
    return token;
  }

  async registration(body: RegisterDto) {
    const { email, nickname, password } = body;
    let user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new HttpException('EMAIL_EXIST', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const token = await this.userRepository.generateUserToken(
      nickname,
      email,
      hashedPassword,
    );
    user = await this.userRepository.createUser(
      nickname,
      email,
      hashedPassword,
      token,
    );
    if (!user) {
      throw new BadRequestException();
    }
    return token;
  }

  async logout(token) {
    const user = await this.userRepository.findByToken(token);
    if (!user) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.updateTokenByEmail(user.email, null);
    return {
      success: true,
    };
  }
}
