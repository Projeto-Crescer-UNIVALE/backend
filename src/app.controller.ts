import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProgramasService } from './programas/programas.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly programasService: ProgramasService,
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  getProgramas() {
    return this.programasService.findAll();
  }
}
