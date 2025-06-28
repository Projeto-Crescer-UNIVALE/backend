/*
  Warnings:

  - You are about to drop the column `id_funcionario` on the `diario` table. All the data in the column will be lost.
  - Added the required column `id_autor` to the `diario` table without a default value. This is not possible if the table is not empty.
*/

-- DropForeignKey
ALTER TABLE `diario` DROP FOREIGN KEY `diario_id_funcionario_fkey`;

-- DropIndex
DROP INDEX `diario_id_funcionario_fkey` ON `diario`;

-- AlterTable
ALTER TABLE `diario` 
    DROP COLUMN `id_funcionario`,
    ADD COLUMN `id_autor` INTEGER NOT NULL,
    ADD COLUMN `atualizado_em` DATETIME NOT NULL DEFAULT NOW(), --  Ajuste necessário para o campo atualizado_em
    MODIFY `id_oficina` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `diario` ADD CONSTRAINT `diario_id_autor_fkey` FOREIGN KEY (`id_autor`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `diario` ADD CONSTRAINT `diario_id_aluno_fkey` FOREIGN KEY (`id_aluno`) REFERENCES `aluno`(`id_aluno`) ON DELETE RESTRICT ON UPDATE CASCADE;
