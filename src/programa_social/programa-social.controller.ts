import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProgramaSocialService } from './programa-social.service';
import { CreateProgramaSocialDto } from './dto/create-programa-social.dto';
import { PerfilRequired } from 'src/auth/decorator/perfil.decorator';
import { Perfil } from 'src/common/perfil.enum';

@PerfilRequired(Perfil.ADMINISTRADOR)
@Controller('programa-social')
export class ProgramaSocialController {
  constructor(private readonly programaSocialService: ProgramaSocialService) {}

  @Get()
  findAll() {
    return this.programaSocialService.findAll();
  }

  @Post()
  create(@Body() dto: CreateProgramaSocialDto) {
    return this.programaSocialService.create(dto);
  }
}
