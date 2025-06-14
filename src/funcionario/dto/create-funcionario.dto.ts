        // src/funcionario/dto/create-funcionario.dto.ts
        import {
          IsBoolean,
          IsNotEmpty,
          IsNumber,
          IsString,
          Length,
          IsEmail,
        } from 'class-validator';

        export class CreateFuncionarioDto {
          @IsNumber()
          @IsNotEmpty()
          id_perfil: number;

          @IsString()
          @Length(2, 250)
          @IsNotEmpty()
          nome: string;

          @IsString()
          @IsEmail()
          @Length(5, 80)
          @IsNotEmpty()
          email: string;

          @IsString()
          @Length(6, 100)
          @IsNotEmpty()
          senha: string;

          @IsString()
          @Length(1, 15)
          @IsNotEmpty()
          telefone: string;

          @IsBoolean()
          @IsNotEmpty()
          status: boolean; // <-- PROPRIEDADE 'STATUS' AQUI!
        }
        