import { Injectable, OnModuleInit } from '@nestjs/common';
import { Account, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const connection = await amqp.connect(
      this.configService.get<string>('RABBITMQ_URL'),
    );
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('accountQueue', { durable: true });
  }

  async start(user: User) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const accountCount = accounts.length;

    console.log(accounts);

    this.sendStartTaskToQueue(accounts);

    return { msg: 'Task have been starded' };
  }

  async sendStartTaskToQueue(accounts: Account[]) {
    const task = { script: 'start_script.py', accounts };
    this.channel.sendToQueue('taskQueue', Buffer.from(JSON.stringify(task)), {
      persistent: true,
    });
  }
}
