import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { 
  VisioDto,
  ParticipantDto
} from '../handlers';
import { 
  CreateVisioCommand, 
  StartVisioCommand, 
  AddParticipantCommand
} from '../commands';
import {
  GetVisioQuery,
  GetVisioParticipantsQuery
} from '../queries';
import { VisioId, ParticipantId, ParticipantType, VisioConfiguration, ParticipantPreferences } from '@/domain';

@Injectable()
export class VisioApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createVisio(
    configuration?: VisioConfiguration
  ): Promise<string> {
    const visioId = VisioId.generate();
    const command = new CreateVisioCommand(visioId, configuration);
    
    await this.commandBus.execute(command);
    
    return visioId.getValue();
  }

  async startVisio(visioId: string): Promise<void> {
    const id = new VisioId(visioId);
    const command = new StartVisioCommand(id);
    
    await this.commandBus.execute(command);
  }

  async addParticipant(
    visioId: string,
    participantId: string,
    type: ParticipantType,
    isHost: boolean = false,
    preferences?: ParticipantPreferences
  ): Promise<void> {
    const visioIdObj = new VisioId(visioId);
    const participantIdObj = new ParticipantId(participantId);
    const command = new AddParticipantCommand(
      visioIdObj,
      participantIdObj,
      type,
      isHost,
      preferences
    );
    
    await this.commandBus.execute(command);
  }

  async getVisio(visioId: string): Promise<VisioDto | null> {
    const id = new VisioId(visioId);
    const query = new GetVisioQuery(id);
    
    return this.queryBus.execute(query);
  }

  async getVisioParticipants(visioId: string): Promise<ParticipantDto[]> {
    const id = new VisioId(visioId);
    const query = new GetVisioParticipantsQuery(id);
    
    return this.queryBus.execute(query);
  }
}
