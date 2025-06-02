import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        cpf: string;
        senha: string;
    }): Promise<{
        access_token: string;
    }>;
}
