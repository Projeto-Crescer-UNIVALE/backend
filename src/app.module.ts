import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { PerfilModule } from './perfil/perfil.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FuncionariosModule,
    PerfilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
