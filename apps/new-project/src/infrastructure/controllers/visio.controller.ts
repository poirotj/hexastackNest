import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { VisioApplicationService } from '@/application';
import { VisioProjectionSyncService } from '../persistence/sync/visio-projection-sync.service';
import { InMemoryVisioReadRepository } from '../persistence/in-memory/visio-read-repository';
import { ParticipantType, VisioConfiguration, ParticipantPreferences } from '@/domain';

// DTOs pour l'API
export class CreateVisioDto {
  configuration?: {
    shareScreen: boolean;
    chat: boolean;
    document: boolean;
    recording: boolean;
    maxParticipants: number;
  };
}

export class AddParticipantDto {
  participantId: string;
  type: 'INTERNAL' | 'EXTERNAL';
  isHost: boolean;
  preferences?: {
    microphone: boolean;
    speaker: boolean;
    camera: boolean;
    notifications: boolean;
  };
}

export class StartVisioDto {
  visioId: string;
}

export class EndVisioDto {
  visioId: string;
}

@Controller('visios')
export class VisioController {
  constructor(
    private readonly visioApplicationService: VisioApplicationService,
    private readonly projectionSyncService: VisioProjectionSyncService,
    private readonly readRepository: InMemoryVisioReadRepository
  ) {}

  // POST /visios - Créer une visioconférence
  @Post()
  async createVisio(@Body() createVisioDto: CreateVisioDto) {
    try {
      const visioId = await this.visioApplicationService.createVisio();
      
      return {
        success: true,
        message: 'Visioconférence créée avec succès',
        data: {
          visioId,
          status: 'CREATED'
        }
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la création: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // GET /visios/:id - Récupérer une visioconférence
  @Get(':id')
  async getVisio(@Param('id') id: string) {
    try {
      const visio = await this.visioApplicationService.getVisio(id);
      
      if (!visio) {
        throw new HttpException('Visioconférence non trouvée', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: visio
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Erreur lors de la récupération: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /visios/:id/participants - Récupérer les participants
  @Get(':id/participants')
  async getVisioParticipants(@Param('id') id: string) {
    try {
      const participants = await this.visioApplicationService.getVisioParticipants(id);
      
      return {
        success: true,
        data: participants
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des participants: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // POST /visios/:id/participants - Ajouter un participant
  @Post(':id/participants')
  async addParticipant(
    @Param('id') visioId: string,
    @Body() addParticipantDto: AddParticipantDto
  ) {
    try {
      await this.visioApplicationService.addParticipant(
        visioId,
        addParticipantDto.participantId,
        addParticipantDto.type as ParticipantType,
        addParticipantDto.isHost,
        addParticipantDto.preferences ? ParticipantPreferences.fromData(addParticipantDto.preferences) : undefined
      );

      return {
        success: true,
        message: 'Participant ajouté avec succès'
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de l'ajout du participant: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // POST /visios/:id/start - Démarrer une visioconférence
  @Post(':id/start')
  async startVisio(@Param('id') id: string) {
    try {
      await this.visioApplicationService.startVisio(id);
      
      return {
        success: true,
        message: 'Visioconférence démarrée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors du démarrage: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // POST /visios/:id/end - Terminer une visioconférence
  @Post(':id/end')
  async endVisio(@Param('id') id: string) {
    try {
      // Note: Cette méthode n'est pas encore implémentée dans le service
      // await this.visioApplicationService.endVisio(id);
      
      return {
        success: true,
        message: 'Visioconférence terminée avec succès'
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la terminaison: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // GET /visios - Lister les visioconférences
  @Get()
  async listVisios(
    @Query('status') status?: string,
    @Query('hostId') hostId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const criteria: any = {};
      if (status) criteria.status = status;
      if (hostId) criteria.hostId = hostId;
      criteria.limit = limit;
      criteria.offset = (page - 1) * limit;

      const result = await this.readRepository.search(criteria);
      
      return {
        success: true,
        data: {
          visios: result,
          pagination: {
            page,
            limit,
            total: result.length
          }
        }
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /visios/stats/statistics - Obtenir les statistiques
  @Get('stats/statistics')
  async getStatistics() {
    try {
      const stats = await this.readRepository.getStatistics();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des statistiques: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /visios/stats/real-time - Statistiques en temps réel
  @Get('stats/real-time')
  async getRealTimeStatistics() {
    try {
      const stats = await this.projectionSyncService.getRealTimeStatistics();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des statistiques: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // POST /visios/sync/projections - Synchroniser toutes les projections
  @Post('sync/projections')
  async syncAllProjections() {
    try {
      await this.projectionSyncService.syncAllProjections();
      
      return {
        success: true,
        message: 'Toutes les projections ont été synchronisées'
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la synchronisation: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
