/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateFuncionarioDto } from './create-funcionario.dto';
import { IsInt, IsOptional, IsString, Length, IsEmail } from 'class-validator';

export class UpdateFuncionarioDto extends PartialType(CreateFuncionarioDto) {
  @IsOptional()
  @IsInt({ message: 'O ID do perfil deve ser um número inteiro.' })
  id_perfil?: number;

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(1, 250, { message: 'O nome deve ter entre 1 e 250 caracteres.' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail deve ser um endereço de e-mail válido.' })
  @Length(1, 60, { message: 'O e-mail deve ter entre 1 e 60 caracteres.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  @Length(6, 100, { message: 'A senha deve ter entre 6 e 100 caracteres.' })
  senha?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @Length(1, 15, { message: 'O telefone deve ter entre 1 e 15 caracteres.' })
  telefone?: string;

  @IsOptional()
  status?: boolean;
}
