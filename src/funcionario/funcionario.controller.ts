import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { PerfilRequired } from 'src/auth/decorator/perfil.decorator';
import { Perfil } from 'src/common/perfil.enum';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';

@PerfilRequired(Perfil.ADMINISTRADOR)
@Controller('funcionario')
export class FuncionarioController {
  constructor(private readonly funcionariosService: FuncionarioService) {}

  @Post()
  create(@Body() dto: CreateFuncionarioDto) {
    return this.funcionariosService.create(dto);
  }

  @Get()
  findAll(query: PaginationQueryDto) {
    return this.funcionariosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateFuncionarioDto,
  ) {
    return this.funcionariosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.remove(id);
  }
}
