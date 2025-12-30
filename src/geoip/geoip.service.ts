import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as maxmind from 'maxmind';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface DatabaseInfo {
  url: string;
  filename: string;
  reader: maxmind.Reader<any> | null;
}

@Injectable()
export class GeoipService implements OnModuleInit {
  private readonly logger = new Logger(GeoipService.name);
  private readonly databaseDir = path.join(process.cwd(), 'database');
  
  private databases: Record<string, DatabaseInfo> = {
    asn: {
      url: 'https://github.com/P3TERX/GeoLite.mmdb/releases/latest/download/GeoLite2-ASN.mmdb',
      filename: 'GeoLite2-ASN.mmdb',
      reader: null,
    },
    city: {
      url: 'https://github.com/P3TERX/GeoLite.mmdb/releases/latest/download/GeoLite2-City.mmdb',
      filename: 'GeoLite2-City.mmdb',
      reader: null,
    },
    country: {
      url: 'https://github.com/P3TERX/GeoLite.mmdb/releases/latest/download/GeoLite2-Country.mmdb',
      filename: 'GeoLite2-Country.mmdb',
      reader: null,
    },
  };

  private lastUpdated: Date | null = null;

  async onModuleInit() {
    await this.ensureDatabaseDirectory();
    await this.downloadAndLoadDatabases();
  }

  private async ensureDatabaseDirectory() {
    if (!fs.existsSync(this.databaseDir)) {
      fs.mkdirSync(this.databaseDir, { recursive: true });
      this.logger.log(`Created database directory: ${this.databaseDir}`);
    }
  }

  @Cron('0 */30 * * * *') // Every 30 minutes
  async handleCron() {
    this.logger.log('Running scheduled database update...');
    await this.downloadAndLoadDatabases();
  }

  async downloadAndLoadDatabases() {
    this.logger.log('Starting database download and load...');
    
    for (const [key, db] of Object.entries(this.databases)) {
      try {
        await this.downloadDatabase(db.url, db.filename);
        const dbPath = path.join(this.databaseDir, db.filename);
        db.reader = await maxmind.open(dbPath);
        this.logger.log(`Loaded ${db.filename} successfully`);
      } catch (error) {
        this.logger.error(`Failed to load ${db.filename}: ${error.message}`);
      }
    }
    
    this.lastUpdated = new Date();
    this.logger.log(`Database update completed at ${this.lastUpdated.toISOString()}`);
  }

  private downloadDatabase(url: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.databaseDir, filename);
      const tempPath = `${filePath}.tmp`;
      
      this.logger.log(`Downloading ${filename}...`);
      
      const downloadWithRedirect = (downloadUrl: string, redirectCount = 0) => {
        if (redirectCount > 5) {
          reject(new Error('Too many redirects'));
          return;
        }

        https.get(downloadUrl, (response) => {
          if (response.statusCode === 301 || response.statusCode === 302) {
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              downloadWithRedirect(redirectUrl, redirectCount + 1);
            } else {
              reject(new Error('Redirect without location header'));
            }
            return;
          }

          if (response.statusCode !== 200) {
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }

          const file = fs.createWriteStream(tempPath);
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            fs.renameSync(tempPath, filePath);
            this.logger.log(`Downloaded ${filename}`);
            resolve();
          });

          file.on('error', (err) => {
            fs.unlinkSync(tempPath);
            reject(err);
          });
        }).on('error', reject);
      };

      downloadWithRedirect(url);
    });
  }

  isValidIP(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$|^:(?::[0-9a-fA-F]{1,4}){1,7}$|^::$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  getAsn(ip: string) {
    if (!this.databases.asn.reader) {
      return null;
    }
    return this.databases.asn.reader.get(ip);
  }

  getCountry(ip: string) {
    if (!this.databases.country.reader) {
      return null;
    }
    return this.databases.country.reader.get(ip);
  }

  getCity(ip: string) {
    if (!this.databases.city.reader) {
      return null;
    }
    return this.databases.city.reader.get(ip);
  }

  getGeolocation(ip: string) {
    const asnData = this.getAsn(ip);
    const cityData = this.getCity(ip);

    if (!asnData && !cityData) {
      return null;
    }

    return {
      ISP: asnData?.autonomous_system_organization,
      registered_country_code: cityData?.registered_country?.iso_code,
      registered_country: cityData?.registered_country?.names?.en,
      city: cityData?.city?.names?.en,
      country_code: cityData?.country?.iso_code,
      country: cityData?.country?.names?.en,
      continent_code: cityData?.continent?.code,
      continent: cityData?.continent?.names?.en,
      location: cityData?.location,
    };
  }

  getLastUpdated(): Date | null {
    return this.lastUpdated;
  }

  isDatabaseReady(): boolean {
    return Object.values(this.databases).every(db => db.reader !== null);
  }
}
