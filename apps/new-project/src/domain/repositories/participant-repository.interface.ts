import { ParticipantId } from '../value-objects';
import { Participant } from '../entities';

export interface IParticipantRepository {
  findById(id: ParticipantId): Promise<Participant | null>;
  save(participant: Participant): Promise<void>;
  delete(id: ParticipantId): Promise<void>;
}
