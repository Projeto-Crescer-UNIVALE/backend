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
    const { programa_social, ...alunoData } = criarAlunoDto;

    const existeAluno = await this.prisma.aluno.findUnique({
      where: { cpf: criarAlunoDto.cpf },
    });

    if (existeAluno) {
      throw new ConflictException('Já existe um aluno com este CPF.');
    }

    return this.prisma.aluno.create({
      data: {
        ...alunoData,
        programaSocial:
          programa_social && programa_social.length > 0
            ? {
                create: programa_social.map((id_programa_social) => ({
                  programaSocial: {
                    connect: { id_programa_social },
                  },
                })),
              }
            : undefined,
      },
      include: {
        programaSocial: {
          include: { programaSocial: true },
        },
      },
    });
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

    const dataToUpdate: any = {
      ...updateAlunoDTo,
    };

    return this.prisma.aluno.update({
      where: { id_aluno: id_aluno },
      data: dataToUpdate,
    });
  }

  async remove(id_aluno: number): Promise<Aluno> {
    await this.findOne(id_aluno);

    return this.prisma.aluno.delete({
      where: { id_aluno: id_aluno },
    });
  }
}
