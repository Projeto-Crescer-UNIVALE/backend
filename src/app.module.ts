import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AlunoModule } from './aluno/aluno.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AlunoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
