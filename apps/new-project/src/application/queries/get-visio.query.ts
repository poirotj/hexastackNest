import { VisioId } from '@/domain';

export class GetVisioQuery {
  constructor(
    public readonly visioId: VisioId
  ) {}
}
