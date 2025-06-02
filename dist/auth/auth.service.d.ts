import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validarFuncionario(cpf: string, senha: string): Promise<{
        id: number;
        cpf: string;
        senha: string;
    }>;
    login(cpf: string, senha: string): Promise<{
        access_token: string;
    }>;
}
