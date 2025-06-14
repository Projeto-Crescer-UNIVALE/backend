// src/oficina/oficina.controller.ts

import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  ParseIntPipe, // Para converter o ID da rota para número inteiro
} from '@nestjs/common';
import { OficinaService } from './oficina.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { Oficina } from './entity/oficina.entity'; // Importa a entidade Oficina

@Controller('oficina') // Define o prefixo da rota para este controlador
export class OficinaController {
  constructor(private readonly oficinaService: OficinaService) {}

  /**
   * Endpoint POST para criar uma nova oficina.
   * Recebe os dados da oficina no corpo da requisição.
   * @param dto O objeto de transferência de dados (DTO) para criação de oficina.
   * @returns A oficina recém-criada.
   */
  @Post()
  create(@Body() dto: CreateOficinaDto): Promise<Oficina> {
    return this.oficinaService.create(dto);
  }

  /**
   * Endpoint GET para buscar todas as oficinas.
   * @returns Um array de todas as oficinas.
   */
  @Get()
  findAll(): Promise<Oficina[]> {
    return this.oficinaService.findAll();
  }

  /**
   * Endpoint GET para buscar uma oficina específica por ID.
   * @param id O ID da oficina (extraído da URL e convertido para número).
   * @returns A oficina encontrada.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Oficina> {
    return this.oficinaService.findOne(id);
  }

  /**
   * Endpoint PUT para atualizar uma oficina existente por ID.
   * Recebe o ID da oficina na URL e os dados de atualização no corpo da requisição.
   * @param id O ID da oficina a ser atualizada.
   * @param dto O DTO contendo os dados para atualização da oficina.
   * @returns A oficina atualizada.
   */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOficinaDto): Promise<Oficina> {
    return this.oficinaService.update(id, dto);
  }

  /**
   * Endpoint DELETE para remover uma oficina por ID.
   * @param id O ID da oficina a ser removida.
   * @returns A oficina que foi removida.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Oficina> {
    return this.oficinaService.remove(id);
  }
}
