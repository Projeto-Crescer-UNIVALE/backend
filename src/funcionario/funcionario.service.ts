/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { PrismaService } from 'src/prisma.service';
import { Funcionario } from './entities/funcionario.entity';

@Injectable()
export class FuncionariosService {
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
    return this.prisma.funcionario.create({
      data: {
        nome: criarFuncionarioDto.nome,
        email: criarFuncionarioDto.email,
        senha: criarFuncionarioDto.senha,
        telefone: criarFuncionarioDto.telefone,
        status: criarFuncionarioDto.status,
        // Conecta o funcionário a um perfil existente usando o id_perfil fornecido
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
    // Verifica se o funcionário existe
    await this.findOne(id_funcionario);

    // Se o e-mail estiver sendo atualizado, verifica se já está em uso por outro funcionário
    if (updateFuncionarioDto.email) {
      const existingFuncionario = await this.prisma.funcionario.findUnique({
        where: { email: updateFuncionarioDto.email },
      });

      if (
        existingFuncionario &&
        existingFuncionario.id_funcionario !== id_funcionario
      ) {
        throw new ConflictException(
          'Este e-mail já está em uso por outro funcionário.',
        );
      }
    }

    // Prepara os dados para atualização, tratando a relação 'perfil' separadamente
    const dataToUpdate: any = { ...updateFuncionarioDto };

    // Se id_perfil for fornecido no DTO de atualização, significa que o perfil associado será alterado
    if (updateFuncionarioDto.id_perfil !== undefined) {
      dataToUpdate.perfil = {
        connect: { id_perfil: updateFuncionarioDto.id_perfil },
      };
      // Remove id_perfil do objeto principal, pois ele é tratado pela relação
      delete dataToUpdate.id_perfil;
    }

    // Atualiza o funcionário no banco de dados
    return this.prisma.funcionario.update({
      where: { id_funcionario },
      data: dataToUpdate,
    });
  }

  async remove(id_funcionario: number): Promise<Funcionario> {
    // Verifica se o funcionário existe antes de tentar remover
    await this.findOne(id_funcionario);

    // Remove o funcionário do banco de dados
    return this.prisma.funcionario.delete({
      where: { id_funcionario },
    });
  }
}
