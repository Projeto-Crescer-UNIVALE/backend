import { IsEnum, IsUUID } from 'class-validator';
import { TokenTipo } from 'generated/prisma';

export class VerificaTokenDto {
  @IsUUID()
  token: string;
  @IsEnum(TokenTipo)
  tipoToken: TokenTipo;
}
