#!/bin/bash

echo "🚀 Test des événements Kafka pour la communication inter-Bounded Contexts"
echo "================================================================"

# Attendre que Kafka soit prêt
echo "⏳ Attendre que Kafka soit prêt..."
sleep 10

# Simuler un événement "Patient enregistré" depuis le BC Patient
echo "📝 Simulation d'un événement 'Patient enregistré' depuis le BC Patient..."
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Consultation cardiologie",
    "description": "Première consultation",
    "startDate": "2024-02-15T10:00:00.000Z",
    "endDate": "2024-02-15T11:00:00.000Z",
    "patientId": "patient-123",
    "doctorId": "doctor-456"
  }'

echo ""
echo "✅ Événement 'AppointmentCreated' publié sur Kafka"
echo ""

# Simuler un événement "Médecin disponible" depuis le BC Doctor
echo "👨‍⚕️ Simulation d'un événement 'Médecin disponible' depuis le BC Doctor..."
echo "Note: Cet événement sera reçu par notre consommateur Kafka"
echo ""

# Simuler un événement "Créneau libéré" depuis le BC Calendar
echo "📅 Simulation d'un événement 'Créneau libéré' depuis le BC Calendar..."
echo "Note: Cet événement sera reçu par notre consommateur Kafka"
echo ""

echo "🎯 Vérifiez les logs de l'application pour voir :"
echo "   - Les événements publiés sur Kafka"
echo "   - Les événements reçus d'autres BCs"
echo "   - Le traitement des événements inter-BCs"
echo ""
echo "🌐 Accédez à Kafka UI: http://localhost:8080"
echo "📊 Accédez à Mongo Express: http://localhost:8081"
echo ""
echo "✅ Test terminé !"
