import { VisioId } from '@/domain';

export class StartVisioCommand {
  constructor(
    public readonly visioId: VisioId
  ) {}
}
