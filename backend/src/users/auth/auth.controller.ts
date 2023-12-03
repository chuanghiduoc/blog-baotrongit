import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('renewToken')
  async renewToken(@Headers('authorization') authHeader: string) {
    const refresh_token = authHeader ? authHeader.split(' ')[1] : null;
    if (!refresh_token) {
      return { message: 'Không có refresh token' };
    }
    return this.authService.renewToken(refresh_token);
  }
}
