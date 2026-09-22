import { Module } from '@nestjs/common';
import { ContaBancariaController } from './conta-bancaria.controller';
import { ContaBancariaService } from './conta-bancaria.service';

@Module({
  controllers: [ContaBancariaController],
  providers: [ContaBancariaService],
})
export class ContaBancariaModule {}
