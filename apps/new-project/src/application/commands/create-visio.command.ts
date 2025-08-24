import { VisioId, VisioConfiguration } from '@/domain';

export class CreateVisioCommand {
  constructor(
    public readonly visioId: VisioId,
    public readonly configuration?: VisioConfiguration
  ) {}
}
