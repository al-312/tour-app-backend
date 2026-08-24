import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDestinationDto {
  @ApiProperty({ example: 'Paris', description: 'Name of the destination' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'France', description: 'Country of the destination' })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiPropertyOptional({
    example: 'The city of light and romance.',
    description: 'Detailed description of the destination',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'URL of the cover image',
  })
  @IsString()
  @IsOptional()
  coverImage?: string;
}
