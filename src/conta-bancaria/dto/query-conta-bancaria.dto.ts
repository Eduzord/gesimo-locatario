import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class QueryContaBancariaDto {
  @ApiPropertyOptional({enum: Status, description: 'Sem filtro, lista só as ATIVAS'})
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
