import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { PrismaService } from './modules/prisma/prisma.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
