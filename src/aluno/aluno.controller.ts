import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('aluno')
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
  findOne(@Param('id') id: string) {
    return this.alunoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.alunoService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alunoService.remove(+id);
  }
}
