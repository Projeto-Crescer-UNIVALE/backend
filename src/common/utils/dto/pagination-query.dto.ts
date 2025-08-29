import { Type, Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsString,
  MaxLength,
} from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior que 0' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior que 0' })
  @Max(100, { message: 'Limite não pode ser maior que 100' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  @MaxLength(100, { message: 'Termo de busca não pode exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  search?: string;
}
