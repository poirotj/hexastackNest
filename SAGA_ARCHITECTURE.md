# 🏗️ Architecture des Sagas Spécialisées

## 🎯 Vue d'ensemble

Après le refactoring, nous avons une **architecture de sagas modulaire** où chaque saga a une responsabilité unique et bien définie. Cette approche respecte parfaitement le **Single Responsibility Principle** et facilite grandement la maintenance et l'évolution.

## 🏛️ Structure de l'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                            │
├─────────────────────────────────────────────────────────────┤
│ external-services.interface.ts                             │
│ - INotificationService                                     │
│ - ICalendarService                                         │
│ - IPatientService                                          │
│ - IDoctorService                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│ base-saga.ts                                               │
│ - BaseSaga (classe abstraite)                             │
│ - Services externes communs                                │
│ - Méthodes utilitaires                                     │
│                                                             │
│ appointment-creation-saga.ts                               │
│ - AppointmentCreationSaga                                  │
│ - Gestion de la création + compensations                   │
│                                                             │
│ appointment-confirmation-saga.ts                           │
│ - AppointmentConfirmationSaga                              │
│ - Gestion de la confirmation                               │
│                                                             │
│ appointment-cancellation-saga.ts                           │
│ - AppointmentCancellationSaga                              │
│ - Gestion de l'annulation                                  │
│                                                             │
│ appointment-reminder-saga.ts                               │
│ - AppointmentReminderSaga                                  │
│ - Gestion des rappels                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER                        │
├─────────────────────────────────────────────────────────────┤
│ saga-event-handlers.ts                                     │
│ - AppointmentCreatedSagaHandler                            │
│ - AppointmentConfirmedSagaHandler                          │
│ - AppointmentCancelledSagaHandler                          │
│                                                             │
│ mock-services.ts                                            │
│ - Implémentations mock des services externes               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Composants détaillés

### 1. **BaseSaga** - Classe de base commune
```typescript
export abstract class BaseSaga {
  // Services externes injectés
  protected readonly notificationService: INotificationService;
  protected readonly calendarService: ICalendarService;
  protected readonly patientService: IPatientService;
  protected readonly doctorService: IDoctorService;

  // Méthodes utilitaires communes
  protected async getPatientAndDoctor(patientId: string, doctorId: string);
  protected logSuccess(operation: string, appointmentId: string): void;
  protected logError(operation: string, appointmentId: string, error: any): void;
  protected logCompensation(operation: string, appointmentId: string): void;
}
```

**Avantages :**
- **DRY** : Pas de duplication de code
- **Cohérence** : Même interface pour toutes les sagas
- **Maintenance** : Modifications centralisées

### 2. **AppointmentCreationSaga** - Création de rendez-vous
```typescript
export class AppointmentCreationSaga extends BaseSaga {
  async execute(event: AppointmentCreatedEvent): Promise<void> {
    // 1. Récupérer patient et médecin
    // 2. Ajouter au calendrier
    // 3. Envoyer notifications
    // 4. Gérer les erreurs avec compensation
  }
}
```

**Responsabilités :**
- Orchestration de la création
- Gestion des erreurs
- Compensation en cas d'échec
- Logging et monitoring

### 3. **AppointmentConfirmationSaga** - Confirmation de rendez-vous
```typescript
export class AppointmentConfirmationSaga extends BaseSaga {
  async execute(event: AppointmentConfirmedEvent): Promise<void> {
    // Logique de confirmation
    // Mise à jour des projections
    // Notifications de confirmation
  }
}
```

**Responsabilités :**
- Traitement de la confirmation
- Mise à jour des états
- Notifications de confirmation

### 4. **AppointmentCancellationSaga** - Annulation de rendez-vous
```typescript
export class AppointmentCancellationSaga extends BaseSaga {
  async execute(event: AppointmentCancelledEvent): Promise<void> {
    // Logique d'annulation
    // Libération des ressources
    // Notifications d'annulation
  }
}
```

**Responsabilités :**
- Traitement de l'annulation
- Nettoyage des ressources
- Notifications d'annulation

### 5. **AppointmentReminderSaga** - Gestion des rappels
```typescript
export class AppointmentReminderSaga extends BaseSaga {
  async scheduleReminder(appointment: any, patient: any, doctor: any): Promise<void>;
  async cancelScheduledReminders(appointmentId: string): Promise<void>;
  async sendImmediateReminder(appointment: any, patient: any, doctor: any): Promise<void>;
}
```

**Responsabilités :**
- Programmation des rappels
- Annulation des rappels
- Envoi de rappels immédiats

## 🎯 Avantages de cette architecture

### 1. **Single Responsibility Principle (SRP)**
- Chaque saga a une seule responsabilité
- Code plus facile à comprendre et maintenir

### 2. **Open/Closed Principle (OCP)**
- Ouvert à l'extension (nouvelles sagas)
- Fermé à la modification (sagas existantes)

### 3. **Dependency Inversion Principle (DIP)**
- Les sagas dépendent d'abstractions (interfaces)
- Pas de couplage avec les implémentations

### 4. **Interface Segregation Principle (ISP)**
- Interfaces spécifiques et cohérentes
- Pas de dépendances inutiles

### 5. **Facilité de test**
- Chaque saga testable indépendamment
- Mocks facilement injectables
- Tests unitaires ciblés

## 🚀 Cas d'usage concrets

### **Création d'un nouveau type de saga**
```typescript
@Injectable()
export class AppointmentReschedulingSaga extends BaseSaga {
  async execute(event: AppointmentRescheduledEvent): Promise<void> {
    // Logique de reprogrammation
    // Mise à jour du calendrier
    // Notifications de changement
  }
}
```

### **Ajout d'une nouvelle fonctionnalité**
```typescript
// Dans AppointmentReminderSaga
async scheduleFollowUpReminder(appointment: any): Promise<void> {
  // Programmer un rappel de suivi
}
```

### **Composition de sagas**
```typescript
// Une saga peut utiliser d'autres sagas
async execute(event: AppointmentCreatedEvent): Promise<void> {
  await this.creationSaga.execute(event);
  await this.reminderSaga.scheduleReminder(appointment, patient, doctor);
}
```

## 📊 Monitoring et observabilité

### **Logs structurés**
```typescript
// Chaque saga génère des logs cohérents
✅ Saga Création: Rendez-vous abc123 traité avec succès
❌ Saga Création: Erreur pour le rendez-vous abc123: ...
🔄 Compensation Création: Tentative de nettoyage pour le rendez-vous abc123
```

### **Métriques par saga**
- Temps d'exécution par type de saga
- Taux de succès/échec
- Temps de compensation
- Utilisation des ressources

## 🔄 Patterns implémentés

### 1. **Template Method Pattern**
- `BaseSaga` définit la structure
- Chaque saga implémente `execute()`

### 2. **Strategy Pattern**
- Différentes stratégies pour différents événements
- Injection de dépendances pour la flexibilité

### 3. **Command Pattern**
- Chaque saga est une commande exécutable
- Interface uniforme `execute(event)`

### 4. **Observer Pattern**
- Event handlers observent les événements
- Déclenchement automatique des sagas

## 🚧 Prochaines améliorations

1. **Saga Orchestrator** : Coordination de sagas complexes
2. **Saga State Machine** : Gestion des états des processus
3. **Saga Monitoring** : Dashboard de suivi des sagas
4. **Saga Testing Framework** : Tests d'intégration des sagas
5. **Saga Versioning** : Gestion des versions des processus métier

## 📚 Ressources

- [Saga Pattern - Microservices.io](https://microservices.io/patterns/data/saga.html)
- [Event Sourcing - Martin Fowler](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
