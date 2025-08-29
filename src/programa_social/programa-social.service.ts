// src/programa-social/programa-social.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProgramaSocialDto } from './dto/create-programa-social.dto';
import { ProgramaSocial } from './entity/programa-social.entity';
import { paginator } from 'src/common/utils/pagination';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';

@Injectable()
export class ProgramaSocialService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProgramaSocialDto: CreateProgramaSocialDto,
  ): Promise<ProgramaSocial> {
    const existePrograma = await this.prisma.programaSocial.findFirst({
      where: {
        nome: createProgramaSocialDto.nome,
      },
    });

    if (existePrograma) {
      throw new ConflictException(
        'Já existe um programa social com este nome.',
      );
    }

    return this.prisma.programaSocial.create({
      data: {
        nome: createProgramaSocialDto.nome,
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    return paginator<ProgramaSocial>(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      {
        orderBy: { id_programa_social: 'asc' },
        search: ['nome'],
      },
      this.prisma.programaSocial,
    );
  }
}
