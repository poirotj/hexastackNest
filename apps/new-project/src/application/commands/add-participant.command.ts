import { VisioId, ParticipantId, ParticipantType, ParticipantPreferences } from '@/domain';

export class AddParticipantCommand {
  constructor(
    public readonly visioId: VisioId,
    public readonly participantId: ParticipantId,
    public readonly type: ParticipantType,
    public readonly isHost: boolean = false,
    public readonly preferences?: ParticipantPreferences
  ) {}
}
