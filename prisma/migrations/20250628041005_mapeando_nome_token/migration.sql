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

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;
