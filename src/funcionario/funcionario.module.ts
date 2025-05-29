import { Module } from '@nestjs/common';
import { FuncionariosService } from './funcionario.service';
import { FuncionariosController } from './funcionario.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FuncionariosController],
  providers: [FuncionariosService, PrismaService],
})
export class FuncionariosModule {}
