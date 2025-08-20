import { Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentProps } from '../../domain/entities/appointment.entity';

@Injectable()
export class AppointmentReconstructionService {
  // Méthode pour reconstruire l'agrégat depuis les événements
  static fromEvents(events: any[]): Appointment {
    const appointment = new Appointment({} as AppointmentProps);
    events.forEach(event => {
      appointment.handleEventPublic(event);
      appointment.incrementVersion();
    });
    return appointment;
  }
}
