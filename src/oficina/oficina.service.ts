import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { Oficina } from 'generated/prisma';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';
import { Paginate } from 'src/common/utils/pagination';

@Injectable()
export class OficinaService {
  constructor(private prisma: PrismaService) {}

  private convertTimeStringToDate(timeString: string): Date {
    if (!/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      console.error(`Formato de hora inesperado: ${timeString}`);
      return new Date('Invalid Date');
    }
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return new Date(2000, 0, 1, hours, minutes, seconds);
  }

  async create(createOficinaDto: CreateOficinaDto): Promise<Oficina> {
    const { cronograma, ...oficinaData } = createOficinaDto;

    const existeOficina = await this.prisma.oficina.findFirst({
      where: {
        nome: oficinaData.nome,
      },
    });

    if (existeOficina) {
      throw new ConflictException('Já existe uma oficina com este nome.');
    }

    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario: oficinaData.id_funcionario },
    });

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com ID ${oficinaData.id_funcionario} não encontrado.`,
      );
    }

    const novaOficina = await this.prisma.oficina.create({
      data: {
        ...oficinaData,
        cronograma: {
          createMany: {
            data: cronograma.map((cronograma) => ({
              dia: cronograma.dia,
              hora_inicio: this.convertTimeStringToDate(cronograma.hora_inicio),
              hora_fim: this.convertTimeStringToDate(cronograma.hora_fim),
            })),
          },
        },
      },
      include: {
        cronograma: true,
      },
    });
    return novaOficina;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ data: Oficina[]; meta: any }> {
    const paginated = await Paginate<Oficina>(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      {
        includes: ['funcionario'],
        orderBy: { id_oficina: 'asc' },
        search: ['nome'],
      },
      this.prisma.oficina,
    );

    const ids = paginated.data.map((o) => o.id_oficina);

    const data = await this.prisma.oficina.findMany({
      where: { id_oficina: { in: ids }, excluido_em: null },
      include: {
        cronograma: true,
        funcionario: {
          select: {
            id_funcionario: true,
            id_perfil: true,
            nome: true,
            email: true,
            telefone: true,
            ativo: true,
          },
        },
      },
      orderBy: { id_oficina: 'asc' },
    });

    return { data, meta: paginated.meta };
  }

  async findOne(id_oficina: number): Promise<Oficina> {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id_oficina },
      include: {
        cronograma: true,
        funcionario: {
          omit: {
            senha: true,
          },
        },
      },
    });

    if (!oficina) {
      throw new NotFoundException(
        `Oficina com ID ${id_oficina} não encontrada.`,
      );
    }
    return oficina;
  }

  async update(
    id_oficina: number,
    updateOficinaDto: UpdateOficinaDto,
  ): Promise<Oficina> {
    await this.findOne(id_oficina);

    const { cronograma, ...oficinaData } = updateOficinaDto;

    const existingOficinaWithNome = await this.prisma.oficina.findFirst({
      where: {
        nome: oficinaData.nome,
        NOT: {
          id_oficina: id_oficina,
        },
      },
    });

    if (existingOficinaWithNome) {
      throw new ConflictException('Já existe outra oficina com este nome.');
    }

    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario: oficinaData.id_funcionario },
    });

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com ID ${oficinaData.id_funcionario} não encontrado.`,
      );
    }

    return await this.prisma.oficina.update({
      where: { id_oficina },
      data: {
        ...oficinaData,
        cronograma: {
          deleteMany: {
            id_oficina,
            NOT: cronograma.map(({ dia }) => ({ dia })),
          },
          upsert: cronograma.map((crono) => ({
            where: {
              id_oficina_cronograma: {
                dia: crono.dia,
                id_oficina,
              },
            },
            create: {
              dia: crono.dia,
              hora_inicio: this.convertTimeStringToDate(crono.hora_inicio),
              hora_fim: this.convertTimeStringToDate(crono.hora_fim),
            },
            update: {
              dia: crono.dia,
              hora_inicio: this.convertTimeStringToDate(crono.hora_inicio),
              hora_fim: this.convertTimeStringToDate(crono.hora_fim),
            },
          })),
        },
      },
      include: {
        cronograma: true,
        funcionario: {
          omit: {
            senha: true,
          },
        },
      },
    });
  }

  async remove(id_oficina: number): Promise<Oficina> {
    await this.findOne(id_oficina);

    return this.prisma.oficina.update({
      where: { id_oficina },
      data: {
        excluido_em: new Date(),
      },
    });
  }
}
