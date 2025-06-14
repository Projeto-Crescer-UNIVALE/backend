import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alunoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAlunoDto) {
    return this.alunoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alunoService.remove(id);
  }
}
