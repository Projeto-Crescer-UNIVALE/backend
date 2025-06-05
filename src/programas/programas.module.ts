import { Module } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProgramasService],
  controllers: [ProgramasController],
  exports: [ProgramasService],
})
export class ProgramasModule {}
