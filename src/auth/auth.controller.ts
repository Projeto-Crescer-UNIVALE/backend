import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { NotAuth } from './decorator/not-auth.decorator';
import { VerificaTokenDto } from './dto/verifica-token.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import { UsuarioAtual } from './decorator/usuario-atual.decorator';
import { UpdateFuncionarioDto } from 'src/funcionario/dto/update-funcionario.dto';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import { Funcionario } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @NotAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const result = await this.authService.validateUser(loginDto);
    if (!result) {
      throw new UnauthorizedException('Funcionário ou senha inválidos.');
    }
    return result;
  }

  @NotAuth()
  @Post('verifica-token')
  async verificaToken(@Body() verificaTokenDto: VerificaTokenDto) {
    return this.authService.verificaToken(verificaTokenDto);
  }

  @NotAuth()
  @Post('recuperar-senha')
  async recuperarSenha(@Body() recuperSenhaDto: RecuperarSenhaDto) {
    await this.authService.recuperarSenha(recuperSenhaDto.email);

    return {
      message:
        'Solicitação enviada. Se esse e-mail corresponder a uma conta cadastrada, você receberá um e-mail com instruções para alterar sua senha.',
    };
  }

  @Post('alterar-senha')
  async alterarSenha(
    @UsuarioAtual() funcionario: Funcionario,
    @Body() alterarSenhaDto: AlterarSenhaDto,
  ) {
    const id_funcionario = funcionario.id_funcionario;

    await this.authService.alterarSenha(id_funcionario, alterarSenhaDto);
    return {
      message: 'Sua senha foi alterada com sucesso.',
    };
  }
}
