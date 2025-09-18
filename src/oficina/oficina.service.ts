import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class OficinaService {
  // ------------------------------
  // CRUD de Oficinas (Administrador)
  // ------------------------------
  async findAll() {
    return await prisma.oficina.findMany({
      include: {
        funcionario: true,
        cronograma: true,
        diarios: true,
      },
    });
  }

  async findOne(id_oficina: number) {
    const oficina = await prisma.oficina.findUnique({
      where: { id_oficina },
      include: {
        funcionario: true,
        cronograma: true,
        diarios: true,
      },
    });

    if (!oficina) {
      throw new NotFoundException('Oficina não encontrada');
    }

    return oficina;
  }

  async create(data: {
    nome: string;
    descricao: string;
    status: boolean;
    id_funcionario: number;
  }) {
    return await prisma.oficina.create({ data });
  }

  async update(
    id_oficina: number,
    data: Partial<{ nome: string; descricao: string; status: boolean }>,
  ) {
    try {
      return await prisma.oficina.update({
        where: { id_oficina },
        data,
      });
    } catch {
      throw new NotFoundException('Oficina não encontrada para atualizar');
    }
  }

  async remove(id_oficina: number) {
    try {
      return await prisma.oficina.update({
        where: { id_oficina },
        data: { excluido_em: new Date() },
      });
    } catch {
      throw new NotFoundException('Oficina não encontrada para excluir');
    }
  }

  // ------------------------------
  // Cronograma
  // ------------------------------
  async addCronograma(
    id_oficina: number,
    dia: number,
    hora_inicio: string,
    hora_fim: string,
  ) {
    return await prisma.oficinaCronograma.create({
      data: {
        id_oficina,
        dia,
        hora_inicio: new Date('1970-01-01T${hora_inicio}:00'),
        hora_fim: new Date('1970-01-01T${hora_fim}:00'),
      },
    });
  }

  async getCronogramas(id_oficina: number) {
    return await prisma.oficinaCronograma.findMany({
      where: { id_oficina },
    });
  }

  // ------------------------------
  // Alunos por oficina
  // ------------------------------
  async getAlunosByOficina(id_oficina: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const alunos = await prisma.aluno.findMany({
      skip,
      take: limit,
      where: {
        diarios: {
          some: { id_oficina },
        },
      },
      select: {
        id_aluno: true,
        nome: true,
        data_nascimento: true,
      },
    });

    const total = await prisma.aluno.count({
      where: {
        diarios: {
          some: { id_oficina },
        },
      },
    });

    return {
      data: alunos,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getAlunoById(id_oficina: number, id_aluno: number) {
    const aluno = await prisma.aluno.findFirst({
      where: {
        id_aluno,
        diarios: { some: { id_oficina } },
      },
      select: {
        id_aluno: true,
        nome: true,
        data_nascimento: true,
      },
    });

    if (!aluno) {
      throw new NotFoundException(
        'Aluno não encontrado nesta oficina ou não existe',
      );
    }

    return aluno;
  }

  // ------------------------------
  // Diários (Professor)
  // ------------------------------
  async createDiario(data: {
    id_aluno: number;
    id_oficina: number;
    id_autor: number;
    conteudo: string;
  }) {
    return await prisma.diario.create({ data });
  }

  async getDiariosByOficina(id_oficina: number, professorId: number) {
    return await prisma.diario.findMany({
      where: {
        id_oficina,
        id_autor: professorId,
      },
      include: {
        aluno: {
          select: { id_aluno: true, nome: true },
        },
        autor: {
          select: { id_funcionario: true, nome: true },
        },
        oficina: {
          select: { id_oficina: true, nome: true },
        },
      },
    });
  }
}