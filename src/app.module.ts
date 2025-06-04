import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AlunoModule } from './aluno/aluno.module';
import { ProgramaSocialModule } from './programa_social/programa-social.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AlunoModule,
    ProgramaSocialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
