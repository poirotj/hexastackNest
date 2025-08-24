import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVisioQuery } from '../queries';
import { VisioAggregate, VisioId } from '@/domain';
import { IVisioRepository } from '@/domain';

export interface VisioDto {
  id: string;
  status: string;
  configuration: any;
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  participantsCount: number;
  activeParticipantsCount: number;
}

@QueryHandler(GetVisioQuery)
export class GetVisioHandler implements IQueryHandler<GetVisioQuery, VisioDto | null> {
  constructor(
    @Inject('IVisioRepository')
    private readonly visioRepository: IVisioRepository
  ) {}

  async execute(query: GetVisioQuery): Promise<VisioDto | null> {
    const { visioId } = query;

    const visio = await this.visioRepository.findById(visioId);
    if (!visio) {
      return null;
    }

    return {
      id: visio.getId().getValue(),
      status: visio.getStatus().getValue(),
      configuration: visio.getConfiguration().toData(),
      createdAt: visio.getCreatedAt(),
      startedAt: visio.getStartedAt(),
      endedAt: visio.getEndedAt(),
      participantsCount: visio.getParticipants().length,
      activeParticipantsCount: visio.getActiveParticipantsCount()
    };
  }
}
