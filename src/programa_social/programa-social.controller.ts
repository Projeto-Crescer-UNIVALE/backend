import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProgramaSocialService } from './programa-social.service';
import { CreateProgramaSocialDto } from './dto/create-programa-social.dto';
import { PerfilRequired } from 'src/auth/decorator/perfil.decorator';
import { Perfil } from 'src/common/perfil.enum';
import { PaginationQueryDto } from 'src/common/utils/dto/pagination-query.dto';

@PerfilRequired(Perfil.ADMINISTRADOR)
@Controller('programa-social')
export class ProgramaSocialController {
  constructor(private readonly programaSocialService: ProgramaSocialService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.programaSocialService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateProgramaSocialDto) {
    return this.programaSocialService.create(dto);
  }
}
