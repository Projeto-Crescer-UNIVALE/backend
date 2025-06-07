import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { PrismaService } from 'src/prisma.service';
import { Aluno } from './entity/aluno.entity';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async create(criarAlunoDto: CreateAlunoDto): Promise<Aluno> {
    const { programaSocial, ...alunoData } = criarAlunoDto;

    const existeAluno = await this.prisma.aluno.findUnique({
      where: { cpf: criarAlunoDto.cpf },
    });

    if (existeAluno) {
      throw new ConflictException('Já existe um aluno com este CPF.');
    }

    const novoAluno = await this.prisma.aluno.create({
      data: {
        ...alunoData,
      },
    });

    if (programaSocial && programaSocial.length > 0) {
      await this.prisma.alunoProgramaSocial.createMany({
        data: programaSocial.map((id_programa_social) => ({
          id_aluno: novoAluno.id_aluno,
          id_programa_social,
        })),
        skipDuplicates: true, // evita erro se a associação já existir
      });
    }

    const alunoCriado = await this.prisma.aluno.findUnique({
      where: { id_aluno: novoAluno.id_aluno },
      include: {
        programaSocial: {
          include: {
            programaSocial: true,
          },
        },
      },
    });

    if (!alunoCriado) {
      throw new NotFoundException('Aluno criado não foi encontrado.');
    }

    return alunoCriado;
  }

  async findAll(): Promise<Aluno[]> {
    return this.prisma.aluno.findMany({
      include: {
        programaSocial: {
          include: { programaSocial: true },
        },
      },
    });
  }

  async findOne(id_aluno: number): Promise<Aluno> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: {
        programaSocial: {
          include: { programaSocial: true },
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${id_aluno} não encontrado.`);
    }
    return aluno;
  }

  async update(
    id_aluno: number,
    updateAlunoDTo: CreateAlunoDto,
  ): Promise<Aluno> {
    await this.findOne(id_aluno);

    const { programaSocial, ...alunoData } = updateAlunoDTo;

    const existingAlunoWithCpf = await this.prisma.aluno.findUnique({
      where: {
        cpf: updateAlunoDTo.cpf,
        AND: {
          id_aluno: { not: id_aluno },
        },
      },
    });

    if (existingAlunoWithCpf) {
      throw new ConflictException('Já existe um aluno com esse CPF.');
    }

    await this.prisma.aluno.update({
      where: { id_aluno },
      data: alunoData,
    });

    await this.prisma.alunoProgramaSocial.deleteMany({
      where: { id_aluno },
    });

    if (programaSocial && programaSocial.length > 0) {
      await this.prisma.alunoProgramaSocial.createMany({
        data: programaSocial.map((id_programa_social) => ({
          id_aluno,
          id_programa_social,
        })),
        skipDuplicates: true,
      });
    }

    const alunoAtualizado = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: {
        programaSocial: {
          include: { programaSocial: true },
        },
      },
    });

    if (!alunoAtualizado) {
      throw new NotFoundException(
        `Aluno com ID ${id_aluno} não encontrado após atualização.`,
      );
    }

    return alunoAtualizado;
  }

  async remove(id_aluno: number): Promise<Aluno> {
    await this.findOne(id_aluno);

    return this.prisma.aluno.delete({
      where: { id_aluno: id_aluno },
    });
  }
}
