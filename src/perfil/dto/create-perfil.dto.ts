import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePerfilDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 300, { message: 'O nome deve ter entre 1 e 300 caracteres.' })
  nome: string;
}
