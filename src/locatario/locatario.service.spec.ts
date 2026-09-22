import { LocatarioService } from './locatario.service';

describe('LocatarioService - busca', () => {
  let service: LocatarioService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      locatario: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    service = new LocatarioService(prisma);
  });

  it('sem busca não aplica nenhum filtro extra', () => {
    expect(service.montarFiltrosDeBusca(undefined)).toEqual([]);
    expect(service.montarFiltrosDeBusca('   ')).toEqual([]);
  });

  it('cada palavra vira uma condição E, com OR entre os campos', () => {
    const filtros = service.montarFiltrosDeBusca('  maria   silva ');

    expect(filtros).toHaveLength(2);
    expect(JSON.stringify(filtros[0])).toContain('"nome":{"contains":"maria"}');
    expect(JSON.stringify(filtros[1])).toContain('"nome":{"contains":"silva"}');
    expect(filtros[0].OR).toHaveLength(6);
  });

  it('termo com cara de documento testa CPF/CNPJ só com dígitos', () => {
    const [filtro] = service.montarFiltrosDeBusca('123.456.789-01');
    const json = JSON.stringify(filtro);

    expect(json).toContain('"cpf":{"contains":"12345678901"}');
    expect(json).toContain('"cnpj":{"contains":"12345678901"}');
    // o nome continua sendo buscado com o texto original
    expect(json).toContain('"nome":{"contains":"123.456.789-01"}');
  });

  it('palavra com letras e números não é tratada como documento', () => {
    const [filtro] = service.montarFiltrosDeBusca('ap42');

    expect(JSON.stringify(filtro)).toContain('"cpf":{"contains":"ap42"}');
  });

  it('escapa os curingas do LIKE (%, _ e \\) para serem buscados como texto', () => {
    const [filtro] = service.montarFiltrosDeBusca('50%_a\\b');

    expect(filtro.OR[0]).toEqual({ email: { contains: '50\\%\\_a\\\\b' } });
  });

  it('limita a quantidade de palavras', () => {
    expect(service.montarFiltrosDeBusca('a b c d e f g h')).toHaveLength(5);
  });

  it('findAll repassa a busca ao where, junto do total paginado', async () => {
    await service.findAll({ page: '2', limit: '10', busca: 'joao' } as any);

    const args = prisma.locatario.findMany.mock.calls[0][0];
    expect(args.skip).toBe(10);
    expect(args.where.AND).toHaveLength(1);
    expect(prisma.locatario.count).toHaveBeenCalledWith({ where: args.where });
  });
});
