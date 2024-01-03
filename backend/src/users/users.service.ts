import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role, refresh_token } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const createdUser = await this.userModel.create({
        username,
        password: hashedPassword,
        role: role || 'user',
        refresh_token,
      });
      return createdUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async updateRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel
      .updateOne({ username }, { refresh_token: refreshToken })
      .exec();
  }

  async findRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userModel
      .findOne({ username, refresh_token: refreshToken })
      .exec();
    return !!user;
  }

  async findOne(username: string): Promise<User | null> {
    const foundUser = await this.userModel.findOne({ username }).exec();
    return foundUser || null;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password -__v').exec();
  }
}
