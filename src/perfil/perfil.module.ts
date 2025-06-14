import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PerfilService, PrismaService],
  controllers: [PerfilController],
})
export class PerfilModule {}
