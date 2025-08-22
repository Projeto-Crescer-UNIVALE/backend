import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiarioDto {
  @IsOptional()
  @IsInt()
  id_oficina?: number;

  
  @IsString()
  @IsNotEmpty()
  conteudo: string;
}
