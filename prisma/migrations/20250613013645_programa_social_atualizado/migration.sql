/*
  Warnings:

  - You are about to drop the column `status` on the `funcionario` table. All the data in the column will be lost.
  - You are about to drop the `aluno_programa_social` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ativo` to the `funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `aluno_programa_social` DROP FOREIGN KEY `aluno_programa_social_id_aluno_fkey`;

-- DropForeignKey
ALTER TABLE `aluno_programa_social` DROP FOREIGN KEY `aluno_programa_social_id_programa_social_fkey`;

-- AlterTable
ALTER TABLE `funcionario` DROP COLUMN `status`,
    ADD COLUMN `ativo` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `aluno_programa_social`;

-- CreateTable
CREATE TABLE `_AlunoToProgramaSocial` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AlunoToProgramaSocial_AB_unique`(`A`, `B`),
    INDEX `_AlunoToProgramaSocial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AlunoToProgramaSocial` ADD CONSTRAINT `_AlunoToProgramaSocial_A_fkey` FOREIGN KEY (`A`) REFERENCES `aluno`(`id_aluno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlunoToProgramaSocial` ADD CONSTRAINT `_AlunoToProgramaSocial_B_fkey` FOREIGN KEY (`B`) REFERENCES `programa_social`(`id_programa_social`) ON DELETE CASCADE ON UPDATE CASCADE;
