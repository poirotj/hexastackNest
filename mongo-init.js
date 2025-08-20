// Script d'initialisation MongoDB
// Ce script s'exécute automatiquement lors du premier démarrage du conteneur

print('Initialisation de la base de données appointment_db...');

// Utiliser la base de données appointment_db
db = db.getSiblingDB('appointment_db');

// Créer les collections nécessaires
db.createCollection('event_store');
db.createCollection('appointments');
db.createCollection('appointment_read_models');

// Créer des index pour optimiser les performances
db.event_store.createIndex({ "aggregateId": 1 });
db.event_store.createIndex({ "eventType": 1 });
db.event_store.createIndex({ "timestamp": 1 });

db.appointments.createIndex({ "patientId": 1 });
db.appointments.createIndex({ "doctorId": 1 });
db.appointments.createIndex({ "startDate": 1 });

db.appointment_read_models.createIndex({ "appointmentId": 1 }, { unique: true });
db.appointment_read_models.createIndex({ "patientId": 1 });
db.appointment_read_models.createIndex({ "doctorId": 1 });
db.appointment_read_models.createIndex({ "status": 1 });

print('Base de données appointment_db initialisée avec succès !');
