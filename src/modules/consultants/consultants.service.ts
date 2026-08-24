import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { CreateConsultantDto } from '@/modules/consultants/dto/create-consultant.dto';
import { UpdateConsultantDto } from '@/modules/consultants/dto/update-consultant.dto';
import { ConsultantResponseDto } from '@/modules/consultants/dto/consultant-response.dto';

@Injectable()
export class ConsultantsService {
  constructor(
    @InjectRepository(Consultant)
    private readonly consultantRepository: Repository<Consultant>,
  ) {}

  async create(createConsultantDto: CreateConsultantDto): Promise<Consultant> {
    const consultant = this.consultantRepository.create(createConsultantDto);
    return await this.consultantRepository.save(consultant);
  }

  async findAll(): Promise<ConsultantResponseDto[]> {
    const consultants = await this.consultantRepository.find({
      order: { name: 'ASC' },
    });
    return consultants.map((c) => ConsultantResponseDto.fromEntity(c));
  }

  async findById(id: string): Promise<Consultant> {
    const consultant = await this.consultantRepository.findOne({
      where: { id },
    });
    if (!consultant) {
      throw new NotFoundException(`Consultant with ID ${id} not found`);
    }
    return consultant;
  }

  async update(
    id: string,
    updateConsultantDto: UpdateConsultantDto,
  ): Promise<ConsultantResponseDto> {
    const consultant = await this.findById(id);
    Object.assign(consultant, updateConsultantDto);
    const updated = await this.consultantRepository.save(consultant);
    return ConsultantResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    const consultant = await this.findById(id);
    await this.consultantRepository.remove(consultant);
  }
}
