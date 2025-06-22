import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { PerfilGuard } from 'src/auth/guard/perfil.guard';
import { PerfilRequired } from 'src/auth/decorator/perfil.decorator';
import { Perfil } from 'src/common/perfil.enum';

@UseGuards(PerfilGuard)
@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Post()
  @PerfilRequired(Perfil.ADMINISTRADOR)
  create(@Body() dto: CreateAlunoDto) {
    return this.alunoService.create(dto);
  }

  @Get()
  @PerfilRequired(Perfil.ADMINISTRADOR)
  findAll() {
    return this.alunoService.findAll();
  }

  @Get(':id')
  @PerfilRequired(Perfil.PROFESSOR, Perfil.ADMINISTRADOR)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alunoService.findOne(id);
  }

  @Put(':id')
  @PerfilRequired(Perfil.ADMINISTRADOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAlunoDto) {
    return this.alunoService.update(id, dto);
  }

  @Delete(':id')
  @PerfilRequired(Perfil.ADMINISTRADOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alunoService.remove(id);
  }
}
