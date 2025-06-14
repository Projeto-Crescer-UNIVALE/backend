import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { Funcionario } from './entities/funcionario.entity'; 
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Injectable()
export class FuncionarioService {
  constructor(private prisma: PrismaService) {}

  async create(criarFuncionarioDto: CreateFuncionarioDto): Promise<Funcionario> {
    const existeFuncionario = await this.prisma.funcionario.findFirst({
      where: { email: criarFuncionarioDto.email },
    });

    if (existeFuncionario) {
      throw new ConflictException('Já existe um funcionário com este e-mail.');
    }

    const novoFuncionario = await this.prisma.funcionario.create({
      data: {
        ...criarFuncionarioDto,
        status: criarFuncionarioDto.status,
      },
    });
    return novoFuncionario;
  }

  async findAll(): Promise<Funcionario[]> {
    return this.prisma.funcionario.findMany();
  }

  async findOne(id_funcionario: number): Promise<Funcionario> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario },
    });

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com ID ${id_funcionario} não encontrado.`);
    }
    return funcionario;
  }

  async update(id_funcionario: number, updateFuncionarioDto: UpdateFuncionarioDto): Promise<Funcionario> {
    await this.findOne(id_funcionario);

    if (updateFuncionarioDto.email) {
        const existingFuncionarioWithEmail = await this.prisma.funcionario.findFirst({
            where: {
                email: updateFuncionarioDto.email,
                NOT: {
                    id_funcionario: id_funcionario,
                },
            },
        });

        if (existingFuncionarioWithEmail) {
            throw new ConflictException('Já existe um funcionário com este e-mail.');
        }
    }

    const funcionarioAtualizado = await this.prisma.funcionario.update({
      where: { id_funcionario },
      data: updateFuncionarioDto,
    });
    return funcionarioAtualizado;
  }

  async remove(id_funcionario: number): Promise<Funcionario> {
    await this.findOne(id_funcionario);

    return this.prisma.funcionario.delete({
      where: { id_funcionario },
    });
  }
}
