import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDiarioDto {
  @IsNumber()
  id_aluno: number;

  @IsString()
  @IsNotEmpty()
  conteudo: string;
}