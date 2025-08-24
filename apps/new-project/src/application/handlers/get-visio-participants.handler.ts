import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVisioParticipantsQuery } from '../queries';
import { VisioAggregate, VisioId } from '@/domain';
import { IVisioRepository } from '@/domain';

export interface ParticipantDto {
  id: string;
  type: string;
  status: string;
  isHost: boolean;
  preferences: any;
  hasConnectionLink: boolean;
  connectionLinkExpiredAt: Date | null;
}

@QueryHandler(GetVisioParticipantsQuery)
export class GetVisioParticipantsHandler implements IQueryHandler<GetVisioParticipantsQuery, ParticipantDto[]> {
  constructor(
    @Inject('IVisioRepository')
    private readonly visioRepository: IVisioRepository
  ) {}

  async execute(query: GetVisioParticipantsQuery): Promise<ParticipantDto[]> {
    const { visioId } = query;

    const visio = await this.visioRepository.findById(visioId);
    if (!visio) {
      return [];
    }

    return visio.getParticipants().map(participant => ({
      id: participant.getId().getValue(),
      type: participant.getType().getValue(),
      status: participant.getStatus().getValue(),
      isHost: participant.isHostParticipant(),
      preferences: participant.getPreferences().toData(),
      hasConnectionLink: participant.getConnectionLink() !== null,
      connectionLinkExpiredAt: participant.getConnectionLink()?.getExpiredAt() || null
    }));
  }
}
