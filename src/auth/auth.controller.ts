import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { NotAuth } from './decorator/not-auth.decorator';
import { VerificaTokenDto } from './dto/verifica-token.dto';

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
}
