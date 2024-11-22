import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { exec } from 'child_process';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService implements OnModuleInit {
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
    await this.channel.assertQueue('taskQueue', { durable: true });

    this.channel.consume('taskQueue', (msg) => {
      if (msg !== null) {
        const task = JSON.parse(msg.content.toString());
        this.runPythonScript(task.script, task.accounts);
        this.channel.ack(msg);
      }
    });
  }

  private runPythonScript(script: string, accounts: any[]) {
    if (!accounts || accounts.length === 0) {
      console.log('Нет аккаунтов для обработки.');
      return;
    }

    const accountsJson = JSON.stringify(accounts);
    exec(
      `python ${script} "${accountsJson.replace(/"/g, '\\"')}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка при выполнении скрипта: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Ошибка в скрипте: ${stderr}`);
          return;
        }
        console.log(`Результат выполнения скрипта: ${stdout}`);
      },
    );
  }
}
