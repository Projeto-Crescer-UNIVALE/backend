import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OficinaService } from './oficina.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { CreateDiarioDto } from './dto/create-diario.dto';

import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { ProfessorGuard } from './guards/professor.guard';

@Controller('oficinas')
export class OficinaController {
  constructor(private readonly oficinaService: OficinaService) {}

  // ------------------------------
  // CRUD de Oficinas (Administrador)
  // ------------------------------
  @Post()
  create(@Body() dto: CreateOficinaDto) {
    return this.oficinaService.create(dto);
  }

  @Get()
  findAll() {
    return this.oficinaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.oficinaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOficinaDto) {
    return this.oficinaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.oficinaService.remove(id);
  }

  // ------------------------------
  // Endpoints para Professores
  // ------------------------------
  @UseGuards(AuthTokenGuard, ProfessorGuard)
  @Get(':id_oficina/alunos')
  async getAlunosByOficina(
    @Param('id_oficina', ParseIntPipe) id_oficina: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.oficinaService.getAlunosByOficina(id_oficina, Number(page), Number(limit));
  }

  @UseGuards(AuthTokenGuard, ProfessorGuard)
  @Get(':id_oficina/alunos/:id_aluno')
  async getAlunoById(
    @Param('id_oficina', ParseIntPipe) id_oficina: number,
    @Param('id_aluno', ParseIntPipe) id_aluno: number,
  ) {
    return this.oficinaService.getAlunoById(id_oficina, id_aluno);
  }

  @UseGuards(AuthTokenGuard, ProfessorGuard)
  @Get(':id_oficina/diarios')
  async getDiarios(
    @Param('id_oficina', ParseIntPipe) id_oficina: number,
    @Request() req,
  ) {
    const professorId = req.user?.id_funcionario ?? req.user?.id;
    return this.oficinaService.getDiariosByOficina(id_oficina, professorId);
  }

  @UseGuards(AuthTokenGuard, ProfessorGuard)
  @Post(':id_oficina/diarios')
  async createDiario(
    @Param('id_oficina', ParseIntPipe) id_oficina: number,
    @Request() req,
    @Body() dto: CreateDiarioDto,
  ) {
    const professorId = req.user?.id_funcionario ?? req.user?.id;
    return this.oficinaService.createDiario({
      ...dto,
      id_oficina,
      id_autor: professorId,
    });
  }
}