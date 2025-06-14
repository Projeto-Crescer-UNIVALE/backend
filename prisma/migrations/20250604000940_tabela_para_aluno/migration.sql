/*
  Warnings:

  - You are about to drop the column `status` on the `aluno` table. All the data in the column will be lost.
  - You are about to alter the column `cep` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(11)` to `VarChar(8)`.
  - Added the required column `ativo` to the `aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `status`,
    ADD COLUMN `ativo` BOOLEAN NOT NULL,
    MODIFY `cep` VARCHAR(8) NOT NULL;

-- CreateTable
CREATE TABLE `programa_social` (
    `id_programa_social` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(300) NOT NULL,

    PRIMARY KEY (`id_programa_social`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aluno_programa_social` (
    `id_aluno_programa_social` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aluno` INTEGER NOT NULL,
    `id_programa_social` INTEGER NOT NULL,

    PRIMARY KEY (`id_aluno_programa_social`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aluno_programa_social` ADD CONSTRAINT `aluno_programa_social_id_aluno_fkey` FOREIGN KEY (`id_aluno`) REFERENCES `aluno`(`id_aluno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno_programa_social` ADD CONSTRAINT `aluno_programa_social_id_programa_social_fkey` FOREIGN KEY (`id_programa_social`) REFERENCES `programa_social`(`id_programa_social`) ON DELETE RESTRICT ON UPDATE CASCADE;
