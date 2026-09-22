import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContaBancariaService } from './conta-bancaria.service';
import { CriarContaBancariaDto } from './dto/criar-conta-bancaria.dto';
import { AtualizarContaBancariaDto } from './dto/atualizar-conta-bancaria.dto';
import { QueryContaBancariaDto } from './dto/query-conta-bancaria.dto';

//Catálogo de contas de depósito (não é um cadastro de pessoa). Sem guard, como o restante deste
//serviço: a autenticação/autorização é feita pelo gateway. Qualquer usuário autenticado pode
//cadastrar/editar contas — não há distinção de papel para este recurso.
@ApiTags('Contas Bancárias')
@Controller('contas-bancarias')
export class ContaBancariaController {
  constructor(private readonly contaBancariaService: ContaBancariaService) {}

  //Declarada antes de ':id' para 'padrao' não ser interpretado como um ID
  @Get('padrao')
  @ApiOperation({summary: 'Buscar a conta bancária padrão (sugestão inicial para a memória de cálculo)'})
  @ApiResponse({status: 200, description: 'A conta padrão, ou null se nenhuma estiver marcada'})
  async buscarPadrao() {
    return await this.contaBancariaService.buscarPadrao();
  }

  @Get()
  @ApiOperation({summary: 'Listar contas bancárias cadastradas', description: 'Sem filtro, traz só as ATIVAS.'})
  @ApiQuery({name: 'status', required: false, enum: ['ATIVO', 'INATIVO']})
  async listar(@Query() query: QueryContaBancariaDto) {
    return await this.contaBancariaService.listar(query.status);
  }

  @Get(':id')
  @ApiOperation({summary: 'Buscar uma conta bancária por ID'})
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.contaBancariaService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({summary: 'Cadastrar uma conta bancária'})
  @ApiResponse({status: 201, description: 'Conta cadastrada com sucesso'})
  async criar(@Body() dto: CriarContaBancariaDto) {
    return await this.contaBancariaService.criar(dto);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Atualizar uma conta bancária'})
  async atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarContaBancariaDto) {
    return await this.contaBancariaService.atualizar(id, dto);
  }

  @Patch(':id/tornar-padrao')
  @ApiOperation({summary: 'Marcar esta conta como a padrão', description: 'Desmarca automaticamente qualquer outra conta que estivesse marcada como padrão.'})
  async tornarPadrao(@Param('id', ParseIntPipe) id: number) {
    return await this.contaBancariaService.tornarPadrao(id);
  }

  @Patch(':id/reativar')
  @ApiOperation({summary: 'Reativar uma conta bancária inativada'})
  async reativar(@Param('id', ParseIntPipe) id: number) {
    return await this.contaBancariaService.reativar(id);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Inativar uma conta bancária (soft delete)'})
  async inativar(@Param('id', ParseIntPipe) id: number) {
    return await this.contaBancariaService.inativar(id);
  }

  @Delete(':id/hard')
  @ApiOperation({summary: 'Excluir definitivamente uma conta bancária'})
  async removerDefinitivo(@Param('id', ParseIntPipe) id: number) {
    return await this.contaBancariaService.removerDefinitivo(id);
  }
}
