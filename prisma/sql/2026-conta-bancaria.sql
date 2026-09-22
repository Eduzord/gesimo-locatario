-- Catálogo de contas bancárias de depósito. Este serviço não tem migrations aplicadas ainda
-- (prisma/migrations não existe); aplique este script uma única vez no banco de locatários:
--   npx prisma db execute --file prisma/sql/2026-conta-bancaria.sql
-- Gerado com: npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script

CREATE TABLE `conta_bancaria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(100) NOT NULL,
    `titular` VARCHAR(150) NOT NULL,
    `documento_titular` VARCHAR(20) NOT NULL,
    `banco` VARCHAR(100) NOT NULL,
    `codigo_banco` VARCHAR(10) NULL,
    `agencia` VARCHAR(20) NOT NULL,
    `numero_conta` VARCHAR(30) NOT NULL,
    `tipo_conta` ENUM('CORRENTE', 'POUPANCA') NOT NULL DEFAULT 'CORRENTE',
    `tipo_chave_pix` ENUM('CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA') NULL,
    `chave_pix` VARCHAR(140) NULL,
    `padrao` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Conta real, copiada do intervalo C31:D37 da planilha "Memória Cálculo Julho 2026.xlsx" fornecida
-- pelo usuário (não é dado fictício), cadastrada como a conta padrão sugerida ao gerar uma memória.
-- Código do banco 033 = SANTANDER (tabela FEBRABAN).
INSERT INTO `conta_bancaria`
  (`descricao`, `titular`, `documento_titular`, `banco`, `codigo_banco`, `agencia`, `numero_conta`, `tipo_conta`, `tipo_chave_pix`, `chave_pix`, `padrao`, `status`)
VALUES
  ('Estilo Administração de Imóveis', 'ESTILO ADMINISTRAÇÃO DE IMÓVEIS LTDA.', '65.036.038/0001-60', 'SANTANDER', '033', '3458', '13.003.981-9', 'CORRENTE', 'CNPJ', '65.036.038/0001-60', true, 'ATIVO');
