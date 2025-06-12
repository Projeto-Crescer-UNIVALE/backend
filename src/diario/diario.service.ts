import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';

@Injectable()
export class DiarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDiarioDto) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id_funcionario: dto.id_funcionario },
    });

    if (!funcionario) {
      throw new BadRequestException(
        `Funcionário com ID ${dto.id_funcionario} não existe.`,
      );
    }

    return this.prisma.diario.create({
      data: {
        ...dto,
        data_criacao: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.diario.findMany();
  }

  async findOne(id_diario: number) {
    const diario = await this.prisma.diario.findUnique({
      where: { id_diario },
    });

    if (!diario) {
      throw new NotFoundException(`Diário com ID ${id_diario} não encontrado.`);
    }
    return diario;
  }

  async update(id_diario: number, dto: UpdateDiarioDto) {
    // Garante que o registro existe antes de atualizar
    await this.findOne(id_diario);

    return this.prisma.diario.update({
      where: { id_diario },
      data: dto,
    });
  }
}
