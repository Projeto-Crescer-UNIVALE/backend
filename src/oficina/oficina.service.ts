// src/oficina/oficina.service.ts

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { Oficina } from './entity/oficina.entity';

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
    const { dias, ...oficinaData } = createOficinaDto;

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
        oficina_dias: {
          createMany: {
            data: dias.map((dia) => ({
              dias: dia.dias,
              hora_inicio: this.convertTimeStringToDate(dia.hora_inicio),
              hora_fim: this.convertTimeStringToDate(dia.hora_fim),
            })),
          },
        },
      },
      include: {
        oficina_dias: true,
      },
    });
    return novaOficina;
  }

  async findAll(): Promise<Oficina[]> {
    return this.prisma.oficina.findMany({
      include: {
        oficina_dias: true,
      },
    });
  }

  async findOne(id_oficina: number): Promise<Oficina> {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id_oficina },
      include: {
        oficina_dias: true,
      },
    });

    if (!oficina) {
      throw new NotFoundException(`Oficina com ID ${id_oficina} não encontrada.`);
    }
    return oficina;
  }

  async update(id_oficina: number, updateOficinaDto: UpdateOficinaDto): Promise<Oficina> {
    await this.findOne(id_oficina);

    const { dias, ...oficinaData } = updateOficinaDto;

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

    await this.prisma.oficina.update({
      where: { id_oficina },
      data: oficinaData,
    });

    if (dias !== undefined) {
      await this.prisma.oficinaDias.deleteMany({
        where: { id_oficina },
      });
      await this.prisma.oficinaDias.createMany({
        data: dias.map((dia) => ({
          id_oficina,
          dias: dia.dias,
          hora_inicio: this.convertTimeStringToDate(dia.hora_inicio),
          hora_fim: this.convertTimeStringToDate(dia.hora_fim),
        })),
        skipDuplicates: true,
      });
    }

    const oficinaAtualizada = await this.prisma.oficina.findUnique({
      where: { id_oficina },
      include: {
        oficina_dias: true,
      },
    });

    if (!oficinaAtualizada) {
      throw new NotFoundException(
        `Oficina com ID ${id_oficina} não encontrada após atualização.`,
      );
    }

    return oficinaAtualizada;
  }

  async remove(id_oficina: number): Promise<Oficina> {
    await this.findOne(id_oficina);

    await this.prisma.oficinaDias.deleteMany({
      where: { id_oficina },
    });

    return this.prisma.oficina.delete({
      where: { id_oficina },
    });
  }
}
