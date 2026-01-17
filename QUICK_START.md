# ⚡ QUICK START - Gestion Clients & Contrats

## 🎯 Objectif Rapide (15 minutes)

Obtenir une **page clients fonctionnelle** avec appels API réels au backend.

---

## 📋 Prérequis

```bash
# Vérifier que les serveurs tournent
# Terminal 1 - Backend (port 3000)
cd backend && npm run start:dev

# Terminal 2 - Frontend (port 5174)
cd frontend && npm run dev
```

✅ Vous devriez voir:
- Backend: `[11:XX:XX] Found 0 errors. Watching for file changes.`
- Frontend: `VITE v6.4.1 ready in 989 ms`

---

## 🚀 Étapes 1-5 (Déjà Faites ✅)

### ✅ 1. Entités Backend
```
✅ Client.entity.ts
✅ Contract.entity.ts
✅ Intervention.entity.ts
✅ Site.entity.ts
```

### ✅ 2. Services & Contrôleurs
```
✅ ClientsService + ClientsController
✅ ContractsService + ContractsController
✅ InterventionsService + InterventionsController
✅ SitesService + SitesController
```

### ✅ 3. Services API Frontend
```
✅ src/services/api/clientsApi.ts
✅ src/services/api/contractsApi.ts
✅ src/services/api/interventionsApi.ts
✅ src/services/api/sitesApi.ts
✅ src/services/api/axios-instance.ts
```

### ✅ 4. Page ClientsPage
```
✅ src/pages/clients/ClientsPage.tsx (avec React Query)
```

### ✅ 5. Documentation
```
✅ CLIENTS_CONTRACTS_SETUP.md
✅ API_USAGE_GUIDE.md
✅ IMPLEMENTATION_PLAN.md
```

---

## 🧪 Étape 6 : Tester l'API Complètement

### Lancer le test API script
```bash
cd backend
npx ts-node test-nettoyage-plus-api.ts
```

**Output Attendu:**
```
═══════════════════════════════════════════════
🚀 NETTOYAGE PLUS API TEST SUITE
📍 Base URL: http://localhost:3000/api
═══════════════════════════════════════════════

🔐 Authenticating...
✅ Authentication successful

📋 ============ CLIENTS ENDPOINTS ============

🧪 Create a new client
   POST /clients
   ✅ PASSED (201)
   💾 Saved clientId: 550e8400-e29b-41d4-a716-446655440000

🧪 Get all clients (paginated)
   GET /clients?page=1&limit=10
   ✅ PASSED (200)

... (suite des tests)

📊 TEST SUMMARY
═══════════════════════════════════════════════
✅ Passed: 18/18
Success Rate: 100.00%
═══════════════════════════════════════════════
```

---

## 🎨 Étape 7 : Tester la Page Frontend

### Naviguez vers http://localhost:5174/clients

Vous devriez voir:
```
┌─────────────────────────────────────────┐
│ Gestion des Clients                      │
│ Gérez vos clients...                    │ [+ Créer]
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔍 Rechercher...    [≡ Filtres]         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Acme Corporation              [ACTIVE]  │
│ 📧 contact@acme.tn                      │
│ 📱 +216 70 123 456                      │
│ 📍 Tunis                         [>]    │
└─────────────────────────────────────────┘

│ Showing 1-1 of 1  [← Prev] [Next →]    │
```

### Si pas de données:
1. Créer un client via le test script
2. Rafraîchir la page (F5)
3. Les données doivent s'afficher

---

## 📝 Étape 8 : Créer une Page Détail Client (NEXT)

Créer le fichier: `src/pages/clients/ClientDetailPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientsApi, contractsApi } from '@/services/api';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  // Charger le client
  const { data: client, isLoading } = useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getById(id!),
    enabled: !!id,
  });

  // Charger ses contrats
  const { data: contracts } = useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contractsApi.getByClient(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!client) return <div>Client non trouvé</div>;

  return (
    <div className="space-y-6">
      {/* Infos client */}
      <div className="bg-white p-6 rounded-lg">
        <h1>{client.name}</h1>
        <p>Email: {client.email}</p>
        <p>Téléphone: {client.phone}</p>
        <p>Adresse: {client.address}, {client.city}</p>
      </div>

      {/* Contrats */}
      <div className="bg-white p-6 rounded-lg">
        <h2>Contrats ({contracts?.length || 0})</h2>
        {contracts?.map(c => (
          <div key={c.id} className="border-t pt-4">
            <h3>{c.contractCode}</h3>
            <p>Type: {c.type}</p>
            <p>Statut: {c.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔗 Étape 9 : Ajouter le Routing

Modifier: `src/App.tsx`

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ClientsPage from '@/pages/clients/ClientsPage';
import ClientDetailPage from '@/pages/clients/ClientDetailPage';

const router = createBrowserRouter([
  {
    path: '/clients',
    element: <ClientsPage />,
  },
  {
    path: '/clients/:id',
    element: <ClientDetailPage />,
  },
  // ... autres routes
]);

export function App() {
  return <RouterProvider router={router} />;
}
```

---

## 📊 État Actuel du Projet

| Composant | Backend | Frontend | Tests |
|-----------|---------|----------|-------|
| Clients   | ✅ 100% | 🟡 50%  | ✅    |
| Contrats  | ✅ 100% | 🟡 20%  | ✅    |
| Interventions | ✅ 100% | 🟡 10% | ✅ |
| Sites     | ✅ 100% | 🟡 10%  | ✅    |

### À Faire Frontend (Estimé 2-3 jours)
- [ ] ClientDetailPage (1h)
- [ ] ClientFormPage (2h)
- [ ] ContractsPage (1.5h)
- [ ] ContractDetailPage (1.5h)
- [ ] ContractFormPage (2h)
- [ ] Composants réutilisables (1.5h)
- [ ] Tests & Validation (2h)

---

## 💡 Tips pour Accélérer

### 1. Utiliser React Query pour caching
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['clients', page],
  queryFn: () => clientsApi.list({ page }),
  staleTime: 5 * 60 * 1000, // Cache 5 min
});
```

### 2. Créer des composants petits et réutilisables
```tsx
// ✅ BON
<ClientCard client={client} onClick={onSelect} />

// ❌ MAUVAIS
<div>Tout le rendu en une seule fonction</div>
```

### 3. Utiliser les types TypeScript
```tsx
// ✅ BON
interface ClientProps {
  client: Client;
  onDelete: (id: string) => Promise<void>;
}

// ❌ MAUVAIS
function ClientCard(props: any) { ... }
```

### 4. Toujours gérer les états
```tsx
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
return <Content data={data} />;
```

---

## 🐛 Débogage

### Backend
```bash
# Voir les logs
cd backend && npm run start:dev

# Chercher les erreurs
# Vérifier: src/modules/clients/clients.service.ts
```

### Frontend
```bash
# Console du navigateur (F12)
# Onglet Network pour voir les appels API
# Onglet Console pour les erreurs

# Ou utiliser React Query DevTools
npm install @tanstack/react-query-devtools
```

### Test API
```bash
# Lancer les tests
cd backend && npx ts-node test-nettoyage-plus-api.ts

# Voir le résumé
cat test-results.json | jq '.summary'
```

---

## 🎯 Checkpoint - Valider

### Backend ✅
- [ ] `npm run start:dev` → 0 erreurs
- [ ] `npx ts-node test-nettoyage-plus-api.ts` → 100% passing
- [ ] Créer un client via API → OK

### Frontend ✅
- [ ] `npm run dev` → Ready
- [ ] Aller à http://localhost:5174/clients → Page s'affiche
- [ ] Voir une liste de clients → OK (ou message "Pas de données")

---

## 📚 Prochains Documents à Lire

1. **CLIENTS_CONTRACTS_SETUP.md** - Vue d'ensemble complète
2. **API_USAGE_GUIDE.md** - Comment utiliser chaque endpoint
3. **IMPLEMENTATION_PLAN.md** - Roadmap complète

---

## ⏰ Temps Estimé

| Tâche | Temps |
|-------|-------|
| Lire ce document | 5 min |
| Tester API backend | 5 min |
| Vérifier page frontend | 3 min |
| **Total** | **13 min** |

---

## 🚀 Prochaine Action

**Créer ClientDetailPage** (15-20 minutes)

```bash
# Suivre le template donné plus haut
vim src/pages/clients/ClientDetailPage.tsx

# Puis ajouter la route
vim src/App.tsx
```

Après: Page détail client fonctionnelle + Affichage contrats!

---

**Bonne chance! 🎉**  
**Questions? Voir API_USAGE_GUIDE.md ou CLIENTS_CONTRACTS_SETUP.md**
