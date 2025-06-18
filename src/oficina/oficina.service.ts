import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { Oficina } from 'generated/prisma';

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

  async findAll(): Promise<Oficina[]> {
    return this.prisma.oficina.findMany({
      include: {
        cronograma: true,
      },
    });
  }

  async findOne(id_oficina: number): Promise<Oficina> {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id_oficina },
      include: {
        cronograma: true,
      },
    });

    if (!oficina) {
      throw new NotFoundException(`Oficina com ID ${id_oficina} não encontrada.`);
    }
    return oficina;
  }

  async update(id_oficina: number, updateOficinaDto: UpdateOficinaDto): Promise<Oficina> {
    await this.findOne(id_oficina);

    const { cronograma, ...oficinaData } = updateOficinaDto;

    if (oficinaData.nome) {
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
    }

    return await this.prisma.oficina.update({
      where: { id_oficina },
      data: {
        ...oficinaData, 
        cronograma: {
          deleteMany: {
            id_oficina, 
            NOT: cronograma.map(({ dia }) => ({ dia }))
          },
        }

     } ,
    });
  }

  async remove(id_oficina: number): Promise<Oficina> {
    await this.findOne(id_oficina);

    await this.prisma.oficinaCronograma.deleteMany({
      where: { id_oficina },
    });

    return this.prisma.oficina.delete({
      where: { id_oficina },
    });
  }
}
