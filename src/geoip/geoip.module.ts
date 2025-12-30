import { Module } from '@nestjs/common';
import { GeoipService } from './geoip.service';
import { GeoipController } from './geoip.controller';

@Module({
  controllers: [GeoipController],
  providers: [GeoipService],
  exports: [GeoipService],
})
export class GeoipModule {}
