import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin']) // Kiểm tra role chỉ có thể là 'user' hoặc 'admin'
  @Transform(({ value }) => (value ? value.toLowerCase() : 'user'))
  readonly role?: string;
}
