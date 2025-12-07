import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { paginator } from 'src/common/utils/pagination';
import { Diario } from 'generated/prisma';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';

@Injectable()
export class DiarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(idAluno: number, dto: CreateDiarioDto) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
    });
    if (!aluno) throw new NotFoundException(`Aluno ${idAluno} não existe.`);

    const autor = await this.prisma.funcionario.findUnique({
      where: { id_funcionario: dto.id_autor },
    });
    if (!autor)
      throw new BadRequestException(`Autor ${dto.id_autor} não existe.`);

    if (dto.id_oficina) {
      const oficina = await this.prisma.oficina.findUnique({
        where: { id_oficina: dto.id_oficina },
      });
      if (!oficina)
        throw new BadRequestException(`Oficina ${dto.id_oficina} não existe.`);
    }

    return this.prisma.diario.create({
      data: {
        id_aluno: idAluno,
        id_autor: dto.id_autor,
        id_oficina: dto.id_oficina || null,
        conteudo: dto.conteudo,
      },
    });
  }

  async findAll(idAluno: number, query: PaginationQueryDto) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
    });
    if (!aluno) throw new NotFoundException(`Aluno ${idAluno} não existe.`);

    return paginator<Diario>(
      {
        where: { id_aluno: idAluno },
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      {
        includes: ['autor', 'oficina'],
        orderBy: { id_diario: 'desc' },
        search: ['criado_em'],
      },
      this.prisma.diario,
    );
  }

  async findOne(idAluno: number, id_diario: number) {
    const diario = await this.prisma.diario.findFirst({
      where: {
        id_diario,
        id_aluno: idAluno,
        excluido_em: null,
      },
    });
    if (!diario)
      throw new NotFoundException(
        `Diário ${id_diario} não encontrado para o aluno ${idAluno}.`,
      );
    return diario;
  }

  async update(idAluno: number, id_diario: number, dto: UpdateDiarioDto) {
    await this.findOne(idAluno, id_diario);

    if (dto.id_autor) {
      const autor = await this.prisma.funcionario.findUnique({
        where: { id_funcionario: dto.id_autor },
      });
      if (!autor)
        throw new BadRequestException(`Autor ${dto.id_autor} não existe.`);
    }

    if (dto.id_oficina) {
      const oficina = await this.prisma.oficina.findUnique({
        where: { id_oficina: dto.id_oficina },
      });
      if (!oficina)
        throw new BadRequestException(`Oficina ${dto.id_oficina} não existe.`);
    }

    return this.prisma.diario.update({
      where: { id_diario },
      data: dto,
    });
  }

  async delete(idAluno: number, id_diario: number) {
    await this.findOne(idAluno, id_diario);

    return this.prisma.diario.update({
      where: { id_diario },
      data: {
        excluido_em: new Date(), //  exclusão lógica
      },
    });
  }
}
