import { Injectable } from '@nestjs/common';
import { 
  INotificationService, 
  ICalendarService, 
  IPatientService, 
  IDoctorService 
} from '../../domain/services/external-services.interface';

@Injectable()
export class MockNotificationService implements INotificationService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`📧 Email envoyé à ${to}`);
    console.log(`   Sujet: ${subject}`);
    console.log(`   Contenu: ${body.substring(0, 100)}...`);
    
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendSMS(to: string, message: string): Promise<void> {
    console.log(`📱 SMS envoyé à ${to}`);
    console.log(`   Message: ${message.substring(0, 50)}...`);
    
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

@Injectable()
export class MockCalendarService implements ICalendarService {
  private events: Map<string, any[]> = new Map();

  async addEvent(doctorId: string, appointment: any): Promise<void> {
    if (!this.events.has(doctorId)) {
      this.events.set(doctorId, []);
    }
    
    this.events.get(doctorId)!.push(appointment);
    console.log(`📅 Événement ajouté au calendrier du médecin ${doctorId}:`, appointment.title);
  }

  async removeEvent(doctorId: string, appointmentId: string): Promise<void> {
    const doctorEvents = this.events.get(doctorId) || [];
    const index = doctorEvents.findIndex(event => event.id === appointmentId);
    
    if (index !== -1) {
      doctorEvents.splice(index, 1);
      console.log(`📅 Événement supprimé du calendrier du médecin ${doctorId}: ${appointmentId}`);
    }
  }

  async updateEvent(doctorId: string, appointment: any): Promise<void> {
    const doctorEvents = this.events.get(doctorId) || [];
    const index = doctorEvents.findIndex(event => event.id === appointment.id);
    
    if (index !== -1) {
      doctorEvents[index] = appointment;
      console.log(`📅 Événement mis à jour dans le calendrier du médecin ${doctorId}:`, appointment.title);
    }
  }

  getEvents(doctorId: string): any[] {
    return this.events.get(doctorId) || [];
  }
}

@Injectable()
export class MockPatientService implements IPatientService {
  private patients = new Map([
    ['patient123', { email: 'patient123@example.com', phone: '+33123456789', name: 'Jean Dupont' }],
    ['patient456', { email: 'patient456@example.com', phone: '+33987654321', name: 'Marie Martin' }],
    ['patient789', { email: 'patient789@example.com', phone: '+33555555555', name: 'Pierre Durand' }],
  ]);

  async getPatientById(patientId: string): Promise<{ email: string; phone: string; name: string }> {
    const patient = this.patients.get(patientId);
    
    if (!patient) {
      throw new Error(`Patient ${patientId} non trouvé`);
    }
    
    console.log(`👤 Patient récupéré: ${patient.name} (${patientId})`);
    return patient;
  }
}

@Injectable()
export class MockDoctorService implements IDoctorService {
  private doctors = new Map([
    ['doctor456', { email: 'dr.smith@example.com', phone: '+33111111111', name: 'Dr. Smith' }],
    ['doctor789', { email: 'dr.johnson@example.com', phone: '+33222222222', name: 'Dr. Johnson' }],
    ['doctor101', { email: 'dr.williams@example.com', phone: '+33333333333', name: 'Dr. Williams' }],
  ]);

  async getDoctorById(doctorId: string): Promise<{ email: string; phone: string; name: string }> {
    const doctor = this.doctors.get(doctorId);
    
    if (!doctor) {
      throw new Error(`Médecin ${doctorId} non trouvé`);
    }
    
    console.log(`👨‍⚕️ Médecin récupéré: ${doctor.name} (${doctorId})`);
    return doctor;
  }
}
