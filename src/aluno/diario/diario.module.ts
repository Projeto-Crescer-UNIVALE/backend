import { Module } from '@nestjs/common';
import { DiarioService } from './diario.service';
import { DiarioController } from './diario.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DiarioController],
  providers: [DiarioService, PrismaService],
})
export class DiarioModule {}
