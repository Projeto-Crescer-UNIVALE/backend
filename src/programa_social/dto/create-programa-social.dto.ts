import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProgramaSocialDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 300, { message: 'Deve ter entre 2 e 300 caracteres.' })
  nome: string;
}
