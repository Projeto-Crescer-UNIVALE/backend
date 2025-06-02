import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validarFuncionario(cpf: string, senha: string) {
    console.log('--- DEBUG login ---');
    console.log('CPF recebido:', cpf);
    console.log('Senha recebida:', senha);

    const funcionario = await this.prisma.funcionario.findUnique({
      where: { cpf },
    });

    console.log('Funcionário do banco:', funcionario);

    if (!funcionario) {
      console.log('Funcionário não encontrado');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);

    console.log('Senha válida?', senhaValida);

    if (!senhaValida) {
      console.log('Senha incorreta');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log('Login válido, retornando funcionário');
    return funcionario;
  }

  async login(cpf: string, senha: string) {
    const funcionario = await this.validarFuncionario(cpf, senha);

    const payload = { sub: funcionario.id, cpf: funcionario.cpf };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
