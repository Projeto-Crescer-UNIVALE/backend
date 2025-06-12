/*
  Warnings:

  - You are about to drop the column `status` on the `funcionario` table. All the data in the column will be lost.
  - Added the required column `ativo` to the `funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `funcionario` DROP COLUMN `status`,
    ADD COLUMN `ativo` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE `diario` (
    `id_diario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aluno` INTEGER NOT NULL,
    `id_oficina` INTEGER NOT NULL,
    `id_funcionario` INTEGER NOT NULL,
    `conteudo` VARCHAR(300) NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_diario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diario` ADD CONSTRAINT `diario_id_funcionario_fkey` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;
