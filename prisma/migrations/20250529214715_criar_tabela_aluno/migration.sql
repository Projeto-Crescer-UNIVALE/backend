-- CreateTable
CREATE TABLE `aluno` (
    `id_aluno` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(250) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `rg` VARCHAR(11) NOT NULL,
    `nis` VARCHAR(11) NOT NULL,
    `cep` VARCHAR(11) NOT NULL,
    `bairro` VARCHAR(30) NOT NULL,
    `rua` VARCHAR(80) NOT NULL,
    `numero_casa` VARCHAR(5) NOT NULL,
    `nome_mae` VARCHAR(250) NOT NULL,
    `telefone` VARCHAR(15) NOT NULL,
    `grupo_scfv` INTEGER NOT NULL,
    `situacao_escolar` INTEGER NOT NULL,
    `alergias` VARCHAR(100) NULL,
    `necessidades_especiais` VARCHAR(120) NULL,
    `medicamentos` VARCHAR(200) NULL,
    `status` BOOLEAN NOT NULL,

    UNIQUE INDEX `aluno_cpf_key`(`cpf`),
    UNIQUE INDEX `aluno_rg_key`(`rg`),
    UNIQUE INDEX `aluno_nis_key`(`nis`),
    PRIMARY KEY (`id_aluno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
