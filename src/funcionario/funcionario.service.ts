import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { PrismaService } from 'src/prisma.service';
import { Funcionario } from './entities/funcionario.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FuncionarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    criarFuncionarioDto: CreateFuncionarioDto,
  ): Promise<Funcionario> {
    const existeFuncionario = await this.prisma.funcionario.findUnique({
      where: { email: criarFuncionarioDto.email },
    });

    if (existeFuncionario) {
      throw new ConflictException('Já existe um funcionário com este e-mail.');
    }

    
    const senhaTemporaria = Math.random().toString(36).slice(-8);
    const senhaHash = await bcrypt.hash(senhaTemporaria, 10);

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

    const token = uuidv4();

    await this.prisma.token.create({
      data: {
        valor: token, 
        tipo: 'primeiro_acesso',
        funcionarioId: novoFuncionario.id_funcionario,
        
      },
    });

    console.log(`Token de primeiro acesso: ${token}`);

    return novoFuncionario;
  }

  async findAll() {
    return this.prisma.funcionario.findMany();
  }

  async findOne(id_funcionario: number) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario },
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
      data: updateFuncionarioDto,
    });
  }

  async remove(id_funcionario: number): Promise<Funcionario> {
    
    await this.findOne(id_funcionario);

    
    return this.prisma.funcionario.delete({
      where: { id_funcionario },
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

    const senhaHash = await bcrypt.hash(senha, 10);

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
