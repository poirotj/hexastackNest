import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Appointment } from '../../domain/entities/appointment.entity';

@Injectable()
export class AppointmentProjectionService {
  constructor(private readonly prisma: PrismaService) {}

  async updateReadModel(appointment: Appointment): Promise<void> {
    const upsertData = {
      appointmentId: appointment.id,
      title: appointment.title,
      description: appointment.description,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: appointment.status,
    };

    // Vérifier si le read model existe déjà
    const existingReadModel = await this.prisma.appointmentReadModel.findUnique({
      where: { appointmentId: appointment.id },
    });

    if (existingReadModel) {
      await this.prisma.appointmentReadModel.update({
        where: { id: existingReadModel.id },
        data: upsertData,
      });
    } else {
      await this.prisma.appointmentReadModel.create({
        data: upsertData,
      });
    }
  }
}
