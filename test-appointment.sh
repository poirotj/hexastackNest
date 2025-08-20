#!/bin/bash

# Script de test pour l'API de gestion de rendez-vous
# Assurez-vous que l'application est démarrée sur le port 3000

echo "🧪 Test de l'API de gestion de rendez-vous"
echo "=========================================="

# URL de base
BASE_URL="http://localhost:3000"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Créer un rendez-vous
echo -e "\n${YELLOW}1. Création d'un rendez-vous${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/appointments" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Consultation cardiologie",
    "description": "Contrôle annuel",
    "startDate": "2024-01-15T10:00:00Z",
    "endDate": "2024-01-15T11:00:00Z",
    "patientId": "patient123",
    "doctorId": "doctor456"
  }')

echo "Réponse: $CREATE_RESPONSE"
print_result $? "Création du rendez-vous"

# Extraire l'ID du rendez-vous créé (si disponible)
APPOINTMENT_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
if [ -z "$APPOINTMENT_ID" ]; then
    APPOINTMENT_ID="test-appointment-id"
fi

# Test 2: Récupérer tous les rendez-vous
echo -e "\n${YELLOW}2. Récupération de tous les rendez-vous${NC}"
GET_ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/appointments")
echo "Réponse: $GET_ALL_RESPONSE"
print_result $? "Récupération de tous les rendez-vous"

# Test 3: Récupérer les rendez-vous d'un patient
echo -e "\n${YELLOW}3. Récupération des rendez-vous d'un patient${NC}"
GET_PATIENT_RESPONSE=$(curl -s -X GET "$BASE_URL/appointments?patientId=patient123")
echo "Réponse: $GET_PATIENT_RESPONSE"
print_result $? "Récupération des rendez-vous du patient"

# Test 4: Récupérer les rendez-vous d'un médecin
echo -e "\n${YELLOW}4. Récupération des rendez-vous d'un médecin${NC}"
GET_DOCTOR_RESPONSE=$(curl -s -X GET "$BASE_URL/appointments?doctorId=doctor456")
echo "Réponse: $GET_DOCTOR_RESPONSE"
print_result $? "Récupération des rendez-vous du médecin"

# Test 5: Confirmer un rendez-vous
echo -e "\n${YELLOW}5. Confirmation d'un rendez-vous${NC}"
CONFIRM_RESPONSE=$(curl -s -X PUT "$BASE_URL/appointments/$APPOINTMENT_ID/confirm")
echo "Réponse: $CONFIRM_RESPONSE"
print_result $? "Confirmation du rendez-vous"

# Test 6: Annuler un rendez-vous
echo -e "\n${YELLOW}6. Annulation d'un rendez-vous${NC}"
CANCEL_RESPONSE=$(curl -s -X PUT "$BASE_URL/appointments/$APPOINTMENT_ID/cancel")
echo "Réponse: $CANCEL_RESPONSE"
print_result $? "Annulation du rendez-vous"

echo -e "\n${GREEN}🎉 Tests terminés !${NC}"
echo -e "\n${YELLOW}Note:${NC} Assurez-vous que MongoDB est démarré et que l'application NestJS est en cours d'exécution sur le port 3000"
echo -e "Pour démarrer l'application: ${YELLOW}npm run start:dev${NC}"
