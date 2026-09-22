import { PartialType } from '@nestjs/swagger';
import { CriarContaBancariaDto } from './criar-conta-bancaria.dto';

export class AtualizarContaBancariaDto extends PartialType(CriarContaBancariaDto) {}
