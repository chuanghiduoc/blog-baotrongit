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

  private async generateToken(
    payload: any,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn });
  }

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
    const access_token = await this.generateToken(payload, '1h');
    const refresh_token = await this.generateToken(payload, '24h');

    await this.usersService.updateRefreshToken(username, refresh_token);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async renewToken(refresh_token_old) {
    const decoded = await this.jwtService.verifyAsync(refresh_token_old);

    if (!decoded || !decoded.sub) {
      return { message: 'Refresh token không hợp lệ' };
    }

    const username = decoded.username.toString();
    const userId = decoded.sub.toString();
    const user = await this.usersService.findOne(username);

    if (!user || user.refresh_token !== refresh_token_old) {
      return { message: 'Refresh token không hợp lệ' };
    }

    const payload = { username: username, sub: userId };
    const access_token = await this.generateToken(payload, '1h');
    const refresh_token = await this.generateToken(payload, '24h');

    await this.usersService.updateRefreshToken(username, refresh_token);

    return { access_token: access_token, refresh_token: refresh_token };
  }
}
