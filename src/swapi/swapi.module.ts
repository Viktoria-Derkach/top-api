import { HttpModule, Module } from '@nestjs/common';
import { SwapiService } from './swapi.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SwapiService],
  imports: [ConfigModule, HttpModule],
  exports: [SwapiService],
})
export class SwapiModule {}
