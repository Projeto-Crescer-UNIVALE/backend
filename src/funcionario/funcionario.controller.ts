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
import { NotAuth } from 'src/auth/decorator/not-auth.decorator';

@Controller('funcionario')
export class FuncionarioController {
  constructor(private readonly funcionariosService: FuncionarioService) {}

  @NotAuth()
  @Post()
  create(@Body() dto: CreateFuncionarioDto) {
    return this.funcionariosService.create(dto);
  }

  @NotAuth()
  @Get()
  findAll() {
    return this.funcionariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.findOne(id);
  }

  // @Get('buscar/nome/:nome')
  // findByNome(@Param('nome') nome: string) {
  //   return this.funcionariosService.findByNome(nome);
  // }

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
