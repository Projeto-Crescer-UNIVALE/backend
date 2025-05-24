import { PartialType } from '@nestjs/mapped-types';
import { CreateAlunoDto } from './create-aluno.dto';
import {
  IsOptional,
  IsString,
  Length,
  IsDate, // Adicionado
  IsNumber, // Adicionado
} from 'class-validator';

export class UpdateAlunoDto extends PartialType(CreateAlunoDto) {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(2, 250, { message: 'O nome deve ter entre 2 e 250 caracteres.' }) // Mantive a mesma regra de length do CreateAlunoDto
  nome?: string; // Torne o tipo opcional também

  @IsOptional()
  @IsDate({ message: 'A data de nascimento deve ser uma data válida.' })
  data_nascimento?: Date;

  @IsOptional()
  @IsString({ message: 'O CPF deve ser uma string.' })
  @Length(11, 11, { message: 'O CPF deve ter 11 caracteres.' })
  cpf?: string;

  @IsOptional()
  @IsString({ message: 'O RG deve ser uma string.' })
  @Length(11, 11, { message: 'O RG deve ter 11 caracteres.' })
  rg?: string;

  @IsOptional()
  @IsString({ message: 'O NIS deve ser uma string.' })
  @Length(11, 11, { message: 'O NIS deve ter 11 caracteres.' })
  nis?: string;

  @IsOptional()
  @IsString({ message: 'O CEP deve ser uma string.' })
  @Length(8, 8, { message: 'O CEP deve ter 8 caracteres.' })
  cep?: string;

  @IsOptional()
  @IsString({ message: 'O bairro deve ser uma string.' })
  @Length(1, 30, { message: 'O bairro deve ter entre 1 e 30 caracteres.' })
  bairro?: string;

  @IsOptional()
  @IsString({ message: 'A rua deve ser uma string.' })
  @Length(1, 80, { message: 'A rua deve ter entre 1 e 80 caracteres.' })
  rua?: string;

  @IsOptional()
  @IsString({ message: 'O número da casa deve ser uma string.' })
  @Length(1, 5, {
    message: 'O número da casa deve ter entre 1 e 5 caracteres.',
  })
  numero_casa?: string;

  @IsOptional()
  @IsString({ message: 'O nome da mãe deve ser uma string.' })
  @Length(2, 250, {
    message: 'O nome da mãe deve ter entre 2 e 250 caracteres.',
  })
  nome_mae?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @Length(1, 15, { message: 'O telefone deve ter entre 1 e 15 caracteres.' })
  telefone?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O grupo SCFV deve ser um número.' })
  grupo_scfv?: number;

  @IsOptional()
  @IsNumber({}, { message: 'A situação escolar deve ser um número.' })
  situacao_escolar?: number;

  @IsOptional()
  @IsString({ message: 'As alergias devem ser uma string.' })
  @Length(1, 100, {
    message: 'As alergias devem ter entre 1 e 100 caracteres.',
  })
  alergias?: string;

  @IsOptional()
  @IsString({ message: 'As necessidades especiais devem ser uma string.' })
  @Length(1, 120, {
    message: 'As necessidades especiais devem ter entre 1 e 120 caracteres.',
  })
  necessidades_especiais?: string;

  @IsOptional()
  @IsString({ message: 'Os medicamentos devem ser uma string.' })
  @Length(1, 200, {
    message: 'Os medicamentos devem ter entre 1 e 200 caracteres.',
  })
  medicamentos?: string;
}
