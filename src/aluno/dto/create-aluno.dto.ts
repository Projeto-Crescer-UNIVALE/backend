import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @Length(2, 250, { message: 'Deve ter entre 2 e 250 caracteres.' })
  @IsNotEmpty()
  nome: string;

  @IsDate()
  @IsNotEmpty()
  data_nascimento: Date;

  @IsString()
  @Length(11, 11, { message: 'Deve ter 11 caracteres.' })
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @Length(11, 11, { message: 'Deve ter 11 caracteres.' })
  @IsNotEmpty()
  rg: string;

  @IsString()
  @Length(11, 11, { message: 'Deve ter 11 caracteres.' })
  @IsNotEmpty()
  nis: string;

  @IsString()
  @Length(8, 8, { message: 'Deve ter 8 caracteres.' })
  @IsNotEmpty()
  cep: string;

  @IsString()
  @Length(1, 30, { message: 'Deve ter entre 1 e 30 caracteres.' })
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @Length(1, 80, { message: 'Deve ter entre 1 e 80 caracteres.' })
  @IsNotEmpty()
  rua: string;

  @IsString()
  @Length(1, 5, { message: 'Deve ter entre 1 e 5 caracteres.' })
  @IsNotEmpty()
  numero_casa: string;

  @IsString()
  @Length(2, 250, { message: 'Deve ter entre 2 e 250 caracteres.' })
  @IsNotEmpty()
  nome_mae: string;

  @IsString()
  @Length(1, 15, { message: 'Deve ter entre 1 e 15 caracteres.' })
  @IsNotEmpty()
  telefone: string;

  @IsNumber()
  @IsNotEmpty()
  grupo_scfv: number;

  @IsNumber()
  @IsNotEmpty()
  situacao_escolar: number;

  @IsString()
  @Length(1, 100, { message: 'Deve ter entre 1 e 100 caracteres.' })
  @IsOptional()
  alergias?: string;

  @IsString()
  @Length(1, 120, { message: 'Deve ter entre 1 e 120 caracteres.' })
  @IsOptional()
  necessidades_especiais?: string;

  @IsString()
  @Length(1, 200, { message: 'Deve ter entre 1 e 200 caracteres.' })
  @IsOptional()
  medicamentos?: string;

  @IsBoolean()
  @IsNotEmpty()
  ativo: boolean;
}
