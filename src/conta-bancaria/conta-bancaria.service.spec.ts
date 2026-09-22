import { NotFoundException } from '@nestjs/common';
import { ContaBancariaService } from './conta-bancaria.service';

describe('ContaBancariaService', () => {
  let service: ContaBancariaService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      contaBancaria: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn().mockImplementation(({ data }: any) => ({ id: 1, ...data })),
        update: jest.fn().mockImplementation(({ data }: any) => ({ id: 1, ...data })),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation((fn: any) => fn(prisma));

    service = new ContaBancariaService(prisma);
  });

  it('listar sem filtro traz só as ATIVAS, padrão primeiro', async () => {
    await service.listar();

    expect(prisma.contaBancaria.findMany).toHaveBeenCalledWith({
      where: { status: 'ATIVO' },
      orderBy: [{ padrao: 'desc' }, { descricao: 'asc' }],
    });
  });

  it('listar aceita filtro explícito de status', async () => {
    await service.listar('INATIVO' as any);

    expect(prisma.contaBancaria.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'INATIVO' } }),
    );
  });

  it('buscarPorId lança 404 quando não existe', async () => {
    prisma.contaBancaria.findUnique.mockResolvedValue(null);

    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
  });

  it('criar sem padrao=true não mexe nas demais contas', async () => {
    await service.criar({ descricao: 'X' } as any);

    expect(prisma.contaBancaria.updateMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('criar com padrao=true desmarca as demais antes de criar', async () => {
    await service.criar({ descricao: 'Nova padrão', padrao: true } as any);

    expect(prisma.contaBancaria.updateMany).toHaveBeenCalledWith({ where: { padrao: true }, data: { padrao: false } });
    expect(prisma.contaBancaria.create).toHaveBeenCalled();
  });

  it('tornarPadrao desmarca todas as outras e marca só esta', async () => {
    prisma.contaBancaria.findUnique.mockResolvedValue({ id: 5 });

    await service.tornarPadrao(5);

    expect(prisma.contaBancaria.updateMany).toHaveBeenCalledWith({ where: { padrao: true, NOT: { id: 5 } }, data: { padrao: false } });
    expect(prisma.contaBancaria.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { padrao: true } });
  });

  it('inativar também desmarca a conta como padrão', async () => {
    prisma.contaBancaria.findUnique.mockResolvedValue({ id: 5 });

    await service.inativar(5);

    expect(prisma.contaBancaria.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { status: 'INATIVO', padrao: false } });
  });

  it('buscarPadrao filtra padrao=true e status ATIVO', async () => {
    await service.buscarPadrao();

    expect(prisma.contaBancaria.findFirst).toHaveBeenCalledWith({ where: { padrao: true, status: 'ATIVO' } });
  });

  it('removerDefinitivo confere existência antes de excluir', async () => {
    prisma.contaBancaria.findUnique.mockResolvedValue(null);

    await expect(service.removerDefinitivo(1)).rejects.toThrow(NotFoundException);
    expect(prisma.contaBancaria.delete).not.toHaveBeenCalled();
  });
});
