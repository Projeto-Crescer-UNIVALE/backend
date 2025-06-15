import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';

@Controller('funcionario')
export class FuncionarioController {
  constructor(private readonly funcionariosService: FuncionarioService) {}

  @Post()
  create(@Body() dto: CreateFuncionarioDto) {
    return this.funcionariosService.create(dto);
  }

  @Get()
  findAll() {
    return this.funcionariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateFuncionarioDto,
  ) {
    return this.funcionariosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.remove(id);
  }

  @Get('primeiro-acesso/:token')
  async validarToken(@Param('token') token: string) {
    const resultado = await this.funcionariosService.validarTokenPrimeiroAcesso(token);

    if (!resultado.valido) {
      throw new BadRequestException(resultado.mensagem);
    }

    return { funcionario: resultado.funcionario };
  }

  @Post('primeiro-acesso/definir-senha')
  async definirSenha(
    @Body('token') token: string,
    @Body('senha') senha: string,
  ) {
    const resultado = await this.funcionariosService.definirSenhaPrimeiroAcesso(token, senha);

    if (!resultado.sucesso) {
      throw new BadRequestException(resultado.mensagem);
    }

    return { mensagem: 'Senha definida com sucesso!' };
  }
}
