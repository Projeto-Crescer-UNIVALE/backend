import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiarioDto {
  @IsOptional()
  @IsInt()
  id_oficina?: number;

  @IsInt()
  id_autor: number;

  @IsString()
  @IsNotEmpty()
  conteudo: string;
}
