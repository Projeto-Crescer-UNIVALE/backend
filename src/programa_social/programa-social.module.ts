import { Module } from '@nestjs/common';
import { ProgramaSocialService } from './programa-social.service';
import { ProgramaSocialController } from './programa-social.controller';
import { PrismaService } from 'src/prisma.service'; // Importe o PrismaService

@Module({
  controllers: [ProgramaSocialController],
  providers: [ProgramaSocialService, PrismaService],
  exports: [ProgramaSocialService],
})
export class ProgramaSocialModule {}
