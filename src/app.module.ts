import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { PerfilModule } from './perfil/perfil.module';
import { AlunoModule } from './aluno/aluno.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FuncionariosModule,
    PerfilModule,
    AlunoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
