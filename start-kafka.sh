#!/bin/bash

echo "🚀 Démarrage de Kafka et Zookeeper..."

# Démarrer Kafka
docker-compose -f docker-compose.kafka.yml up -d

echo "⏳ Attente du démarrage de Kafka..."
sleep 30

echo "✅ Kafka est prêt !"
echo "📊 Interface Kafka UI disponible sur: http://localhost:8080"
echo "🔌 Broker Kafka disponible sur: localhost:9092"
echo "🦒 Zookeeper disponible sur: localhost:2181"

# Afficher les logs pour vérifier que tout fonctionne
echo "📋 Logs des services:"
docker-compose -f docker-compose.kafka.yml logs --tail=20
