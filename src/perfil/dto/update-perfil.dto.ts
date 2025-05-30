import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfilDto } from './create-perfil.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(1, 300, { message: 'O nome deve ter entre 1 e 300 caracteres.' })
  nome?: string;
}
