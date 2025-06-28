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
import { NotAuth } from 'src/auth/decorator/not-auth.decorator';

@PerfilRequired(Perfil.ADMINISTRADOR) 
@Controller('aluno') // ENDPOINT <------------------
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Post()
  create(@Body() dto: CreateAlunoDto) {
    return this.alunoService.create(dto);
  }

  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  @Get(':id')
  @PerfilRequired(Perfil.PROFESSOR, Perfil.ADMINISTRADOR) 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alunoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAlunoDto) {
    return this.alunoService.update(id, dto);
  }

  // @NotAuth() // Exemplo de rota que não exigirá autenticação para funcionar.
  @Delete(':id')
  @PerfilRequired(Perfil.PROFESSOR) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alunoService.remove(id);
  }
}
