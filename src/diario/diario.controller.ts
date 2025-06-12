import { Controller, Get, Post, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DiarioService } from './diario.service';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';

@Controller('diario')
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {}

  @Post()
  create(@Body() dto: CreateDiarioDto) {
    return this.diarioService.create(dto);
  }

  @Get()
  findAll() {
    return this.diarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.diarioService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDiarioDto) {
    return this.diarioService.update(id, dto);
  }
}
