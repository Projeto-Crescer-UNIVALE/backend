import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let senhaIsValid = false;
    let throwError = true;

    const funcionario = await this.prisma.funcionario.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (funcionario) {
      senhaIsValid = await this.hashingService.compare(
        loginDto.senha,
        funcionario.senha,
      );
    }

    if (senhaIsValid) {
      throwError = false;
    }

    if (throwError) {
      throw new UnauthorizedException('Funcionário ou senha inválidos.');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: funcionario?.id_funcionario,
        nome: funcionario?.nome,
        id_perfil: funcionario?.id_perfil,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );

    return {
      accessToken,
    };
  }
}
