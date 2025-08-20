#!/bin/bash

# Script de démarrage pour l'application de gestion de rendez-vous
# Ce script démarre MongoDB et l'application NestJS

echo "🚀 Démarrage de l'application de gestion de rendez-vous"
echo "====================================================="

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour vérifier si Docker est installé
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker n'est pas installé. Veuillez installer Docker d'abord.${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker et Docker Compose sont installés${NC}"
}

# Fonction pour démarrer MongoDB
start_mongodb() {
    echo -e "\n${BLUE}📦 Démarrage de MongoDB avec Docker...${NC}"
    
    # Arrêter les conteneurs existants
    docker-compose down
    
    # Démarrer les conteneurs
    docker-compose up -d
    
    # Attendre que MongoDB soit prêt
    echo -e "${YELLOW}⏳ Attente que MongoDB soit prêt...${NC}"
    sleep 10
    
    # Vérifier que MongoDB est accessible
    if docker exec appointment-mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB est prêt${NC}"
    else
        echo -e "${RED}❌ MongoDB n'est pas accessible${NC}"
        exit 1
    fi
}

# Fonction pour générer le client Prisma
generate_prisma() {
    echo -e "\n${BLUE}🔧 Génération du client Prisma...${NC}"
    npx prisma generate
    echo -e "${GREEN}✅ Client Prisma généré${NC}"
}

# Fonction pour démarrer l'application NestJS
start_nestjs() {
    echo -e "\n${BLUE}🚀 Démarrage de l'application NestJS...${NC}"
    echo -e "${YELLOW}L'application sera disponible sur: http://localhost:3000${NC}"
    echo -e "${YELLOW}Mongo Express sera disponible sur: http://localhost:8081${NC}"
    echo -e "${YELLOW}Utilisez Ctrl+C pour arrêter l'application${NC}"
    echo -e "\n${GREEN}🎉 Application démarrée avec succès !${NC}"
    
    # Démarrer l'application en mode développement
    npm run start:dev
}

# Fonction pour nettoyer
cleanup() {
    echo -e "\n${YELLOW}🛑 Arrêt des conteneurs Docker...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
}

# Gestionnaire de signal pour nettoyer lors de l'arrêt
trap cleanup SIGINT SIGTERM

# Exécution principale
main() {
    check_docker
    start_mongodb
    generate_prisma
    start_nestjs
}

# Démarrer l'application
main
