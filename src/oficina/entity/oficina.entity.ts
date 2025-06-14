// src/oficina/entity/oficina.entity.ts

import { OficinaDias as PrismaOficinaDias } from 'generated/prisma'; 

export class Oficina {
  id_oficina: number;
  id_funcionario: number;
  nome: string;
  descricao: string;
  status: boolean;
  oficina_dias?: PrismaOficinaDias[]; 
}

export class OficinaDias {
  id_oficina_dias: number;
  id_oficina: number;
  dias: number;
  hora_inicio: Date;
  hora_fim: Date;
}
