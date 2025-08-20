import { IDomainEvent } from '../entities/aggregate-root.interface';

// Événements de domaine purs - aucune dépendance infrastructure
export abstract class AppointmentEvent implements IDomainEvent {
  abstract readonly eventType: string;
  readonly occurredOn: Date = new Date();
}

export class AppointmentCreatedEvent extends AppointmentEvent {
  readonly eventType = 'AppointmentCreatedEvent';
  
  constructor(
    public readonly appointmentId: string,
    public readonly title: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly patientId: string,
    public readonly doctorId: string,
  ) {
    super();
  }
}

export class AppointmentConfirmedEvent extends AppointmentEvent {
  readonly eventType = 'AppointmentConfirmedEvent';
  
  constructor(
    public readonly appointmentId: string,
    public readonly confirmedAt: Date,
  ) {
    super();
  }
}

export class AppointmentCancelledEvent extends AppointmentEvent {
  readonly eventType = 'AppointmentCancelledEvent';
  
  constructor(
    public readonly appointmentId: string,
    public readonly cancelledAt: Date,
    public readonly reason?: string,
  ) {
    super();
  }
}

export class AppointmentCompletedEvent extends AppointmentEvent {
  readonly eventType = 'AppointmentCompletedEvent';
  
  constructor(
    public readonly appointmentId: string,
    public readonly completedAt: Date,
  ) {
    super();
  }
}
