import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //Đăng kí
  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Không tồn tại username.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    const payload = { username: user.username, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
      }),
    };
  }

  //renew token
  async renewToken(refresh_token) {
    const decoded = await this.jwtService.verifyAsync(refresh_token);

    if (!decoded || !decoded.sub) {
      return { message: 'Refresh token không hợp lệ' };
    }

    const username = decoded.username.toString();
    const userId = decoded.sub.toString();
    const payload = { username: username, sub: userId };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token: access_token };
  }
}
