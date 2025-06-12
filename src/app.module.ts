import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { PerfilModule } from './perfil/perfil.module';
import { DiarioModule } from './diario/diario.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FuncionarioModule,
    PerfilModule,
    DiarioModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
