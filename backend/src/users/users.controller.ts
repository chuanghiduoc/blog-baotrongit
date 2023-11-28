import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.username || !createUserDto.password) {
      throw new BadRequestException('Vui lòng điền đầy đủ thông tin.');
    }

    const existingUser = await this.usersService.findOne(
      createUserDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('Username đã tồn tại.');
    }

    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('getuser')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
