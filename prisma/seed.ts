import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.locatario.upsert({
    where: { id: 1n },
    update: {},
    create: {
      id: 1n,
      email: 'marcos.oliveira@email.com',
      endereco: 'Rua Barão do Rio Branco, 210, Centro, Curitiba - PR',
      telefone: '(41) 99123-4567',
      status: 'ATIVO',
      pessoaFisica: {
        create: {
          nome: 'Marcos Vinícius Oliveira',
          cpf: '32165498700',
          rg: '65432187',
          estadoCivil: 'Solteiro',
          profissaoRamo: 'Analista de Sistemas',
        },
      },
    },
  });

  await prisma.locatario.upsert({
    where: { id: 2n },
    update: {},
    create: {
      id: 2n,
      email: 'contato@comerciorapido.com',
      endereco: 'Rua Comendador Araújo, 500, Batel, Curitiba - PR',
      telefone: '(41) 3222-8899',
      status: 'ATIVO',
      pessoaJuridica: {
        create: {
          razaoSocial: 'Comércio Rápido ME',
          cnpj: '98765432000155',
          inscricaoEstadual: '9876543210',
        },
      },
    },
  });

  await prisma.locatario.upsert({
    where: { id: 3n },
    update: {},
    create: {
      id: 3n,
      email: 'patricia.ferreira@email.com',
      endereco: 'Rua Emiliano Perneta, 88, Centro, Curitiba - PR',
      telefone: '(41) 99876-5432',
      status: 'INATIVO',
      pessoaFisica: {
        create: {
          nome: 'Patrícia Ferreira',
          cpf: '45612378900',
          rg: '78912345',
          estadoCivil: 'Casada',
          profissaoRamo: 'Professora',
        },
      },
    },
  });

  console.log('Seed concluído: api-microservico-locatario');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
