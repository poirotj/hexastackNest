#!/bin/bash

echo "🚀 Démarrage de l'application NestJS avec Kafka pour la communication inter-BCs"
echo "=========================================================================="

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Démarrer MongoDB et Kafka
echo "🐳 Démarrage de MongoDB et Kafka..."
docker-compose up -d mongodb mongo-express zookeeper kafka kafka-ui

# Attendre que Kafka soit prêt
echo "⏳ Attendre que Kafka soit prêt..."
sleep 30

# Vérifier que Kafka est prêt
echo "🔍 Vérification du statut de Kafka..."
docker-compose logs kafka | grep "started"

# Démarrer l'application NestJS
echo "⚡ Démarrage de l'application NestJS..."
cd apps/hexagonal-app
npm run start:dev &

# Attendre que l'application soit prête
echo "⏳ Attendre que l'application soit prête..."
sleep 15

echo ""
echo "🎉 Application démarrée avec succès !"
echo ""
echo "🌐 Services disponibles :"
echo "   - Application NestJS: http://localhost:3000"
echo "   - Kafka UI: http://localhost:8080"
echo "   - Mongo Express: http://localhost:8081"
echo ""
echo "📚 Documentation API: http://localhost:3000/api"
echo ""
echo "🧪 Pour tester la communication Kafka :"
echo "   ./test-kafka-events.sh"
echo ""
echo "✅ Démarrage terminé !"
