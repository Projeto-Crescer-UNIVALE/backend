// src/perfil/perfil.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { PrismaService } from '../prisma/prisma.service'; // Importa o PrismaService
import { Perfil } from './entities/perfil.entity'; // Importa o tipo Perfil da sua interface

@Injectable()
export class PerfilService {
  constructor(private prisma: PrismaService) {}

  async create(createPerfilDto: CreatePerfilDto): Promise<Perfil> {
    // Verifica se já existe um perfil com o mesmo nome
    const existingPerfil = await this.prisma.perfil.findFirst({
      where: { nome: createPerfilDto.nome },
    });

    if (existingPerfil) {
      throw new ConflictException('Já existe um perfil com este nome.');
    }

    // Cria o perfil no banco de dados
    return this.prisma.perfil.create({
      data: createPerfilDto,
    });
  }

  async findAll(): Promise<Perfil[]> {
    return this.prisma.perfil.findMany();
  }

  async findOne(id_perfil: number): Promise<Perfil> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { id_perfil },
    });

    if (!perfil) {
      throw new NotFoundException(`Perfil com ID ${id_perfil} não encontrado.`);
    }
    return perfil;
  }

  async update(
    id_perfil: number,
    updatePerfilDto: UpdatePerfilDto,
  ): Promise<Perfil> {
    // Verifica se o perfil existe
    await this.findOne(id_perfil);

    // Se o nome estiver sendo atualizado, verifica se já está em uso por outro perfil
    if (updatePerfilDto.nome) {
      const existingPerfil = await this.prisma.perfil.findFirst({
        where: { nome: updatePerfilDto.nome },
      });

      if (existingPerfil && existingPerfil.id_perfil !== id_perfil) {
        throw new ConflictException(
          'Este nome de perfil já está em uso por outro perfil.',
        );
      }
    }

    // Atualiza o perfil no banco de dados
    return this.prisma.perfil.update({
      where: { id_perfil },
      data: updatePerfilDto,
    });
  }

  /**
   * Remove um perfil pelo seu ID.
   * @param id_perfil O ID do perfil a ser removido.
   * @returns O perfil removido.
   * @throws NotFoundException se o perfil não for encontrado.
   */
  async remove(id_perfil: number): Promise<Perfil> {
    // Verifica se o perfil existe antes de tentar remover
    await this.findOne(id_perfil);

    // Remove o perfil do banco de dados
    return this.prisma.perfil.delete({
      where: { id_perfil },
    });
  }
}
