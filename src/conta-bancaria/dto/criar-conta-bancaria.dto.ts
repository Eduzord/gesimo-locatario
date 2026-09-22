import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { TipoChavePix, TipoConta } from '@prisma/client';

export class CriarContaBancariaDto {
  @ApiProperty({example: 'Conta Estilo Administração de Imóveis', maxLength: 100, description: 'Rótulo livre para identificar a conta nas telas'})
  @IsString()
  @MaxLength(100)
  descricao: string;

  @ApiProperty({example: 'ESTILO ADMINISTRAÇÃO DE IMÓVEIS LTDA.', maxLength: 150})
  @IsString()
  @MaxLength(150)
  titular: string;

  @ApiProperty({example: '65.036.038/0001-60', maxLength: 20, description: 'CPF ou CNPJ do titular da conta'})
  @IsString()
  @Matches(/^[\d.\-/]{11,20}$/, {message: 'documentoTitular deve conter um CPF ou CNPJ válido (com ou sem máscara)'})
  documentoTitular: string;

  @ApiProperty({example: 'SANTANDER', maxLength: 100})
  @IsString()
  @MaxLength(100)
  banco: string;

  @ApiPropertyOptional({example: '033', maxLength: 10, description: 'Código do banco (FEBRABAN), opcional'})
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigoBanco?: string;

  @ApiProperty({example: '3458', maxLength: 20})
  @IsString()
  @MaxLength(20)
  agencia: string;

  @ApiProperty({example: '13.003.981-9', maxLength: 30})
  @IsString()
  @MaxLength(30)
  numeroConta: string;

  @ApiPropertyOptional({enum: TipoConta, default: TipoConta.CORRENTE})
  @IsOptional()
  @IsEnum(TipoConta)
  tipoConta?: TipoConta;

  @ApiPropertyOptional({enum: TipoChavePix})
  @IsOptional()
  @IsEnum(TipoChavePix)
  tipoChavePix?: TipoChavePix;

  @ApiPropertyOptional({example: '65.036.038/0001-60', maxLength: 140})
  @IsOptional()
  @IsString()
  @MaxLength(140)
  chavePix?: string;

  @ApiPropertyOptional({default: false, description: 'Se true, vira a conta padrão sugerida ao gerar uma memória de cálculo (desmarca a padrão anterior)'})
  @IsOptional()
  @IsBoolean()
  padrao?: boolean;
}
