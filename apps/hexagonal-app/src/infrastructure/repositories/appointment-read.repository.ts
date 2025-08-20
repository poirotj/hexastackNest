import { Injectable } from '@nestjs/common';
import { IAppointmentReadRepository, AppointmentReadModel } from '../../domain/repositories/appointment-read.repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AppointmentReadRepository implements IAppointmentReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AppointmentReadModel | null> {
    const readModel = await this.prisma.appointmentReadModel.findUnique({
      where: { appointmentId: id },
    });

    if (!readModel) {
      return null;
    }

    return this.mapToReadModel(readModel);
  }

  async findByPatientId(patientId: string): Promise<AppointmentReadModel[]> {
    const readModels = await this.prisma.appointmentReadModel.findMany({
      where: { patientId },
      orderBy: { startDate: 'asc' },
    });

    return readModels.map(model => this.mapToReadModel(model));
  }

  async findByDoctorId(doctorId: string): Promise<AppointmentReadModel[]> {
    const readModels = await this.prisma.appointmentReadModel.findMany({
      where: { doctorId },
      orderBy: { startDate: 'asc' },
    });

    return readModels.map(model => this.mapToReadModel(model));
  }

  async findAll(): Promise<AppointmentReadModel[]> {
    const readModels = await this.prisma.appointmentReadModel.findMany({
      orderBy: { startDate: 'asc' },
    });

    return readModels.map(model => this.mapToReadModel(model));
  }

  async findByStatus(status: string): Promise<AppointmentReadModel[]> {
    const readModels = await this.prisma.appointmentReadModel.findMany({
      where: { status },
      orderBy: { startDate: 'asc' },
    });

    return readModels.map(model => this.mapToReadModel(model));
  }

  private mapToReadModel(prismaModel: any): AppointmentReadModel {
    return {
      id: prismaModel.appointmentId,
      title: prismaModel.title,
      description: prismaModel.description,
      startDate: prismaModel.startDate,
      endDate: prismaModel.endDate,
      patientId: prismaModel.patientId,
      doctorId: prismaModel.doctorId,
      status: prismaModel.status,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
    };
  }
}
