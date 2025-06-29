import { IsString } from 'class-validator';

export class AlterarSenhaDto {
  @IsString()
  novaSenha: string;
  @IsString()
  confirmarNovaSenha: string;
}
