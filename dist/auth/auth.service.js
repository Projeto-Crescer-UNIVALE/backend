"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("./prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validarFuncionario(cpf, senha) {
        console.log('--- DEBUG login ---');
        console.log('CPF recebido:', cpf);
        console.log('Senha recebida:', senha);
        const funcionario = await this.prisma.funcionario.findUnique({
            where: { cpf },
        });
        console.log('Funcionário do banco:', funcionario);
        if (!funcionario) {
            console.log('Funcionário não encontrado');
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const senhaValida = await bcrypt.compare(senha, funcionario.senha);
        console.log('Senha válida?', senhaValida);
        if (!senhaValida) {
            console.log('Senha incorreta');
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        console.log('Login válido, retornando funcionário');
        return funcionario;
    }
    async login(cpf, senha) {
        const funcionario = await this.validarFuncionario(cpf, senha);
        const payload = { sub: funcionario.id, cpf: funcionario.cpf };
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map