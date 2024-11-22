import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private channel: amqp.Channel;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async start(user: User) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const accountCount = accounts.length;

    console.log(
      `Количество аккаунтов для пользователя ${user.id}: ${accountCount}`,
    );
  }
}
