import { IsString, IsEmail, IsInt, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateFuncionarioDto {
  @IsInt()
  id_perfil: number;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nome: string;

  @IsEmail()
  @MaxLength(250)
  email: string;

  @IsString()
  telefone: string;

  @IsBoolean()
  status: boolean;
}
