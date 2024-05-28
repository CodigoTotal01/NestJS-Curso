import { Controller, Get, } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';


// Suggested code may be subject to a license. Learn more: ~LicenseLog:121118631.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1204000312.
@ApiTags('Seed')

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {
    return this.seedService.runSeed()
  }
}