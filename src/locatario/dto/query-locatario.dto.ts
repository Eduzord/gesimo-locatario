import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Status } from '../../common/enums/status.enum';

export class QueryLocatarioDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  email?: string;

  // Busca livre: nome, razão social, CPF, CNPJ, e-mail ou telefone.
  // Várias palavras são combinadas com "E" (cada palavra precisa aparecer em algum campo).
  @IsOptional()
  @IsString()
  @MaxLength(100)
  busca?: string;
}
