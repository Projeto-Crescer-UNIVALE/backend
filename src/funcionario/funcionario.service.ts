import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { PrismaService } from 'src/prisma.service';
import { Funcionario } from './entities/funcionario.entity';
import { BcryptService } from 'src/auth/hashing/bcrypt.service';
import { randomUUID } from 'node:crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';
import { Paginate } from 'src/common/utils/pagination';

@Injectable()
export class FuncionarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  async create(
    criarFuncionarioDto: CreateFuncionarioDto,
  ): Promise<Funcionario> {
    const existeFuncionario = await this.prisma.funcionario.findUnique({
      where: { email: criarFuncionarioDto.email },
    });

    if (existeFuncionario) {
      throw new ConflictException('Já existe um funcionário com este e-mail.');
    }

    const senhaTemporaria = randomUUID();
    const senhaHash = await this.bcryptService.hash(senhaTemporaria);

    const novoFuncionario = await this.prisma.funcionario.create({
      data: {
        nome: criarFuncionarioDto.nome,
        email: criarFuncionarioDto.email,
        senha: senhaHash,
        telefone: criarFuncionarioDto.telefone,
        ativo: criarFuncionarioDto.ativo,
        perfil: {
          connect: { id_perfil: criarFuncionarioDto.id_perfil },
        },
      },
    });

    const token = randomUUID();

    await this.prisma.token.create({
      data: {
        valor: token,
        tipo: 'primeiro_acesso',
        funcionarioId: novoFuncionario.id_funcionario,
      },
    });
    const tokenUrl = `${process.env.FRONT_URL}/auth/criar-senha?token=${token}`;
    await this.mailerService.sendMail({
      to: novoFuncionario.email,
      subject: 'Autenticação Projeto Crescer',
      html: `<p>Olá ${novoFuncionario.nome}</p><br>
       <p>Utilize o link abaixo para acessar sua conta pela primeira vez e definir sua senha. Não o compartilhe com ninguém.</p><br>
       <a href="${tokenUrl}">${tokenUrl}</a>`,
    });
    return novoFuncionario;
  }

  async findAll(query: PaginationQueryDto) {
    const result = await Paginate<Funcionario>(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      {
        includes: ['perfil'],
        orderBy: { id_funcionario: 'asc' },
        search: ['id_funcionario', 'nome'],
      },
      this.prisma.funcionario,
    );

    result.data = result.data.map((f: any) => {
      const { senha, ...rest } = f;
      return rest;
    });

    return result;
  }

  async findOne(id_funcionario: number) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario },
      omit: {
        senha: true,
      },
    });

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com ID ${id_funcionario} não encontrado.`,
      );
    }
    return funcionario;
  }

  async update(
    id_funcionario: number,
    updateFuncionarioDto: CreateFuncionarioDto,
  ): Promise<Funcionario> {
    await this.findOne(id_funcionario);

    const existingFuncionario = await this.prisma.funcionario.findUnique({
      where: {
        email: updateFuncionarioDto.email,
        AND: {
          id_funcionario: { not: id_funcionario },
        },
      },
    });

    if (existingFuncionario) {
      throw new ConflictException(
        'Este e-mail já está em uso por outro funcionário.',
      );
    }

    return this.prisma.funcionario.update({
      where: { id_funcionario },
      omit: {
        senha: true,
      },
      data: updateFuncionarioDto,
    });
  }

  async remove(id_funcionario: number): Promise<Funcionario> {
    await this.findOne(id_funcionario);

    return this.prisma.funcionario.delete({
      where: { id_funcionario },
      omit: {
        senha: true,
      },
    });
  }

  async validarTokenPrimeiroAcesso(token: string) {
    const tokenValido = await this.prisma.token.findUnique({
      where: { valor: token },
      include: { funcionario: true },
    });

    if (!tokenValido) {
      return { valido: false, mensagem: 'Token não encontrado' };
    }

    if (!tokenValido.ativo) {
      return { valido: false, mensagem: 'Token desativado' };
    }

    if (tokenValido.usado_em !== null) {
      return { valido: false, mensagem: 'Token já utilizado' };
    }

    return { valido: true, funcionario: tokenValido.funcionario };
  }

  async definirSenhaPrimeiroAcesso(token: string, senha: string) {
    const tokenRegistro = await this.prisma.token.findUnique({
      where: { valor: token },
    });

    if (!tokenRegistro || tokenRegistro.usado_em !== null) {
      return { sucesso: false, mensagem: 'Token inválido ou já utilizado' };
    }

    const senhaHash = await this.bcryptService.hash(senha);

    await this.prisma.funcionario.update({
      where: { id_funcionario: tokenRegistro.funcionarioId },
      data: { senha: senhaHash },
    });

    await this.prisma.token.update({
      where: { valor: token },
      data: { usado_em: new Date() },
    });

    return { sucesso: true };
  }
}
