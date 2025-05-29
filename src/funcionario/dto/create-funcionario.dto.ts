/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEmail,
  IsBoolean,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(250)
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @MaxLength(60)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(15)
  telefone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  senha: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @IsInt()
  @IsNotEmpty()
  id_perfil: number;
}
