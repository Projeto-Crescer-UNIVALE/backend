/*
  Warnings:

  - You are about to drop the `FUNCIONARIO` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PERFIL` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FUNCIONARIO` DROP FOREIGN KEY `FUNCIONARIO_ID_PERFIL_fkey`;

-- DropTable
DROP TABLE `FUNCIONARIO`;

-- DropTable
DROP TABLE `PERFIL`;

-- CreateTable
CREATE TABLE `funcionario` (
    `id_funcionario` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_PERFIL` INTEGER NOT NULL,
    `NOME` VARCHAR(250) NOT NULL,
    `EMAIL` VARCHAR(60) NOT NULL,
    `SENHA` VARCHAR(100) NOT NULL,
    `TELEFONE` VARCHAR(15) NOT NULL,
    `STATUS` BOOLEAN NOT NULL,

    UNIQUE INDEX `funcionario_EMAIL_key`(`EMAIL`),
    PRIMARY KEY (`id_funcionario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil` (
    `ID_PERFIL` INTEGER NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(300) NOT NULL,

    PRIMARY KEY (`ID_PERFIL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `funcionario` ADD CONSTRAINT `funcionario_ID_PERFIL_fkey` FOREIGN KEY (`ID_PERFIL`) REFERENCES `perfil`(`ID_PERFIL`) ON DELETE RESTRICT ON UPDATE CASCADE;
