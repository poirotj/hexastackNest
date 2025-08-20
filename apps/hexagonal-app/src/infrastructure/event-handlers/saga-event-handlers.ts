import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { AppointmentCreatedEvent, AppointmentConfirmedEvent, AppointmentCancelledEvent } from '../../domain/events/appointment.events';
import { AppointmentCreationSaga } from '../../application/sagas/appointment-creation-saga';
import { AppointmentConfirmationSaga } from '../../application/sagas/appointment-confirmation-saga';
import { AppointmentCancellationSaga } from '../../application/sagas/appointment-cancellation-saga';

// Event handlers pour déclencher les sagas
// Ces handlers sont dans l'infrastructure car ils dépendent de NestJS CQRS

@EventsHandler(AppointmentCreatedEvent)
export class AppointmentCreatedSagaHandler implements IEventHandler<AppointmentCreatedEvent> {
  constructor(private readonly creationSaga: AppointmentCreationSaga) {}

  async handle(event: AppointmentCreatedEvent) {
    await this.creationSaga.execute(event);
  }
}

@EventsHandler(AppointmentConfirmedEvent)
export class AppointmentConfirmedSagaHandler implements IEventHandler<AppointmentConfirmedEvent> {
  constructor(private readonly confirmationSaga: AppointmentConfirmationSaga) {}

  async handle(event: AppointmentConfirmedEvent) {
    await this.confirmationSaga.execute(event);
  }
}

@EventsHandler(AppointmentCancelledEvent)
export class AppointmentCancelledSagaHandler implements IEventHandler<AppointmentCancelledEvent> {
  constructor(private readonly cancellationSaga: AppointmentCancellationSaga) {}

  async handle(event: AppointmentCancelledEvent) {
    await this.cancellationSaga.execute(event);
  }
}
