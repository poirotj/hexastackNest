import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AppointmentConfirmedEvent } from '../../domain/events/appointment.events';
import { AppointmentProjectionService } from '../services/appointment-projection.service';

@EventsHandler(AppointmentConfirmedEvent)
export class AppointmentConfirmedHandler implements IEventHandler<AppointmentConfirmedEvent> {
  constructor(private readonly projectionService: AppointmentProjectionService) {}

  async handle(event: AppointmentConfirmedEvent) {
    console.log('AppointmentConfirmedEvent handled:', event.appointmentId);
    
    // Note: Pour mettre à jour la projection, nous aurions besoin de récupérer l'agrégat complet
    // car l'événement ne contient que l'ID et la date de confirmation
    // await this.projectionService.updateReadModel(appointment);
    
    // Ici vous pouvez ajouter d'autres logiques comme :
    // - Envoyer une notification de confirmation au patient
    // - Mettre à jour le calendrier du médecin
    // - Déclencher des rappels
  }
}
