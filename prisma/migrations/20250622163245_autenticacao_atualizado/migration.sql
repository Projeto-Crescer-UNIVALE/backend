-- CreateTable
CREATE TABLE `sessao` (
    `id_sessao` VARCHAR(191) NOT NULL,
    `id_funcionario` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_sessao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sessao` ADD CONSTRAINT `sessao_id_funcionario_fkey` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE RESTRICT ON UPDATE CASCADE;
