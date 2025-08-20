import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from '../../application/commands/create-appointment.command';
import { ConfirmAppointmentCommand } from '../../application/commands/confirm-appointment.command';
import { CancelAppointmentCommand } from '../../application/commands/cancel-appointment.command';
import { GetAppointmentQuery } from '../../application/queries/get-appointment.query';
import { GetAppointmentsQuery } from '../../application/queries/get-appointments.query';

export class CreateAppointmentDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  patientId: string;
  doctorId: string;
}

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    const command = new CreateAppointmentCommand(
      createAppointmentDto.title,
      createAppointmentDto.description,
      new Date(createAppointmentDto.startDate),
      new Date(createAppointmentDto.endDate),
      createAppointmentDto.patientId,
      createAppointmentDto.doctorId,
    );

    await this.commandBus.execute(command);
    return { message: 'Rendez-vous créé avec succès' };
  }

  @Put(':id/confirm')
  async confirmAppointment(@Param('id') id: string) {
    const command = new ConfirmAppointmentCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Rendez-vous confirmé avec succès' };
  }

  @Put(':id/cancel')
  async cancelAppointment(@Param('id') id: string) {
    const command = new CancelAppointmentCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Rendez-vous annulé avec succès' };
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    const query = new GetAppointmentQuery(id);
    return await this.queryBus.execute(query);
  }

  @Get()
  async getAppointments(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    const query = new GetAppointmentsQuery(patientId, doctorId);
    return await this.queryBus.execute(query);
  }
}
