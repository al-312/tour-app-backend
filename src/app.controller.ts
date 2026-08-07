import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Welcome route' })
  @ApiResponse({
    status: 200,
    description: 'Welcome text',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to Tour App API' },
      },
    },
  })
  getWelcome(): { message: string } {
    return { message: 'Welcome to Tour App API' };
  }
}
