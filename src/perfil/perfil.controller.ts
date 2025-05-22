import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPerfilDto: CreatePerfilDto) {
    return this.perfilService.create(createPerfilDto);
  }

  @Get()
  findAll() {
    return this.perfilService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id_perfil: number) {
    return this.perfilService.findOne(id_perfil);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id_perfil: number,
    @Body() updatePerfilDto: UpdatePerfilDto,
  ) {
    return this.perfilService.update(id_perfil, updatePerfilDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id_perfil: number) {
    return this.perfilService.remove(id_perfil);
  }
}
