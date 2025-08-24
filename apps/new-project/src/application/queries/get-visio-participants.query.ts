import { VisioId } from '@/domain';

export class GetVisioParticipantsQuery {
  constructor(
    public readonly visioId: VisioId
  ) {}
}
