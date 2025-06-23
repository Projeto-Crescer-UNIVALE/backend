import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { randomUUID } from 'crypto';
import { BcryptService } from './hashing/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { email: loginDto.email },
      include: { perfil: true },
    });

    if (!funcionario) throw new BadRequestException('Funcionário inválido.');

    const passwordValid = await this.bcryptService.compare(
      loginDto.senha,
      funcionario.senha,
    );

    if (!passwordValid) throw new BadRequestException('Senha inválida.');

    const id_sessao = randomUUID();
    const now = new Date();
    const expiresIn = 60 * 60 * 24; // 24 horas

    const token = await this.jwtService.signAsync(
      {
        sub: funcionario.id_funcionario,
        perfil: funcionario.perfil.nome.toLowerCase(),
        id_sessao,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: `1d`,
      },
    );

    await this.prisma.sessao.create({
      data: {
        id_sessao,
        id_funcionario: funcionario.id_funcionario,
        ativo: true,
        data_criacao: now,
        token,
      },
    });

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
