# 📡 Guide d'Utilisation des APIs Nettoyage Plus

## 🔐 1. Authentication (Obligatoire)

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nettoyageplus.tn",
    "password": "admin@123456"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid...",
    "email": "admin@nettoyageplus.tn",
    "firstName": "Admin",
    "role": "SUPER_ADMIN"
  }
}
```

Sauvegardez le `access_token` pour les requêtes suivantes.

---

## 👥 2. CLIENTS API

### Créer un client
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "type": "COMPANY",
    "email": "contact@acme.tn",
    "phone": "+216 70 123 456",
    "address": "123 Rue de la République",
    "city": "Tunis",
    "postalCode": "1002",
    "country": "Tunisia",
    "contactPerson": "Ahmed Ben Ali",
    "contactPhone": "+216 98 765 432",
    "notes": "Grand client, site multiples",
    "status": "PROSPECT"
  }'
```

### Lister tous les clients (avec pagination)
```bash
curl -X GET "http://localhost:3000/api/clients?page=1&limit=10&status=ACTIVE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Obtenir un client par ID
```bash
curl -X GET http://localhost:3000/api/clients/{CLIENT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mettre à jour un client
```bash
curl -X PATCH http://localhost:3000/api/clients/{CLIENT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE",
    "notes": "Statut changé à actif"
  }'
```

### Rechercher des clients
```bash
curl -X GET "http://localhost:3000/api/clients?search=Acme" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Supprimer un client (soft delete)
```bash
curl -X DELETE http://localhost:3000/api/clients/{CLIENT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Créer plusieurs clients (batch)
```bash
curl -X POST http://localhost:3000/api/clients/batch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clients": [
      {
        "name": "Client 1",
        "type": "INDIVIDUAL",
        "email": "client1@example.tn",
        "status": "PROSPECT"
      },
      {
        "name": "Client 2",
        "type": "COMPANY",
        "email": "client2@example.tn",
        "status": "ACTIVE"
      }
    ]
  }'
```

---

## 📍 3. SITES API

### Créer un site
```bash
curl -X POST http://localhost:3000/api/sites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bureau Principal - Tunis",
    "address": "456 Avenue Bourguiba",
    "city": "Tunis",
    "postalCode": "1000",
    "country": "Tunisia",
    "notes": "Bâtiment 5 étages"
  }'
```

### Lister tous les sites
```bash
curl -X GET "http://localhost:3000/api/sites?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Obtenir un site par ID
```bash
curl -X GET http://localhost:3000/api/sites/{SITE_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📄 4. CONTRACTS API

### Créer un contrat
```bash
curl -X POST http://localhost:3000/api/contracts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "{CLIENT_ID}",
    "siteId": "{SITE_ID}",
    "type": "PERMANENT",
    "frequency": "WEEKLY",
    "startDate": "2026-01-20",
    "endDate": "2027-01-20",
    "status": "DRAFT",
    "pricing": {
      "basePrice": 2500,
      "currency": "TND"
    },
    "serviceScope": {
      "areas": "Bureaux, escaliers, toilettes",
      "frequency": "Hebdomadaire (lundi-samedi)",
      "notes": "Nettoyage complet bureaux"
    },
    "notes": "Contrat avec clause de confidentialité"
  }'
```

### Lister tous les contrats
```bash
curl -X GET "http://localhost:3000/api/contracts?page=1&limit=10&status=ACTIVE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Lister les contrats d'un client
```bash
curl -X GET "http://localhost:3000/api/contracts?clientId={CLIENT_ID}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Obtenir un contrat par ID
```bash
curl -X GET http://localhost:3000/api/contracts/{CONTRACT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mettre à jour un contrat
```bash
curl -X PATCH http://localhost:3000/api/contracts/{CONTRACT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE",
    "pricing": {
      "basePrice": 2700,
      "currency": "TND"
    }
  }'
```

### Supprimer un contrat
```bash
curl -X DELETE http://localhost:3000/api/contracts/{CONTRACT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 5. INTERVENTIONS API

### Créer une intervention
```bash
curl -X POST http://localhost:3000/api/interventions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contractId": "{CONTRACT_ID}",
    "siteId": "{SITE_ID}",
    "scheduledDate": "2026-01-22",
    "scheduledStartTime": "08:00:00",
    "scheduledEndTime": "17:00:00",
    "status": "SCHEDULED",
    "notes": "Nettoyage régulier hebdomadaire"
  }'
```

### Lister toutes les interventions
```bash
curl -X GET "http://localhost:3000/api/interventions?page=1&limit=10&status=SCHEDULED" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Obtenir une intervention par ID
```bash
curl -X GET http://localhost:3000/api/interventions/{INTERVENTION_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GPS Check-In (Agent arrive sur site)
```bash
curl -X POST http://localhost:3000/api/interventions/{INTERVENTION_ID}/checkin \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 36.8065,
    "longitude": 10.1963
  }'
```

### GPS Check-Out (Agent quitte le site)
```bash
curl -X POST http://localhost:3000/api/interventions/{INTERVENTION_ID}/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 36.8065,
    "longitude": 10.1963
  }'
```

### Ajouter des photos
```bash
curl -X PATCH http://localhost:3000/api/interventions/{INTERVENTION_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoUrls": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ]
  }'
```

### Mettre à jour le score de qualité
```bash
curl -X PATCH http://localhost:3000/api/interventions/{INTERVENTION_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qualityScore": 4,
    "clientRating": 5,
    "clientFeedback": "Très satisfait du travail!"
  }'
```

---

## 📊 Statuts et Énumérés

### Client Status
- `PROSPECT` - Client potentiel
- `ACTIVE` - Client actif
- `SUSPENDED` - Suspension temporaire
- `ARCHIVED` - Client archivé

### Client Type
- `INDIVIDUAL` - Particulier
- `COMPANY` - Entreprise
- `MULTISITE` - Multi-sites

### Contract Type
- `PERMANENT` - Contrat permanent (récurrent)
- `AD_HOC` - Intervention ponctuelle

### Contract Frequency
- `DAILY` - Quotidien
- `WEEKLY` - Hebdomadaire
- `BIWEEKLY` - Bi-hebdomadaire
- `MONTHLY` - Mensuel

### Contract Status
- `DRAFT` - Brouillon
- `ACTIVE` - Actif
- `PAUSED` - Suspendu
- `COMPLETED` - Complété
- `CANCELLED` - Annulé

### Intervention Status
- `SCHEDULED` - Planifié
- `IN_PROGRESS` - En cours
- `COMPLETED` - Complété
- `CANCELLED` - Annulé
- `POSTPONED` - Reporté

---

## 🔄 Exemple Flux Complet

### 1. Authentification
```bash
# Récupérer token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nettoyageplus.tn","password":"admin@123456"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"
```

### 2. Créer un Client
```bash
CLIENT_ID=$(curl -s -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "type": "COMPANY",
    "email": "acme@example.tn",
    "status": "PROSPECT"
  }' | jq -r '.id')

echo "Client créé: $CLIENT_ID"
```

### 3. Créer un Site
```bash
SITE_ID=$(curl -s -X POST http://localhost:3000/api/sites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme - Bureau Tunis",
    "city": "Tunis"
  }' | jq -r '.id')

echo "Site créé: $SITE_ID"
```

### 4. Créer un Contrat
```bash
CONTRACT_ID=$(curl -s -X POST http://localhost:3000/api/contracts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"clientId\": \"$CLIENT_ID\",
    \"siteId\": \"$SITE_ID\",
    \"type\": \"PERMANENT\",
    \"frequency\": \"WEEKLY\",
    \"startDate\": \"2026-01-20\",
    \"status\": \"DRAFT\"
  }" | jq -r '.id')

echo "Contrat créé: $CONTRACT_ID"
```

### 5. Créer une Intervention
```bash
INTERVENTION_ID=$(curl -s -X POST http://localhost:3000/api/interventions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"contractId\": \"$CONTRACT_ID\",
    \"siteId\": \"$SITE_ID\",
    \"scheduledDate\": \"2026-01-22\",
    \"scheduledStartTime\": \"08:00:00\",
    \"scheduledEndTime\": \"17:00:00\",
    \"status\": \"SCHEDULED\"
  }" | jq -r '.id')

echo "Intervention créée: $INTERVENTION_ID"
```

---

## 🛠️ Outils Recommandés

### Postman (GUI)
- Importer les endpoints
- Tester les routes facilement
- Sauvegarder les requests

### Insomnia (GUI)
- Alternative à Postman
- Plus léger
- Bonne gestion des variables

### HTTPie (CLI)
```bash
http --auth-type=bearer --auth=$TOKEN POST localhost:3000/api/clients
```

### curl avec jq (CLI)
```bash
curl ... | jq '.'  # Pretty print JSON
curl ... | jq '.data[]'  # Accéder à un champ
```

---

## ⚡ Tips & Tricks

### 1. Sauvegarde Token dans Variable Shell
```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
export NETTOYAGE_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nettoyageplus.tn","password":"admin@123456"}' \
  | jq -r '.access_token')
```

Utiliser ensuite:
```bash
curl http://localhost:3000/api/clients \
  -H "Authorization: Bearer $NETTOYAGE_TOKEN"
```

### 2. Réutiliser les IDs
```bash
# Créer et récupérer ID en même temps
ID=$(curl -s ... | jq -r '.id')
```

### 3. Importer dans Postman
Créer une collection Postman avec les endpoints et les importer facilement.

---

**Date**: 17 Janvier 2026  
**Dernière Mise à Jour**: CLIENTS_CONTRACTS_SETUP.md  
**Auteur**: GitHub Copilot  
