import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AppointmentCancelledEvent } from '../../domain/events/appointment.events';
import { AppointmentProjectionService } from '../services/appointment-projection.service';

@EventsHandler(AppointmentCancelledEvent)
export class AppointmentCancelledHandler implements IEventHandler<AppointmentCancelledEvent> {
  constructor(private readonly projectionService: AppointmentProjectionService) {}

  async handle(event: AppointmentCancelledEvent) {
    console.log('AppointmentCancelledEvent handled:', event.appointmentId);
    
    // Note: Pour mettre à jour la projection, nous aurions besoin de récupérer l'agrégat complet
    // car l'événement ne contient que l'ID et la date d'annulation
    // await this.projectionService.updateReadModel(appointment);
    
    // Ici vous pouvez ajouter d'autres logiques comme :
    // - Envoyer une notification d'annulation
    // - Libérer le créneau dans le calendrier
    // - Proposer d'autres créneaux
  }
}
