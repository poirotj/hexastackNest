import { VisioId } from '@/domain';

export class EndVisioCommand {
  constructor(
    public readonly visioId: VisioId
  ) {}
}
