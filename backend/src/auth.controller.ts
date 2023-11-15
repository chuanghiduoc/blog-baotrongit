import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('/test')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  postGetId(@Res() res: Response) {
    res.status(HttpStatus.OK).json('Res full');
  }
  @Get()
  getTest(): string {
    return this.authService.getTest();
  }
  @Get('/:id')
  getId(): string {
    return this.authService.getId();
  }
}
