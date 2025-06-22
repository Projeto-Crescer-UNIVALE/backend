import { OmitType } from '@nestjs/swagger';
import { CreateOficinaDto, OficinaCronogramaDto } from './create-oficina.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOficinaDto extends OmitType(CreateOficinaDto, [
  'cronograma',
]) {
  @IsArray({ message: 'Os dias da oficina devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOficinaCronogramaDto)
  cronograma: UpdateOficinaCronogramaDto[];
}
export class UpdateOficinaCronogramaDto extends OficinaCronogramaDto {}