// src/oficina/dto/create-oficina.dto.ts

import { Type } from 'class-transformer'; // Mantido para @Type(() => OficinaDiaDto)
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
  IsArray,
  Matches // Usado para validar o formato HH:MM:SS
} from 'class-validator';

class OficinaDiaDto {
  @IsNumber({}, { message: 'O dia deve ser um número.' })
  @IsNotEmpty({ message: 'O dia da semana é obrigatório.' })
  dias: number;

  @IsString({ message: 'A hora de início deve ser uma string.' })
  @IsNotEmpty({ message: 'A hora de início é obrigatória.' })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'Hora de início deve estar no formato HH:MM:SS.' })
  hora_inicio: string; // Agora é uma string pura no formato HH:MM:SS

  @IsString({ message: 'A hora de fim deve ser uma string.' })
  @IsNotEmpty({ message: 'A hora de fim é obrigatória.' })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'Hora de fim deve estar no formato HH:MM:SS.' })
  hora_fim: string;   // Agora é uma string pura no formato HH:MM:SS
}

export class CreateOficinaDto {
  @IsNumber({}, { message: 'O ID do funcionário deve ser um número.' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório.' })
  id_funcionario: number;

  @IsString({ message: 'O nome da oficina deve ser uma string.' })
  @Length(2, 50, { message: 'O nome da oficina deve ter entre 2 e 50 caracteres.' })
  @IsNotEmpty({ message: 'O nome da oficina é obrigatório.' })
  nome: string;

  @IsString({ message: 'A descrição da oficina deve ser uma string.' })
  @Length(1, 300, { message: 'A descrição deve ter entre 1 e 300 caracteres.' })
  @IsNotEmpty({ message: 'A descrição da oficina é obrigatória.' })
  descricao: string;

  @IsBoolean({ message: 'O status deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O status é obrigatório.' })
  status: boolean;

  @IsArray({ message: 'Os dias da oficina devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => OficinaDiaDto) // Mantido para validação de objetos aninhados
  dias: OficinaDiaDto[];
}
