import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateDiarioDto {
  @IsInt()
  id_aluno: number;

  @IsInt()
  id_oficina: number;

  @IsInt()
  id_funcionario: number;

  @IsString()
  @IsNotEmpty()
  conteudo: string;
}
