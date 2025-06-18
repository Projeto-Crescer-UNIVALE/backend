import { OmitType } from '@nestjs/mapped-types';
import { CreateOficinaDto, OficinaCronogramaDto } from './create-oficina.dto';

export class UpdateOficinaDto extends OmitType(CreateOficinaDto,['cronograma']){
    cronograma: UpdateOficinaCronogramaDto[]
}
export class UpdateOficinaCronogramaDto extends OficinaCronogramaDto {
    id:number
}
