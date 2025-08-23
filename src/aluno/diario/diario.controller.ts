import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DiarioService } from './diario.service';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { PerfilRequired } from 'src/auth/decorator/perfil.decorator';
import { Perfil } from 'src/common/perfil.enum';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';

@PerfilRequired(Perfil.ADMINISTRADOR)
@Controller('aluno/:idAluno/diario')
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {}

  @Post()
  create(
    @Param('idAluno', ParseIntPipe) idAluno: number,
    @Body() dto: CreateDiarioDto,
  ) {
    return this.diarioService.create(idAluno, dto);
  }

  @Get()
  findAll(
    @Param('idAluno', ParseIntPipe) idAluno: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.diarioService.findAll(idAluno, query);
  }

  @Get(':id')
  findOne(
    @Param('idAluno', ParseIntPipe) idAluno: number,
    @Param('id', ParseIntPipe) id_diario: number,
  ) {
    return this.diarioService.findOne(idAluno, id_diario);
  }

  @Put(':id')
  update(
    @Param('idAluno', ParseIntPipe) idAluno: number,
    @Param('id', ParseIntPipe) id_diario: number,
    @Body() dto: UpdateDiarioDto,
  ) {
    return this.diarioService.update(idAluno, id_diario, dto);
  }

  @Delete(':id')
  delete(
    @Param('idAluno', ParseIntPipe) idAluno: number,
    @Param('id', ParseIntPipe) id_diario: number,
  ) {
    return this.diarioService.delete(idAluno, id_diario);
  }
}
