import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { PerfilModule } from './perfil/perfil.module';
import { AlunoModule } from './aluno/aluno.module';
import { ProgramaSocialModule } from './programa_social/programa-social.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FuncionarioModule,
    PerfilModule,
    AlunoModule,
    ProgramaSocialModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
