# 📋 Plan d'Implémentation : Gestion des Clients et des Contrats

## État Actuel ✅
- ✅ Entités TypeORM créées (Client, Contract, Intervention, Site)
- ✅ Services métier implémentés (ClientsService, ContractsService, InterventionsService)
- ✅ Contrôleurs API créés
- ✅ DTOs avec validation créés
- ✅ Pages React créées (ClientsPage, ContractsPage)
- ✅ Backend en cours d'exécution sur http://localhost:3000
- ✅ Frontend en cours d'exécution sur http://localhost:5174

---

## 🔧 Étapes d'Implémentation

### **PHASE 1 : Compléter le Backend (15 étapes)**

#### 1️⃣ **Types et Énumérés**
```typescript
// ✓ VÉRIFIÉ : src/shared/types/client.types.ts
// ✓ VÉRIFIÉ : src/shared/types/contract.types.ts
// ✓ VÉRIFIÉ : src/shared/types/intervention.types.ts
```

#### 2️⃣ **Modules NestJS**
- ✓ ClientsModule
- ✓ ContractsModule
- ✓ InterventionsModule
- ✓ SitesModule (dépendance)

#### 3️⃣ **Services Métier**
- ✓ ClientsService (create, read, update, delete, search, batch)
- ✓ ContractsService (CRUD, linkedToClient, recurringSchedule)
- ✓ InterventionsService (CRUD, assignAgents, trackStatus)

#### 4️⃣ **Contrôleurs API**
```
POST   /api/clients                    → Créer un client
GET    /api/clients                    → Liste avec pagination
GET    /api/clients/:id                → Détail d'un client
PATCH  /api/clients/:id                → Mettre à jour
DELETE /api/clients/:id                → Supprimer (soft delete)
POST   /api/clients/batch              → Création en masse

POST   /api/contracts                  → Créer un contrat
GET    /api/contracts                  → Liste avec filtres
GET    /api/contracts/:id              → Détail
PATCH  /api/contracts/:id              → Mise à jour
DELETE /api/contracts/:id              → Suppression

GET    /api/clients/:clientId/contracts        → Contrats d'un client
GET    /api/clients/:clientId/interventions    → Interventions d'un client
```

#### 5️⃣ **Validations et Gardes**
- ✓ ClientCode uniqueness (AUTO-GÉNÉRÉ)
- ✓ Email uniqueness
- ✓ Status transitions (PROSPECT → ACTIVE → SUSPENDED → ARCHIVED)
- ✓ Contract dates validation (startDate < endDate)
- ✓ Role-based access (Admin, Supervisor, Client)

---

### **PHASE 2 : Frontend React (20 étapes)**

#### 📄 **Pages Principales**

**1. ClientsPage** (Listing + Actions)
```
Components:
- ClientsTable (tableau avec pagination, tri, recherche)
- ClientFilters (filtrer par statut, type, etc.)
- CreateClientButton
- BulkActions (actions en masse)
```

**2. ClientDetailPage** (Détail complet d'un client)
```
Sections:
- Informations de base
- Historique des interactions
- Contrats associés
- Interventions réalisées
- Satisfaction client
- Réclamations/Feedback
```

**3. CreateClientPage** (Formulaire création)
```
Champs:
- Type (Particulier/Entreprise/Multi-sites)
- Nom
- Email / Téléphone
- Adresse complète
- Contact principal
- Notes
- Validation en temps réel
```

**4. EditClientPage** (Modification client)

**5. ContractsPage** (Listing contrats)
```
Components:
- ContractTable
- ContractFilters (par statut, type, client)
- CreateContractButton
```

**6. ContractDetailPage** (Détail contrat)
```
Sections:
- Infos contrat (dates, type, fréquence)
- Pricing & Scope
- Interventions prévues
- Historique modifications
```

**7. CreateContractPage** (Formulaire création)
```
Champs:
- Client (select)
- Site (select dynamique)
- Type (Permanent/Ponctuel)
- Fréquence (si permanent)
- Dates (start/end)
- Pricing
- Service scope
```

#### 🎨 **Composants Réutilisables**

```typescript
<ClientForm /> 
  ↓ Create/Edit
<ContractForm />
  ↓ Create/Edit
<ClientTable />
  ↓ List avec actions
<ContractTable />
  ↓ List avec actions
<StatusBadge />
  ↓ Afficher statut coloré
<ClientSelector />
  ↓ Dropdown pour sélectionner un client
<SiteSelector />
  ↓ Dropdown filtré par client
<ContractLinkedData />
  ↓ Afficher contrats/interventions liés
<SatisfactionScore />
  ↓ Afficher score satisfaction
<FeedbackWidget />
  ↓ Widget pour feedback/réclamations
```

#### 🔄 **Gestion d'État (Context/Store)**

```typescript
// contexts/ClientContext.tsx
interface ClientContextType {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  
  // Actions
  fetchClients(filters): Promise<void>;
  fetchClientById(id): Promise<void>;
  createClient(data): Promise<Client>;
  updateClient(id, data): Promise<Client>;
  deleteClient(id): Promise<void>;
  searchClients(query): Promise<void>;
}

// contexts/ContractContext.tsx (similaire)
```

#### 📡 **Services API (API Client)**

```typescript
// services/api/clientsApi.ts
export const clientsApi = {
  list(params): Promise<PagedResponse<Client>>,
  getById(id): Promise<Client>,
  create(data): Promise<Client>,
  update(id, data): Promise<Client>,
  delete(id): Promise<void>,
  search(query): Promise<Client[]>,
  getContracts(clientId): Promise<Contract[]>,
  getInterventions(clientId): Promise<Intervention[]>,
};

// services/api/contractsApi.ts
export const contractsApi = {
  list(params): Promise<PagedResponse<Contract>>,
  getById(id): Promise<Contract>,
  create(data): Promise<Contract>,
  update(id, data): Promise<Contract>,
  delete(id): Promise<void>,
  getByClient(clientId): Promise<Contract[]>,
};
```

#### 🌍 **Internationalisation (i18n)**

```json
{
  "clients": {
    "title": "Gestion des Clients",
    "subtitle": "Gérez vos clients (particuliers, entreprises, multi-sites)",
    "create": "Créer un client",
    "edit": "Modifier le client",
    "delete": "Supprimer le client",
    "search": "Rechercher un client",
    "status": {
      "prospect": "Prospect",
      "active": "Actif",
      "suspended": "Suspendu",
      "archived": "Archivé"
    },
    "type": {
      "individual": "Particulier",
      "company": "Entreprise",
      "multisite": "Multi-sites"
    }
  },
  "contracts": {
    "title": "Gestion des Contrats",
    "subtitle": "Contrats permanents et interventions ponctuelles",
    "create": "Créer un contrat",
    "type": {
      "permanent": "Contrat permanent",
      "ad_hoc": "Intervention ponctuelle"
    },
    "frequency": {
      "daily": "Quotidien",
      "weekly": "Hebdomadaire",
      "biweekly": "Bi-hebdomadaire",
      "monthly": "Mensuel"
    }
  }
}
```

---

### **PHASE 3 : Tests (10 étapes)**

#### Backend Tests
```bash
npm run test:db          # Tests base de données
npm run test:api         # Tests endpoints API
npm run test:validation  # Tests validation DTOs
npm run test:all         # Tous les tests
```

#### Frontend Tests
```bash
npm run test             # Tests composants React
npm run e2e              # Tests end-to-end
```

---

### **PHASE 4 : Intégration Base de Données (5 étapes)**

#### Migrations TypeORM
```bash
# Tables déjà créées (via entités TypeORM)
# Mais vérifier les relations et contraintes
```

#### Seed Data
```bash
npm run db:seed          # Charger données initiales (admin user)
```

---

## 🎯 Priorité d'Implémentation

### **MVP (Minimum Viable Product)**
1. ✅ Backend API complète pour Clients
2. ✅ Backend API complète pour Contrats
3. ✅ Frontend Pages Clients (list + CRUD)
4. ✅ Frontend Pages Contrats (list + CRUD)
5. ✅ Intégration API Frontend

### **Phase 2 (Améliorations)**
6. Historique des interactions
7. Enquêtes de satisfaction
8. Portail réclamations
9. Tableaux de bord analytiques
10. Notifications

---

## 📊 Checklist d'Implémentation

### Backend Clients
- [ ] Types/Enums complétés
- [ ] ClientsService complète
- [ ] ClientsController complète
- [ ] DTOs avec validations
- [ ] Tests unitaires
- [ ] Tests intégration API

### Backend Contrats
- [ ] ContractsService complète
- [ ] ContractsController complète
- [ ] Liaison Client-Contract
- [ ] DTOs avec validations
- [ ] Tests

### Frontend Clients
- [ ] Page liste avec tableau
- [ ] Page détail
- [ ] Page création/édition
- [ ] Formulaires avec validation
- [ ] Intégration API
- [ ] i18n français

### Frontend Contrats
- [ ] Page liste
- [ ] Page détail
- [ ] Page création (avec sélecteur client/site)
- [ ] Filtres
- [ ] Intégration API

---

## 🚀 Commandes Útiles

```bash
# Backend - Développement
cd backend
npm run start:dev       # Serveur avec watch

# Tests
npm run test:db
npm run test:api

# Frontend - Développement
cd frontend
npm run dev             # Serveur avec HMR

# Build production
npm run build
```

---

## 📝 Notes Importantes

1. **Bases déjà créées** : Les entités, modules et services existent mais peuvent nécessiter des améliorations
2. **API RESTful** : Respecter les conventions REST (GET, POST, PATCH, DELETE)
3. **Pagination** : Implémenter skip/limit pour les listes
4. **Soft Delete** : Les entités ont `deletedAt` pour suppressions logiques
5. **UUID** : Tous les IDs utilisent UUID (pas d'auto-increment)
6. **Timestamps** : `createdAt`, `updatedAt` auto-gérés
7. **Validations** : Utiliser class-validator dans DTOs
8. **Rôles** : Admin > Supervisor > Agent (vérifier permissions)

---

## 🔗 Fichiers Clés

```
Backend:
├── src/modules/clients/
│   ├── clients.service.ts
│   ├── clients.controller.ts
│   ├── dto/
│   └── entities/client.entity.ts
├── src/modules/contracts/
├── src/modules/interventions/
└── src/shared/types/

Frontend:
├── src/pages/clients/
├── src/pages/contracts/
├── src/services/api/
├── src/contexts/
└── src/i18n/locales/
```

---

## ✨ Prochaines Étapes Recommandées

1. **Vérifier le backend** : S'assurer que tous les endpoints API fonctionnent
2. **Tester les endpoints** : Utiliser Postman/Insomnia
3. **Implémenter les pages frontend** : Commencer par ClientsPage
4. **Connecter l'API** : Intégrer avec les services API
5. **Tester l'intégration** : Tests bout à bout

---

Êtes-vous prêt à commencer avec une étape spécifique ? 🚀
