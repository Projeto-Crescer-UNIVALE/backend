// src/oficina/oficina.module.ts

import { Module } from '@nestjs/common';
import { OficinaService } from './oficina.service';
import { OficinaController } from './oficina.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [OficinaController],
  providers: [OficinaService, PrismaService],
  exports: [OficinaService],
})
export class OficinaModule {}
