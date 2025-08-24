import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { 
  VisioCreatedEvent,
  VisioStartedEvent,
  VisioActivatedEvent,
  VisioPausedEvent,
  VisioResumedEvent,
  VisioEndedEvent,
  VisioCancelledEvent,
  ParticipantAddedEvent,
  ParticipantConnectedEvent,
  ParticipantDisconnectedEvent,
  ParticipantLeftEvent,
  ParticipantRemovedEvent,
  VisioConfigurationUpdatedEvent
} from '@/domain';
import { VisioProjectionSyncService } from '../persistence/sync/visio-projection-sync.service';

@Injectable()
export class VisioEventHandlers {
  constructor(
    private readonly projectionSyncService: VisioProjectionSyncService
  ) {}

  @OnEvent('VisioCreatedEvent')
  async handleVisioCreated(event: VisioCreatedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioCreated pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioCreated(event);
  }

  @OnEvent('VisioStartedEvent')
  async handleVisioStarted(event: VisioStartedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioStarted pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioStarted(event);
  }

  @OnEvent('VisioActivatedEvent')
  async handleVisioActivated(event: VisioActivatedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioActivated pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioActivated(event);
  }

  @OnEvent('VisioPausedEvent')
  async handleVisioPaused(event: VisioPausedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioPaused pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioPaused(event);
  }

  @OnEvent('VisioResumedEvent')
  async handleVisioResumed(event: VisioResumedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioResumed pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioResumed(event);
  }

  @OnEvent('VisioEndedEvent')
  async handleVisioEnded(event: VisioEndedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioEnded pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioEnded(event);
  }

  @OnEvent('VisioCancelledEvent')
  async handleVisioCancelled(event: VisioCancelledEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioCancelled pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioCancelled(event);
  }

  @OnEvent('ParticipantAddedEvent')
  async handleParticipantAdded(event: ParticipantAddedEvent): Promise<void> {
    console.log(`🔄 Event Handler: ParticipantAdded pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleParticipantAdded(event);
  }

  @OnEvent('ParticipantConnectedEvent')
  async handleParticipantConnected(event: ParticipantConnectedEvent): Promise<void> {
    console.log(`🔄 Event Handler: ParticipantConnected pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleParticipantConnected(event);
  }

  @OnEvent('ParticipantDisconnectedEvent')
  async handleParticipantDisconnected(event: ParticipantDisconnectedEvent): Promise<void> {
    console.log(`🔄 Event Handler: ParticipantDisconnected pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleParticipantDisconnected(event);
  }

  @OnEvent('ParticipantLeftEvent')
  async handleParticipantLeft(event: ParticipantLeftEvent): Promise<void> {
    console.log(`🔄 Event Handler: ParticipantLeft pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleParticipantLeft(event);
  }

  @OnEvent('ParticipantRemovedEvent')
  async handleParticipantRemoved(event: ParticipantRemovedEvent): Promise<void> {
    console.log(`🔄 Event Handler: ParticipantRemoved pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleParticipantRemoved(event);
  }

  @OnEvent('VisioConfigurationUpdatedEvent')
  async handleVisioConfigurationUpdated(event: VisioConfigurationUpdatedEvent): Promise<void> {
    console.log(`🔄 Event Handler: VisioConfigurationUpdated pour ${event.getAggregateId()}`);
    await this.projectionSyncService.handleVisioConfigurationUpdated(event);
  }
}
