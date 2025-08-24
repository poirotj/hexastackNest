import { VisioId, ParticipantId } from '@/domain';

export class ConnectParticipantCommand {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId
  ) {}
}
