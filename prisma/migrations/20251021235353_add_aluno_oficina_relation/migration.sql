/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `perfil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `programa_social` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `atualizado_em` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `atualizado_em` DATETIME(3) NOT NULL,
    ADD COLUMN `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `excluido_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `funcionario` ADD COLUMN `atualizado_em` DATETIME(3) NOT NULL,
    ADD COLUMN `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `excluido_em` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `aluno_oficina` (
    `id_aluno` INTEGER NOT NULL,
    `id_oficina` INTEGER NOT NULL,
    `data_inscricao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_aluno`, `id_oficina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `perfil_nome_key` ON `perfil`(`nome`);

-- CreateIndex
CREATE UNIQUE INDEX `programa_social_nome_key` ON `programa_social`(`nome`);

-- AddForeignKey
ALTER TABLE `aluno_oficina` ADD CONSTRAINT `aluno_oficina_id_aluno_fkey` FOREIGN KEY (`id_aluno`) REFERENCES `aluno`(`id_aluno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno_oficina` ADD CONSTRAINT `aluno_oficina_id_oficina_fkey` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id_oficina`) ON DELETE CASCADE ON UPDATE CASCADE;
