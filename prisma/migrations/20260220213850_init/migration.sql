-- CreateTable
CREATE TABLE `aluno` (
    `id_aluno` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(250) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `rg` VARCHAR(11) NOT NULL,
    `nis` VARCHAR(11) NOT NULL,
    `cep` VARCHAR(8) NOT NULL,
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
    `ativo` BOOLEAN NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `excluido_em` DATETIME(3) NULL,

    UNIQUE INDEX `aluno_cpf_key`(`cpf`),
    UNIQUE INDEX `aluno_rg_key`(`rg`),
    UNIQUE INDEX `aluno_nis_key`(`nis`),
    PRIMARY KEY (`id_aluno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programa_social` (
    `id_programa_social` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(300) NOT NULL,

    UNIQUE INDEX `programa_social_nome_key`(`nome`),
    PRIMARY KEY (`id_programa_social`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `funcionario` (
    `id_funcionario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_perfil` INTEGER NOT NULL,
    `nome` VARCHAR(250) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(15) NOT NULL,
    `ativo` BOOLEAN NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `excluido_em` DATETIME(3) NULL,

    UNIQUE INDEX `funcionario_email_key`(`email`),
    PRIMARY KEY (`id_funcionario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `id_token` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` VARCHAR(255) NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `usado_em` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `funcionarioId` INTEGER NOT NULL,

    UNIQUE INDEX `token_valor_key`(`valor`),
    PRIMARY KEY (`id_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil` (
    `id_perfil` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(300) NOT NULL,

    UNIQUE INDEX `perfil_nome_key`(`nome`),
    PRIMARY KEY (`id_perfil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessao` (
    `id_sessao` VARCHAR(191) NOT NULL,
    `id_funcionario` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL,
    `token` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id_sessao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oficina` (
    `id_oficina` INTEGER NOT NULL AUTO_INCREMENT,
    `id_funcionario` INTEGER NOT NULL,
    `nome` VARCHAR(50) NOT NULL,
    `descricao` VARCHAR(300) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `excluido_em` DATETIME(3) NULL,

    UNIQUE INDEX `oficina_nome_key`(`nome`),
    PRIMARY KEY (`id_oficina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oficina_dias` (
    `id_oficina` INTEGER NOT NULL,
    `dia` INTEGER NOT NULL,
    `hora_inicio` TIME(0) NOT NULL,
    `hora_fim` TIME(0) NOT NULL,

    UNIQUE INDEX `oficina_dias_id_oficina_dia_key`(`id_oficina`, `dia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diario` (
    `id_diario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aluno` INTEGER NOT NULL,
    `id_oficina` INTEGER NULL,
    `id_autor` INTEGER NOT NULL,
    `conteudo` VARCHAR(300) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `excluido_em` DATETIME(3) NULL,

    PRIMARY KEY (`id_diario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aluno_oficina` (
    `id_aluno` INTEGER NOT NULL,
    `id_oficina` INTEGER NOT NULL,
    `data_inscricao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_saida` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_aluno`, `id_oficina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AlunoToProgramaSocial` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AlunoToProgramaSocial_AB_unique`(`A`, `B`),
    INDEX `_AlunoToProgramaSocial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `funcionario` ADD CONSTRAINT `funcionario_id_perfil_fkey` FOREIGN KEY (`id_perfil`) REFERENCES `perfil`(`id_perfil`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao` ADD CONSTRAINT `sessao_id_funcionario_fkey` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oficina` ADD CONSTRAINT `oficina_id_funcionario_fkey` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oficina_dias` ADD CONSTRAINT `oficina_dias_id_oficina_fkey` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id_oficina`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diario` ADD CONSTRAINT `diario_id_autor_fkey` FOREIGN KEY (`id_autor`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diario` ADD CONSTRAINT `diario_id_aluno_fkey` FOREIGN KEY (`id_aluno`) REFERENCES `aluno`(`id_aluno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diario` ADD CONSTRAINT `diario_id_oficina_fkey` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id_oficina`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno_oficina` ADD CONSTRAINT `aluno_oficina_id_aluno_fkey` FOREIGN KEY (`id_aluno`) REFERENCES `aluno`(`id_aluno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno_oficina` ADD CONSTRAINT `aluno_oficina_id_oficina_fkey` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id_oficina`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlunoToProgramaSocial` ADD CONSTRAINT `_AlunoToProgramaSocial_A_fkey` FOREIGN KEY (`A`) REFERENCES `aluno`(`id_aluno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlunoToProgramaSocial` ADD CONSTRAINT `_AlunoToProgramaSocial_B_fkey` FOREIGN KEY (`B`) REFERENCES `programa_social`(`id_programa_social`) ON DELETE CASCADE ON UPDATE CASCADE;
