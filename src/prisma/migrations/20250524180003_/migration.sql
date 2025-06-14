/*
  Warnings:

  - You are about to drop the column `EMAIL` on the `funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `ID_PERFIL` on the `funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `NOME` on the `funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `SENHA` on the `funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `STATUS` on the `funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `TELEFONE` on the `funcionario` table. All the data in the column will be lost.
  - The primary key for the `perfil` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_PERFIL` on the `perfil` table. All the data in the column will be lost.
  - You are about to drop the column `NOME` on the `perfil` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `funcionario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_perfil` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_perfil` to the `perfil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `perfil` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `funcionario` DROP FOREIGN KEY `funcionario_ID_PERFIL_fkey`;

-- DropIndex
DROP INDEX `funcionario_EMAIL_key` ON `funcionario`;

-- DropIndex
DROP INDEX `funcionario_ID_PERFIL_fkey` ON `funcionario`;

-- AlterTable
ALTER TABLE `funcionario` DROP COLUMN `EMAIL`,
    DROP COLUMN `ID_PERFIL`,
    DROP COLUMN `NOME`,
    DROP COLUMN `SENHA`,
    DROP COLUMN `STATUS`,
    DROP COLUMN `TELEFONE`,
    ADD COLUMN `email` VARCHAR(60) NOT NULL,
    ADD COLUMN `id_perfil` INTEGER NOT NULL,
    ADD COLUMN `nome` VARCHAR(250) NOT NULL,
    ADD COLUMN `senha` VARCHAR(100) NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL,
    ADD COLUMN `telefone` VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE `perfil` DROP PRIMARY KEY,
    DROP COLUMN `ID_PERFIL`,
    DROP COLUMN `NOME`,
    ADD COLUMN `id_perfil` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nome` VARCHAR(300) NOT NULL,
    ADD PRIMARY KEY (`id_perfil`);

-- CreateIndex
CREATE UNIQUE INDEX `funcionario_email_key` ON `funcionario`(`email`);

-- AddForeignKey
ALTER TABLE `funcionario` ADD CONSTRAINT `funcionario_id_perfil_fkey` FOREIGN KEY (`id_perfil`) REFERENCES `perfil`(`id_perfil`) ON DELETE RESTRICT ON UPDATE CASCADE;
