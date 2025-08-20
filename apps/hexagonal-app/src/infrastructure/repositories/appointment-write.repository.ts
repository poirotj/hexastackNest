import { Injectable } from '@nestjs/common';
import { IAppointmentWriteRepository } from '../../domain/repositories/appointment-write.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { PrismaService } from '../database/prisma.service';
import { AppointmentReconstructionService } from '../services/appointment-reconstruction.service';

@Injectable()
export class AppointmentWriteRepository implements IAppointmentWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(appointment: Appointment): Promise<void> {
    const events = appointment.getUncommittedEvents();
    
    for (const event of events) {
      await this.prisma.eventStore.create({
        data: {
          aggregateId: appointment.id,
          eventType: event.constructor.name,
          eventData: event as any, // Cast pour Prisma
          version: appointment.version,
        },
      });
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    const events = await this.prisma.eventStore.findMany({
      where: { aggregateId: id },
      orderBy: { version: 'asc' },
    });

    if (events.length === 0) {
      return null;
    }

    return AppointmentReconstructionService.fromEvents(events.map(event => event.eventData));
  }
}
