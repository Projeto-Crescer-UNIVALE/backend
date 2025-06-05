import { Controller, Get } from '@nestjs/common';
import { ProgramasService } from './programas.service';

@Controller('programas')
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  @Get()
  findAll() {
    return this.programasService.findAll();
  }
}
