import { Global, Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthTokenGuard } from './guard/auth-token.guard';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    BcryptService,
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
  ],
  exports: [JwtModule, ConfigModule, BcryptService, PrismaService],
})
export class AuthModule {}
