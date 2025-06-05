import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProgramasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.programa.findMany();
  }
}
