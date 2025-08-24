import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { VisioApplicationService, VisioProjectionService } from './application';
import { 
  CreateVisioHandler,
  StartVisioHandler,
  AddParticipantHandler,
  GetVisioHandler,
  GetVisioParticipantsHandler
} from './application/handlers';
import { 
  InMemoryVisioWriteRepository,
  InMemoryVisioReadRepository,
  VisioProjectionSyncService
} from './infrastructure/persistence';
import { VisioController } from './infrastructure/controllers';
import { VisioEventHandlers } from './infrastructure/event-handlers';

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot()
  ],
  providers: [
    // Application Services
    VisioApplicationService,
    VisioProjectionService,
    
    // Command Handlers
    CreateVisioHandler,
    StartVisioHandler,
    AddParticipantHandler,
    
    // Query Handlers
    GetVisioHandler,
    GetVisioParticipantsHandler,
    
    // Infrastructure - Repositories
    {
      provide: 'IVisioRepository',
      useClass: InMemoryVisioWriteRepository
    },
    {
      provide: 'IVisioReadRepository',
      useClass: InMemoryVisioReadRepository
    },
    
    // Infrastructure - Services
    VisioProjectionSyncService,
    
    // Infrastructure - Event Handlers
    VisioEventHandlers
  ],
  controllers: [VisioController],
  exports: [VisioApplicationService, VisioProjectionService]
})
export class AppModule {}
