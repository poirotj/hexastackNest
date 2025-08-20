import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Domain
import { IAppointmentWriteRepository, APPOINTMENT_WRITE_REPOSITORY } from '../domain/repositories/appointment-write.repository.interface';
import { IAppointmentReadRepository, APPOINTMENT_READ_REPOSITORY } from '../domain/repositories/appointment-read.repository.interface';
import { EVENT_PUBLISHER } from '../domain/application/command-handler.interface';

// Application - Commands
import { CreateAppointmentCommand } from '../application/commands/create-appointment.command';
import { ConfirmAppointmentCommand } from '../application/commands/confirm-appointment.command';
import { CancelAppointmentCommand } from '../application/commands/cancel-appointment.command';
import { CreateAppointmentHandler } from '../application/commands/handlers/create-appointment.handler';
import { ConfirmAppointmentHandler } from '../application/commands/handlers/confirm-appointment.handler';
import { CancelAppointmentHandler } from '../application/commands/handlers/cancel-appointment.handler';

// Application - Queries
import { GetAppointmentQuery } from '../application/queries/get-appointment.query';
import { GetAppointmentsQuery } from '../application/queries/get-appointments.query';
import { GetAppointmentHandler } from '../application/queries/handlers/get-appointment.handler';
import { GetAppointmentsHandler } from '../application/queries/handlers/get-appointments.handler';

// Infrastructure
import { PrismaService } from '../infrastructure/database/prisma.service';
import { AppointmentWriteRepository } from '../infrastructure/repositories/appointment-write.repository';
import { AppointmentReadRepository } from '../infrastructure/repositories/appointment-read.repository';
import { AppointmentProjectionService } from '../infrastructure/services/appointment-projection.service';
import { AppointmentCreatedHandler } from '../infrastructure/event-handlers/appointment-created.handler';
import { AppointmentConfirmedHandler } from '../infrastructure/event-handlers/appointment-confirmed.handler';
import { AppointmentCancelledHandler } from '../infrastructure/event-handlers/appointment-cancelled.handler';

// Kafka Infrastructure
import { KafkaModule } from '../infrastructure/kafka/kafka.module';
import { KafkaEventPublisherService } from '../infrastructure/kafka/kafka-event-publisher.service';

// Sagas
import { AppointmentCreationSaga } from '../application/sagas/appointment-creation-saga';
import { AppointmentConfirmationSaga } from '../application/sagas/appointment-confirmation-saga';
import { AppointmentCancellationSaga } from '../application/sagas/appointment-cancellation-saga';
import { AppointmentReminderSaga } from '../application/sagas/appointment-reminder-saga';
import { 
  INotificationService,
  ICalendarService,
  IPatientService,
  IDoctorService,
  NOTIFICATION_SERVICE,
  CALENDAR_SERVICE,
  PATIENT_SERVICE,
  DOCTOR_SERVICE
} from '../domain/services/external-services.interface';

// Saga Event Handlers
import { 
  AppointmentCreatedSagaHandler,
  AppointmentConfirmedSagaHandler,
  AppointmentCancelledSagaHandler
} from '../infrastructure/event-handlers/saga-event-handlers';

// Mock Services
import { 
  MockNotificationService,
  MockCalendarService,
  MockPatientService,
  MockDoctorService
} from '../infrastructure/services/mock-services';

// User Interface
import { AppointmentController } from '../userInterface/controllers/appointment.controller';

const CommandHandlers = [
  CreateAppointmentHandler,
  ConfirmAppointmentHandler,
  CancelAppointmentHandler,
];

const QueryHandlers = [
  GetAppointmentHandler,
  GetAppointmentsHandler,
];

const EventHandlers = [
  AppointmentCreatedHandler,
  AppointmentConfirmedHandler,
  AppointmentCancelledHandler,
  // Saga handlers
  AppointmentCreatedSagaHandler,
  AppointmentConfirmedSagaHandler,
  AppointmentCancelledSagaHandler,
];

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot(),
    KafkaModule,
  ],
  controllers: [AppointmentController],
  providers: [
    PrismaService,
    {
      provide: APPOINTMENT_WRITE_REPOSITORY,
      useClass: AppointmentWriteRepository,
    },
    {
      provide: APPOINTMENT_READ_REPOSITORY,
      useClass: AppointmentReadRepository,
    },
    AppointmentProjectionService,
    
    // Kafka Services
    KafkaEventPublisherService,
    
    // Sagas
    AppointmentCreationSaga,
    AppointmentConfirmationSaga,
    AppointmentCancellationSaga,
    AppointmentReminderSaga,
    // Mock services for saga
    {
      provide: NOTIFICATION_SERVICE,
      useClass: MockNotificationService,
    },
    {
      provide: CALENDAR_SERVICE,
      useClass: MockCalendarService,
    },
    {
      provide: PATIENT_SERVICE,
      useClass: MockPatientService,
    },
    {
      provide: DOCTOR_SERVICE,
      useClass: MockDoctorService,
    },
    
    // Event Publisher (Kafka)
    {
      provide: EVENT_PUBLISHER,
      useClass: KafkaEventPublisherService,
    },
    
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [APPOINTMENT_WRITE_REPOSITORY, APPOINTMENT_READ_REPOSITORY],
})
export class AppointmentModule {}
