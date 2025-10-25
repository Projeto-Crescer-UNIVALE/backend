/*
  Warnings:

  - Added the required column `data_saida` to the `aluno_oficina` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno_oficina` ADD COLUMN `data_saida` DATETIME(3) NOT NULL;
