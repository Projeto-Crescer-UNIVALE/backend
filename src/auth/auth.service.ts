import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { randomUUID } from 'crypto';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { email: loginDto.email },
      include: { perfil: true },
    });

    if (!funcionario) return null;

    const passwordValid = await this.hashingService.compare(
      loginDto.senha,
      funcionario.senha,
    );

    if (!passwordValid) return null;

    const id_sessao = randomUUID();
    const now = new Date();
    const expiresIn = 60 * 60 * 1; // 1 hora

    await this.prisma.sessao.create({
      data: {
        id_sessao,
        id_funcionario: funcionario.id_funcionario,
        ativo: true,
        data_criacao: now,
      },
    });

    const token = await this.jwtService.signAsync(
      {
        sub: funcionario.id_funcionario,
        perfil: funcionario.perfil.nome.toLowerCase(),
        id_sessao,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: `${expiresIn}s`,
      },
    );

    return {
      accessToken: token,
      funcionario: {
        id: funcionario.id_funcionario,
        nome: funcionario.nome,
        email: funcionario.email,
        perfil: funcionario.perfil.nome,
      },
      expiresAt: new Date(now.getTime() + expiresIn * 1000),
    };
  }
}
