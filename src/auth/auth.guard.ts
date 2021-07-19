import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse() as Response;
    const token = this.authorizationTokenParser(request.headers['authorization'] || '');
    if (!token) {
      return false;
    }
    try {
      await this.authenticateUser(token);
    } catch (e) {
      response.clearCookie('SESSID');
      throw new HttpException('PERMISSION ERROR', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  authorizationTokenParser(token: string) {
    return token.split(' ')[1];
  }

  async authenticateUser(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
