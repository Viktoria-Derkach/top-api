import { Module } from '@nestjs/common';
import { SwapiService } from './swapi.service';
import { TopPageModule } from '../top-page/top-page.module';

@Module({
  providers: [SwapiService],
  imports: [TopPageModule],
})
export class SwapiModule {}
