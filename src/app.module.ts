import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { PerfilModule } from './perfil/perfil.module';
import { AlunoModule } from './aluno/aluno.module';
import { ProgramaSocialModule } from './programa_social/programa-social.module';
import { PrismaService } from './prisma.service';
import { OficinaModule } from './oficina/oficina.module';
import { AuthModule } from './auth/auth.module';
import { DiarioModule } from './aluno/diario/diario.module'; 
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport:{
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT ? +process.env.EMAIL_PORT : 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    }),
    FuncionarioModule,
    PerfilModule,
    AlunoModule,
    ProgramaSocialModule,
    OficinaModule,
    AuthModule,
    DiarioModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}