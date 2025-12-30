import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GeoipModule } from './geoip/geoip.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GeoipModule,
  ],
})
export class AppModule {}
