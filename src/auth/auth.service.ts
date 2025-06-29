import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { randomUUID } from 'crypto';
import { BcryptService } from './hashing/bcrypt.service';
import { VerificaTokenDto } from './dto/verifica-token.dto';
import { Prisma } from 'generated/prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { email: loginDto.email },
      include: { perfil: true },
    });

    if (!funcionario)
      throw new BadRequestException('E-mail ou senha incorretos.');

    const passwordValid = await this.bcryptService.compare(
      loginDto.senha,
      funcionario.senha,
    );

    if (!passwordValid)
      throw new BadRequestException('E-mail ou senha incorretos.');

    const { token, expiresIn } = await this.criaSessao(funcionario);

    return {
      accessToken: token,
      funcionario: {
        id: funcionario.id_funcionario,
        nome: funcionario.nome,
        email: funcionario.email,
        perfil: funcionario.perfil.nome,
      },
      expiresAt: expiresIn,
    };
  }

  private async criaSessao(
    funcionario: Prisma.FuncionarioGetPayload<{ include: { perfil: true } }>,
  ) {
    const id_sessao = randomUUID();
    const now = new Date();
    const expiresIn = new Date(now.getTime() + 60 * 60 * 24 * 1000); // 24 horas

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
    return { token, expiresIn };
  }

  async verificaToken(verificaTokenDto: VerificaTokenDto) {
    const tokenDB = await this.prisma.token.findFirst({
      where: {
        valor: verificaTokenDto.token,
        tipo: verificaTokenDto.tipoToken,
        ativo: true,
      },
      include: {
        funcionario: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!tokenDB || tokenDB.usado_em) {
      throw new BadRequestException('Token inválido ou já foi utilizado.');
    }

    await this.prisma.token.update({
      where: { id_token: tokenDB.id_token },
      data: {
        usado_em: new Date(),
        ativo: false,
      },
    });

    await this.prisma.sessao.updateMany({
      where: {
        id_funcionario: tokenDB.funcionarioId,
        ativo: true,
      },
      data: {
        ativo: false,
      },
    });

    const { token, expiresIn } = await this.criaSessao(tokenDB.funcionario);

    return {
      accessToken: token,
      funcionario: {
        id: tokenDB.funcionario.id_funcionario,
        nome: tokenDB.funcionario.nome,
        email: tokenDB.funcionario.email,
        perfil: tokenDB.funcionario.perfil.nome,
      },
      expiresAt: expiresIn,
    };
  }

  async recuperarSenha(email: string) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!funcionario || !funcionario.ativo) {
      return;
    }

    const tokenValor = randomUUID();

    await this.prisma.token.create({
      data: {
        valor: tokenValor,
        tipo: 'redefinicao_senha',
        funcionarioId: funcionario.id_funcionario,
        ativo: true,
      },
    });

    const tokenUrl = `${process.env.FRONT_URL}/auth/recuperar-senha?token=${tokenValor}`;
    await this.mailerService.sendMail({
      to: funcionario.email,
      subject: 'Recuperação de Senha Projeto Crescer',
      html: `<p>Olá ${funcionario.nome}</p><br>
       <p>Utilize o link abaixo para recuperar a sua senha e redefiní-la. Não o compartilhe com ninguém.</p><br>
       <a href="${tokenUrl}">${tokenUrl}</a>`,
    });
  }

  async alterarSenha(id_funcionario: number, alterarSenhaDto: AlterarSenhaDto) {
    if (alterarSenhaDto.novaSenha !== alterarSenhaDto.confirmarNovaSenha) {
      throw new BadRequestException('As senhas informadas não coincidem.');
    }

    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const hashSenha = await this.bcryptService.hash(alterarSenhaDto.novaSenha);

    await this.prisma.funcionario.update({
      where: { id_funcionario },
      data: {
        senha: hashSenha,
      },
    });

    await this.prisma.sessao.updateMany({
      where: {
        id_funcionario: id_funcionario,
        ativo: true,
      },
      data: {
        ativo: false,
      },
    });
  }
}
