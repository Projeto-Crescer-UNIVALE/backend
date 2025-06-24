/*
  Warnings:

  - You are about to drop the column `data_criacao` on the `diario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `diario` DROP COLUMN `data_criacao`,
    ADD COLUMN `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `excluido_em` DATETIME(3) NULL,
    MODIFY `atualizado_em` DATETIME(3) NOT NULL;

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

-- AddForeignKey
ALTER TABLE `oficina` ADD CONSTRAINT `oficina_id_funcionario_fkey` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oficina_dias` ADD CONSTRAINT `oficina_dias_id_oficina_fkey` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id_oficina`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diario` ADD CONSTRAINT `diario_id_oficina_fkey` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id_oficina`) ON DELETE SET NULL ON UPDATE CASCADE;
