import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CriarContaBancariaDto } from './dto/criar-conta-bancaria.dto';
import { AtualizarContaBancariaDto } from './dto/atualizar-conta-bancaria.dto';

@Injectable()
export class ContaBancariaService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(status?: Status) {
    return this.prisma.contaBancaria.findMany({
      where: { status: status ?? Status.ATIVO },
      orderBy: [{ padrao: 'desc' }, { descricao: 'asc' }],
    });
  }

  async buscarPorId(id: number) {
    const conta = await this.prisma.contaBancaria.findUnique({ where: { id } });

    if (!conta) {
      throw new NotFoundException(`Conta bancária com ID ${id} não encontrada.`);
    }

    return conta;
  }

  // Atalho para telas que só precisam da sugestão inicial (ex.: modal de memória de cálculo)
  async buscarPadrao() {
    return this.prisma.contaBancaria.findFirst({ where: { padrao: true, status: Status.ATIVO } });
  }

  async criar(dados: CriarContaBancariaDto) {
    if (dados.padrao) {
      return this.prisma.$transaction(async (tx) => {
        await tx.contaBancaria.updateMany({ where: { padrao: true }, data: { padrao: false } });
        return tx.contaBancaria.create({ data: dados });
      });
    }

    return this.prisma.contaBancaria.create({ data: dados });
  }

  async atualizar(id: number, dados: AtualizarContaBancariaDto) {
    await this.buscarPorId(id);

    if (dados.padrao) {
      return this.prisma.$transaction(async (tx) => {
        await tx.contaBancaria.updateMany({ where: { padrao: true, NOT: { id } }, data: { padrao: false } });
        return tx.contaBancaria.update({ where: { id }, data: dados });
      });
    }

    return this.prisma.contaBancaria.update({ where: { id }, data: dados });
  }

  //Marca esta conta como a padrão e desmarca qualquer outra (só uma conta padrão por vez)
  async tornarPadrao(id: number) {
    await this.buscarPorId(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.contaBancaria.updateMany({ where: { padrao: true, NOT: { id } }, data: { padrao: false } });
      return tx.contaBancaria.update({ where: { id }, data: { padrao: true } });
    });
  }

  async inativar(id: number) {
    await this.buscarPorId(id);
    return this.prisma.contaBancaria.update({ where: { id }, data: { status: Status.INATIVO, padrao: false } });
  }

  async reativar(id: number) {
    await this.buscarPorId(id);
    return this.prisma.contaBancaria.update({ where: { id }, data: { status: Status.ATIVO } });
  }

  async removerDefinitivo(id: number) {
    await this.buscarPorId(id);
    await this.prisma.contaBancaria.delete({ where: { id } });
    return { message: 'Conta bancária removida definitivamente com sucesso.' };
  }
}
