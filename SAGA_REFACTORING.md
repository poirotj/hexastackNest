# 🔄 Refactoring de la Saga - Séparation des Responsabilités

## 🎯 Problème identifié

Le fichier `appointment-saga.ts` contenait **trop de responsabilités** :
- Interfaces des services externes
- Logique de saga
- Event handlers NestJS CQRS
- Tokens d'injection

Cela violait le **principe de responsabilité unique** et rendait le code difficile à maintenir.

## ✅ Solution implémentée

### 1. **Interfaces des services externes** → `domain/services/external-services.interface.ts`
```typescript
// Interfaces pures du domaine
export interface INotificationService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
}

export interface ICalendarService {
  addEvent(doctorId: string, appointment: any): Promise<void>;
  // ...
}
```

**Pourquoi dans le domaine ?**
- Ces interfaces définissent des **contrats métier**
- Elles sont utilisées par la couche application
- Aucune dépendance infrastructure

### 2. **Saga principale** → `application/sagas/appointment-saga.ts`
```typescript
@Injectable()
export class AppointmentSaga {
  // Logique métier pure
  async handleAppointmentCreated(event: AppointmentCreatedEvent): Promise<void> {
    // Orchestration des services externes
  }
}
```

**Pourquoi dans l'application ?**
- Orchestre les processus métier complexes
- Utilise les interfaces du domaine
- Aucune dépendance infrastructure

### 3. **Event handlers** → `infrastructure/event-handlers/saga-event-handlers.ts`
```typescript
@EventsHandler(AppointmentCreatedEvent)
export class AppointmentCreatedSagaHandler implements IEventHandler<AppointmentCreatedEvent> {
  // Déclenche la saga en réponse aux événements
}
```

**Pourquoi dans l'infrastructure ?**
- Dépend de NestJS CQRS (`@EventsHandler`)
- Couplage avec le framework
- Responsabilité technique

## 🏗️ Nouvelle architecture

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
│ appointment-saga.ts                                        │
│ - AppointmentSaga (logique métier pure)                   │
│ - Orchestration des processus                              │
│ - Gestion des compensations                                │
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
│ - MockNotificationService                                   │
│ - MockCalendarService                                       │
│ - MockPatientService                                        │
│ - MockDoctorService                                         │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Avantages du refactoring

### 1. **Séparation des responsabilités**
- Chaque fichier a une seule responsabilité
- Code plus facile à comprendre et maintenir

### 2. **Respect de l'architecture hexagonale**
- **Domaine** : Interfaces pures, aucune dépendance
- **Application** : Logique métier, dépend du domaine
- **Infrastructure** : Implémentations techniques

### 3. **Facilité de test**
- Interfaces du domaine testables indépendamment
- Saga testable avec des mocks
- Event handlers testables séparément

### 4. **Maintenabilité**
- Modifications localisées
- Réutilisabilité des composants
- Évolution indépendante

## 📁 Structure des fichiers

```
src/
├── domain/
│   └── services/
│       └── external-services.interface.ts  ← Interfaces pures
├── application/
│   └── sagas/
│       └── appointment-saga.ts             ← Logique métier
└── infrastructure/
    ├── event-handlers/
    │   └── saga-event-handlers.ts          ← Event handlers
    └── services/
        └── mock-services.ts                 ← Implémentations
```

## 🎯 Principes respectés

### ✅ **Single Responsibility Principle (SRP)**
- Chaque fichier a une seule responsabilité

### ✅ **Dependency Inversion Principle (DIP)**
- Les couches hautes ne dépendent pas des couches basses
- Les abstractions ne dépendent pas des détails

### ✅ **Interface Segregation Principle (ISP)**
- Interfaces spécifiques et cohérentes

### ✅ **Open/Closed Principle (OCP)**
- Ouvert à l'extension, fermé à la modification

## 🚀 Prochaines améliorations possibles

1. **Types plus stricts** pour les paramètres des services
2. **Validation** des données d'entrée
3. **Gestion d'erreurs** plus robuste
4. **Tests unitaires** pour chaque composant
5. **Monitoring** des performances des sagas

## 📚 Ressources

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
