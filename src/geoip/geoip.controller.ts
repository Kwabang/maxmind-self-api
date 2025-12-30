import { Controller, Get, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GeoipService } from './geoip.service';

@Controller()
export class GeoipController {
  constructor(private readonly geoipService: GeoipService) {}

  @Get()
  getRoot() {
    return {
      message: 'Welcome to MaxMind API',
      lastUpdated: this.geoipService.getLastUpdated(),
      ready: this.geoipService.isDatabaseReady(),
    };
  }

  @Get('asn/:ip')
  getAsn(@Param('ip') ip: string) {
    if (!this.geoipService.isValidIP(ip)) {
      throw new HttpException({ error: 'Not a valid IP.' }, HttpStatus.BAD_REQUEST);
    }

    const data = this.geoipService.getAsn(ip);
    if (!data) {
      throw new HttpException(
        "Maxmind doesn't have any information for that IP.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return data;
  }

  @Get('country/:ip')
  getCountry(@Param('ip') ip: string) {
    if (!this.geoipService.isValidIP(ip)) {
      throw new HttpException({ error: 'Not a valid IP.' }, HttpStatus.BAD_REQUEST);
    }

    const data = this.geoipService.getCountry(ip);
    if (!data) {
      throw new HttpException(
        "Maxmind doesn't have any information for that IP.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return data;
  }

  @Get('city/:ip')
  getCity(@Param('ip') ip: string) {
    if (!this.geoipService.isValidIP(ip)) {
      throw new HttpException({ error: 'Not a valid IP.' }, HttpStatus.BAD_REQUEST);
    }

    const data = this.geoipService.getCity(ip);
    if (!data) {
      throw new HttpException(
        "Maxmind doesn't have any information for that IP.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return data;
  }

  @Get('geolocation/:ip')
  getGeolocation(@Param('ip') ip: string) {
    if (!this.geoipService.isValidIP(ip)) {
      throw new HttpException({ error: 'Not a valid IP.' }, HttpStatus.BAD_REQUEST);
    }

    const data = this.geoipService.getGeolocation(ip);
    if (!data) {
      throw new HttpException(
        "Maxmind doesn't have any information for that IP.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return data;
  }

  @Get('isp')
  getIsp(@Req() request: Request) {
    const ip = request.headers['x-forwarded-for'] as string;
    
    if (!ip || !this.geoipService.isValidIP(ip)) {
      throw new HttpException({ error: 'Not a valid IP.' }, HttpStatus.BAD_REQUEST);
    }

    const data = this.geoipService.getAsn(ip);
    if (!data) {
      throw new HttpException(
        "Maxmind doesn't have any information for that IP.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return data;
  }
}
