import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { PrismaService } from 'src/prisma.service';
import { Aluno } from './entities/aluno.entity';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async create(criarAlunoDto: CreateAlunoDto): Promise<Aluno> {
    const existeAluno = await this.prisma.aluno.findUnique({
      where: { cpf: criarAlunoDto.cpf },
    });

    if (existeAluno) {
      throw new ConflictException('Já existe esse aluno.');
    }
    return this.prisma.aluno.create({
      data: {
        ...criarAlunoDto,
        alergias: criarAlunoDto.alergias ?? '',
        necessidades_especiais: criarAlunoDto.necessidades_especiais ?? '',
        medicamentos: criarAlunoDto.medicamentos ?? '',
        status: criarAlunoDto.status,
      },
    });
  }

  async findAll() {
    return this.prisma.aluno.findMany();
  }

  async findOne(id_aluno: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
    });

    if (!aluno) {
      throw new NotFoundException(
        `Funcionário com ID ${id_aluno} não encontrado.`,
      );
    }
    return aluno;
  }

  async update(
    id_aluno: number,
    updateAlunoDTo: UpdateAlunoDto,
  ): Promise<Aluno> {
    const existeAluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: id_aluno },
    });

    if (!existeAluno) {
      throw new NotFoundException(
        `Aluno com ID ${id_aluno} não encontrado para atualização `,
      );
    }

    return this.prisma.aluno.update({
      where: { id_aluno: id_aluno },
      data: {
        ...updateAlunoDTo,
        ...(updateAlunoDTo.data_nascimento && {
          data_nascimento: new Date(updateAlunoDTo.data_nascimento),
        }),
      },
    });
  }

  async remove(id_aluno: number): Promise<Aluno> {
    await this.findOne(id_aluno);

    return this.prisma.aluno.delete({
      where: { id_aluno: id_aluno },
    });
  }
}
