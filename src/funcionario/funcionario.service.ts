import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { PrismaService } from 'src/prisma.service';
import { Funcionario } from './entities/funcionario.entity';
import { BcryptService } from 'src/auth/hashing/bcrypt.service';

@Injectable()
export class FuncionarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(
    criarFuncionarioDto: CreateFuncionarioDto,
  ): Promise<Funcionario> {
    const senhaHash = await this.bcryptService.hash(criarFuncionarioDto.senha);

    const existeFuncionario = await this.prisma.funcionario.findUnique({
      where: { email: criarFuncionarioDto.email },
    });

    if (existeFuncionario) {
      throw new ConflictException('Já existe um funcionário com este e-mail.');
    }

    return this.prisma.funcionario.create({
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

    if (updateFuncionarioDto?.senha) {
      const senhaHash = await this.bcryptService.hash(
        updateFuncionarioDto.senha,
      );

      updateFuncionarioDto['senha'] = senhaHash;
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
}
