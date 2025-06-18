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
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Post()
  create(
    @Body() dto: CreateAlunoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.alunoService.create(dto, tokenPayload);
  }

  @Roles(1)
  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  @Roles(2)
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
