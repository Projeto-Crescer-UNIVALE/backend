import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { PrismaService } from 'src/prisma.service';
import { Aluno } from 'generated/prisma';
import { paginator } from 'src/common/utils/pagination';
import { PaginationQueryDto } from '../common/utils/dto/pagination-query.dto';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async create(criarAlunoDto: CreateAlunoDto): Promise<Aluno> {
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

    const oficinasIds = criarAlunoDto.oficinas || [];
    if (oficinasIds.length > 0) {
      const oficinasValidas = await this.prisma.oficina.findMany({
        where: {
          id_oficina: { in: oficinasIds },
          excluido_em: null,
        },
      });

      if (oficinasValidas.length !== oficinasIds.length) {
        const idsEncontrados = oficinasValidas.map((o) => o.id_oficina);
        const idsNaoEncontrados = oficinasIds.filter(
          (id) => !idsEncontrados.includes(id),
        );
        throw new NotFoundException(
          `Oficina(s) com ID(s) ${idsNaoEncontrados.join(', ')} não encontrada(s).`,
        );
      }
    }

    const novoAluno = await this.prisma.aluno.create({
      data: {
        ...criarAlunoDto,
        programaSocial: {
          connect:
            criarAlunoDto.programaSocial.map((programa) => ({
              id_programa_social: programa,
            })) || [],
        },
        oficinas:
          oficinasIds.length > 0
            ? {
                create: oficinasIds.map((id_oficina) => ({
                  id_oficina,
                  ativo: true,
                })),
              }
            : undefined,
      },
      include: {
        programaSocial: true,
        oficinas: {
          where: { ativo: true },
          include: {
            oficina: true,
          },
        },
      },
    });

    return novoAluno;
  }

  async findAll(query: PaginationQueryDto) {
    return paginator<Aluno>(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
        where: { excluido_em: null },
      },
      {
        includes: ['programaSocial', 'oficinas.oficina'],
        orderBy: { id_aluno: 'asc' },
        search: ['nome', 'cpf'],
      },
      this.prisma.aluno,
    );
  }

  async findOne(id_aluno: number): Promise<Aluno> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: {
        programaSocial: true,
        oficinas: {
          where: { ativo: true },
          include: {
            oficina: true,
          },
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

    const oficinasIds = updateAlunoDTo.oficinas || [];
    if (oficinasIds.length > 0) {
      const oficinasValidas = await this.prisma.oficina.findMany({
        where: {
          id_oficina: { in: oficinasIds },
          excluido_em: null,
        },
      });

      if (oficinasValidas.length !== oficinasIds.length) {
        const idsEncontrados = oficinasValidas.map((o) => o.id_oficina);
        const idsNaoEncontrados = oficinasIds.filter(
          (id) => !idsEncontrados.includes(id),
        );
        throw new NotFoundException(
          `Oficina(s) com ID(s) ${idsNaoEncontrados.join(', ')} não encontrada(s).`,
        );
      }
    }

    // Buscar todos os vínculos (ativos e inativos)
    const vinculosExistentes = await this.prisma.alunoOficina.findMany({
      where: { id_aluno },
      select: { id_oficina: true, ativo: true },
    });

    const vinculosMap = new Map(
      vinculosExistentes.map((v) => [v.id_oficina, v.ativo]),
    );

    const operacoes: any[] = [];

    // Para cada oficina no array de entrada
    for (const id_oficina of oficinasIds) {
      if (vinculosMap.has(id_oficina)) {
        // Vínculo existe
        if (!vinculosMap.get(id_oficina)) {
          // Se está inativo, reativar
          operacoes.push(
            this.prisma.alunoOficina.update({
              where: {
                id_aluno_id_oficina: { id_aluno, id_oficina },
              },
              data: { ativo: true },
            }),
          );
        }
        // Se já está ativo, não faz nada
      } else {
        // Vínculo não existe, criar
        operacoes.push(
          this.prisma.alunoOficina.create({
            data: {
              id_aluno,
              id_oficina,
              ativo: true,
            },
          }),
        );
      }
    }

    for (const [id_oficina, ativo] of vinculosMap) {
      if (ativo && !oficinasIds.includes(id_oficina)) {
        operacoes.push(
          this.prisma.alunoOficina.update({
            where: {
              id_aluno_id_oficina: { id_aluno, id_oficina },
            },
            data: { ativo: false },
          }),
        );
      }
    }

    if (operacoes.length > 0) {
      await this.prisma.$transaction(operacoes);
    }

    const { oficinas, ...dadosSemOficinas } = updateAlunoDTo;

    const alunoAtualizado = await this.prisma.aluno.update({
      where: { id_aluno },
      data: {
        ...dadosSemOficinas,
        programaSocial: {
          set:
            updateAlunoDTo.programaSocial.map((programa) => ({
              id_programa_social: programa,
            })) || [],
        },
      },
      include: {
        programaSocial: true,
        oficinas: {
          where: { ativo: true },
          include: {
            oficina: true,
          },
        },
      },
    });

    return alunoAtualizado;
  }

  async remove(id_aluno: number): Promise<Aluno> {
    await this.findOne(id_aluno);

    // 🔹 soft delete: marca excluido_em em vez de apagar
    return this.prisma.aluno.update({
      where: { id_aluno: id_aluno },
      data: { excluido_em: new Date() },
    });
  }

  async findAlunosByOficina(id_oficina: number) {
    const alunos = await this.prisma.alunoOficina.findMany({
      where: {
        id_oficina,
        ativo: true,
        aluno: {
          excluido_em: null,
          ativo: true,
        },
      },
      include: {
        aluno: {
          select: {
            id_aluno: true,
            nome: true,
            cpf: true,
            telefone: true,
            grupo_scfv: true,
            data_nascimento: true,
          },
        },
      },
    });

    return alunos.map((ao) => ao.aluno);
  }
}
