import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { PrismaService } from 'src/prisma.service';
import { Aluno } from 'generated/prisma';

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

    const programasSociaisValidos = await this.prisma.programaSocial.findMany();
    const programasSociais = criarAlunoDto.programaSocial || [];

    for (const programa of programasSociais) {
      if (
        !programasSociaisValidos.some(
          (validos) => validos.id_programa_social === programa,
        )
      ) {
        throw new NotFoundException(
          `Programa social com ID ${programa} não encontrado.`,
        );
      }
    }

    const novoAluno = await this.prisma.aluno.create({
      data: {
        ...alunoData,
        programaSocial: {
          connect:
            criarAlunoDto.programaSocial?.map((programa) => ({
              id_programa_social: programa,
            })) || [],
        },
      },
      include: {
        programaSocial: true,
      },
    });

    return novoAluno;
  }

  async findAll(): Promise<Aluno[]> {
    return this.prisma.aluno.findMany({
      include: {
        programaSocial: true,
      },
    });
  }

  async findOne(id_aluno: number): Promise<Aluno> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: {
        programaSocial: true,
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

    const programasSociaisValidos = await this.prisma.programaSocial.findMany();
    const programasSociais = updateAlunoDTo.programaSocial || [];

    for (const programa of programasSociais) {
      if (
        !programasSociaisValidos.some(
          (validos) => validos.id_programa_social === programa,
        )
      ) {
        throw new NotFoundException(
          `Programa social com ID ${programa} não encontrado.`,
        );
      }
    }

    const alunoAtualizado = await this.prisma.aluno.update({
      where: { id_aluno },
      data: {
        ...updateAlunoDTo,
        programaSocial: {
          set:
            updateAlunoDTo.programaSocial?.map((programa) => ({
              id_programa_social: programa,
            })) || [],
        },
      },
      include: {
        programaSocial: true,
      },
    });

    return alunoAtualizado;
  }

  async remove(id_aluno: number): Promise<Aluno> {
    await this.findOne(id_aluno);

    return this.prisma.aluno.delete({
      where: { id_aluno: id_aluno },
    });
  }
}
