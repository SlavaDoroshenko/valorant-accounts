import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createAccountDto: CreateAccountDto) {
    const { login, email, password, emailPassword } = createAccountDto;

    const account = await this.prisma.account.create({
      data: {
        login,
        email,
        password,
        email_password: emailPassword,
        userId: user.id,
      },
    });

    return account;
  }
}
