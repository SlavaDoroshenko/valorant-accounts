import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ description: 'Логин от аккаунта', example: 'user123' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ description: 'Пароль от аккаунта', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Почта от аккаунта',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Пароль от почты', example: 'example123' })
  @IsString()
  @IsNotEmpty()
  emailPassword: string;
}
