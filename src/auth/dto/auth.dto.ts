import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: 'Логин пользователя', example: 'user123' }) // Описание и пример
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'password123' }) // Описание и пример
  @IsNotEmpty()
  @IsString()
  password: string;
}
