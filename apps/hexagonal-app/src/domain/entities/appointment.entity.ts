import { AggregateRoot } from './aggregate-root';
import { 
  AppointmentCreatedEvent, 
  AppointmentConfirmedEvent, 
  AppointmentCancelledEvent, 
  AppointmentCompletedEvent 
} from '../events/appointment.events';

export interface AppointmentProps {
  id?: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  patientId: string;
  doctorId: string;
  status?: AppointmentStatus;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class Appointment extends AggregateRoot {
  private _id: string;
  private _title: string;
  private _description?: string;
  private _startDate: Date;
  private _endDate: Date;
  private _patientId: string;
  private _doctorId: string;
  private _status: AppointmentStatus;

  constructor(props: AppointmentProps) {
    super();
    this._id = props.id || this.generateId();
    this._title = props.title;
    this._description = props.description;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._patientId = props.patientId;
    this._doctorId = props.doctorId;
    this._status = props.status || AppointmentStatus.SCHEDULED;
  }

  static create(props: AppointmentProps): Appointment {
    const appointment = new Appointment(props);
    appointment.apply(new AppointmentCreatedEvent(
      appointment.id,
      appointment.title,
      appointment.startDate,
      appointment.endDate,
      appointment.patientId,
      appointment.doctorId
    ));
    return appointment;
  }

  confirm(): void {
    if (this._status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Seul un rendez-vous programmé peut être confirmé');
    }
    this._status = AppointmentStatus.CONFIRMED;
    this.apply(new AppointmentConfirmedEvent(this.id, new Date()));
  }

  cancel(): void {
    if (this._status === AppointmentStatus.CANCELLED) {
      throw new Error('Le rendez-vous est déjà annulé');
    }
    this._status = AppointmentStatus.CANCELLED;
    this.apply(new AppointmentCancelledEvent(this.id, new Date()));
  }

  complete(): void {
    if (this._status !== AppointmentStatus.CONFIRMED) {
      throw new Error('Seul un rendez-vous confirmé peut être marqué comme terminé');
    }
    this._status = AppointmentStatus.COMPLETED;
    this.apply(new AppointmentCompletedEvent(this.id, new Date()));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Getters
  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get description(): string | undefined { return this._description; }
  get startDate(): Date { return this._startDate; }
  get endDate(): Date { return this._endDate; }
  get patientId(): string { return this._patientId; }
  get doctorId(): string { return this._doctorId; }
  get status(): AppointmentStatus { return this._status; }

  // Gestion des événements spécifiques
  protected handleEvent(event: any): void {
    switch (event.eventType) {
      case 'AppointmentCreatedEvent':
        break;
      case 'AppointmentConfirmedEvent':
        this._status = AppointmentStatus.CONFIRMED;
        break;
      case 'AppointmentCancelledEvent':
        this._status = AppointmentStatus.CANCELLED;
        break;
      case 'AppointmentCompletedEvent':
        this._status = AppointmentStatus.COMPLETED;
        break;
    }
  }
}
