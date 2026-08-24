import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SeedService } from '@/modules/seed/seed.service';
import { Public } from '@/modules/auth/decorators/public.decorator';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Seed database with sample data' })
  @ApiResponse({ status: 200, description: 'Sample data seeded successfully' })
  async seed(): Promise<{ message: string }> {
    return this.seedService.run();
  }
}
