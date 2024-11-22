import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { JwtGuard } from './guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован.',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoiU2xhdmEiLCJpYXQiOjE3MzIyMzA4NDIsImV4cCI6MTczMjIzMjY0Mn0.M_m2aG9V2PRsPSPOFKKD0gNpddN7K49kMZZFsqVSE3M',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации данных.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно найден.',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoiU2xhdmEiLCJpYXQiOjE3MzIyMzA4NDIsImV4cCI6MTczMjIzMjY0Mn0.M_m2aG9V2PRsPSPOFKKD0gNpddN7K49kMZZFsqVSE3M',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Неверные данные' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getMe(@GetUser() user: User) {
    return user;
  }
}
