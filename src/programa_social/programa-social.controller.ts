import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProgramaSocialService } from './programa-social.service';
import { CreateProgramaSocialDto } from './dto/create-programa-social.dto';

@Controller('programa-social')
export class ProgramaSocialController {
  constructor(private readonly programaSocialService: ProgramaSocialService) {}

  @Get()
  findAll() {
    return this.programaSocialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.programaSocialService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProgramaSocialDto) {
    return this.programaSocialService.create(dto);
  }
}
