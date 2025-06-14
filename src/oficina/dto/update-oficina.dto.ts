// src/oficina/dto/update-oficina.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateOficinaDto } from './create-oficina.dto';

export class UpdateOficinaDto extends PartialType(CreateOficinaDto) {}
