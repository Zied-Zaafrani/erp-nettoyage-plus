# 🗓️ Roadmap Détaillée - Prochaines 2 Semaines

## 📅 Semaine 1 (17-21 Janvier 2026)

### Jour 1 (17 Jan) - ✅ COMPLÉTÉ
- [x] Configuration backend + serveurs démarrés
- [x] Fix UserRole enums
- [x] Services API clients implémentés
- [x] ClientsPage avec listing
- [x] Documentation complète

### Jour 2 (18 Jan) - 🎯 À FAIRE DEMAIN

#### Matin (2h)
- [ ] **ClientDetailPage**
  - Afficher infos client
  - Lister contrats clients
  - Lister interventions client
  - Boutons modifier/supprimer

- [ ] **CreateClientPage**
  - Formulaire création
  - Validation (email unique)
  - Navigation après création

#### Après-midi (2h)
- [ ] **EditClientPage**
  - Formulaire modification
  - Pré-remplissage données
  - Validation

- [ ] **Routing React Router**
  - /clients → ClientsPage
  - /clients/create → CreateClientPage
  - /clients/:id → ClientDetailPage
  - /clients/:id/edit → EditClientPage

### Jour 3 (19 Jan) - 🎯 À FAIRE

#### Matin (2.5h)
- [ ] **ContractsPage**
  - Listing contrats (copier structure ClientsPage)
  - Recherche + filtres
  - Pagination
  - Actions (créer, voir détail)

- [ ] **ContractDetailPage**
  - Afficher infos contrat
  - Lister interventions
  - Timeline interventions

#### Après-midi (2.5h)
- [ ] **CreateContractPage**
  - Formulaire création
  - Sélecteur client (dropdown)
  - Sélecteur site (filtré par client)
  - Validation dates

- [ ] **EditContractPage**
  - Similaire CreateContractPage

### Jour 4 (20 Jan) - 🎯 À FAIRE

- [ ] **Composants Réutilisables** (3h)
  - `<ClientForm />` - Formulaire client
  - `<ContractForm />` - Formulaire contrat
  - `<ClientSelector />` - Dropdown clients
  - `<SiteSelector />` - Dropdown sites
  - `<StatusBadge />` - Badge statut coloré
  - `<InterventionTimeline />` - Timeline interventions

- [ ] **UI Améliorations** (2h)
  - Toast notifications (succès/erreur)
  - Modals de confirmation (delete)
  - Loading spinners
  - Error boundaries

### Jour 5 (21 Jan) - 🎯 À FAIRE

- [ ] **Tests & Validation** (3h)
  - Tests unitaires composants
  - Tests d'intégration pages
  - Tests E2E flux complet

- [ ] **Polishing** (2h)
  - Responsive design
  - Accessibilité (a11y)
  - Performance optimization

---

## 📅 Semaine 2 (24-28 Janvier 2026)

### Jour 6 (24 Jan) - 🎯 À FAIRE

#### InterventionsPage
- [ ] Listing interventions (calendrier + tableau)
- [ ] Filtres (date, statut, site)
- [ ] Actions (créer, assigner agents)

#### InterventionDetailPage
- [ ] Afficher infos intervention
- [ ] Assigner agents/équipes
- [ ] GPS tracking
- [ ] Upload photos
- [ ] Checklist management

### Jour 7 (25 Jan) - 🎯 À FAIRE

#### Mobile Features (pour agents)
- [ ] GPS Check-In/Check-Out
- [ ] Photo capture
- [ ] Incident reporting
- [ ] Checklist validation
- [ ] Offline support

### Jour 8 (26 Jan) - 🎯 À FAIRE

#### Dashboard & Analytics
- [ ] Dashboard clients (stats)
- [ ] Dashboard contrats (stats)
- [ ] Dashboard interventions (calendar)
- [ ] Rapports basiques

### Jour 9 (27 Jan) - 🎯 À FAIRE

#### Qualité Client
- [ ] Historique interactions
- [ ] Enquêtes satisfaction
- [ ] Module réclamations
- [ ] Feedback portal

### Jour 10 (28 Jan) - 🎯 À FAIRE

#### Finitions & Production Ready
- [ ] Bug fixes
- [ ] Performance tunning
- [ ] Security audit
- [ ] Production deployment

---

## 🎯 Objectifs de la Semaine 1

### ✅ MVP Frontend Clients
```
├── ✅ ClientsPage (listing)
├── ClientDetailPage (détail + contrats)
├── CreateClientPage (créer)
├── EditClientPage (modifier)
└── Routing complet
```

**État**: SEMAINE 1 = Pages clients 100% fonctionnelles

### 🟡 MVP Frontend Contrats
```
├── ContractsPage (listing)
├── ContractDetailPage (détail)
├── CreateContractPage (créer)
├── EditContractPage (modifier)
└── Routing complet
```

**État**: SEMAINE 1 = Pages contrats 100% fonctionnelles

---

## 🔄 Flow de Développement Quotidien

### Matin (9h-12h)
1. Lancer serveurs
2. Vérifier tests API
3. Coder une page
4. Tester dans navigateur

### Après-midi (14h-17h)
1. Coder formulaires
2. Tests intégration
3. Fixes bugs
4. Documentation

### Soir (17h-18h)
1. Code review auto
2. Commit changes
3. Préparer demain

---

## 📊 Checklist Jour 2 (Demain)

### ClientDetailPage
- [ ] Créer fichier `src/pages/clients/ClientDetailPage.tsx`
- [ ] Charger client via API
- [ ] Afficher infos client
- [ ] Charger contrats client
- [ ] Afficher liste contrats
- [ ] Lien vers contrat detail
- [ ] Bouton modifier
- [ ] Bouton supprimer (avec confirmation)

### CreateClientPage
- [ ] Créer fichier `src/pages/clients/CreateClientPage.tsx`
- [ ] Formulaire avec champs:
  - Type (select)
  - Nom
  - Email (validation)
  - Téléphone
  - Adresse
  - Ville/Code postal
  - Pays
  - Contact personne
  - Notes
- [ ] Validation formule
- [ ] Submit → API
- [ ] Redirect vers detail après création

### EditClientPage
- [ ] Créer fichier `src/pages/clients/EditClientPage.tsx`
- [ ] Charger client
- [ ] Pré-remplir formulaire
- [ ] Même validation que Create
- [ ] Submit → API
- [ ] Toast success/error

### Routing
- [ ] Modifier `src/App.tsx`
- [ ] Routes pour les 4 pages
- [ ] Navigation links

---

## 💾 Commits Recommandés

```bash
# Jour 2 - Clients pages
git commit -m "feat: add ClientDetailPage with contracts list"
git commit -m "feat: add CreateClientPage with form validation"
git commit -m "feat: add EditClientPage"
git commit -m "feat: setup React Router for clients pages"

# Jour 3 - Contracts
git commit -m "feat: add ContractsPage with search and filters"
git commit -m "feat: add ContractDetailPage"
git commit -m "feat: add CreateContractPage"
git commit -m "feat: add EditContractPage"

# Jour 4 - Components
git commit -m "refactor: extract ClientForm component"
git commit -m "refactor: extract ContractForm component"
git commit -m "feat: add StatusBadge and selector components"

# Jour 5 - Polish
git commit -m "feat: add toast notifications"
git commit -m "feat: add confirm modals for delete actions"
git commit -m "test: add unit tests for pages"
git commit -m "style: improve responsive design"
```

---

## 🚨 Points Critiques à Surveiller

### Backend
- [ ] Vérifier permissions (rôles)
- [ ] Tester pagination
- [ ] Vérifier soft delete

### Frontend
- [ ] React Query cache invalidation
- [ ] Loading states complets
- [ ] Error handling partout
- [ ] Types TypeScript stricts

### Intégration
- [ ] CORS errors?
- [ ] Token expiration?
- [ ] Form validation côté frontend?

---

## 📚 Ressources Utiles

### Composant Template (Réutilisable)
```tsx
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, ErrorMessage } from '@/components/ui';

export default function DetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Charge données
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => api.getById(id!),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <div>{t('common.notFound')}</div>;

  return (
    <div className="space-y-6">
      {/* Contenu */}
      <Card>
        {/* Données */}
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => navigate(`/edit/${id}`)}>
          {t('common.edit')}
        </Button>
        <Button variant="danger" onClick={() => {
          if (confirm(t('common.confirmDelete'))) {
            api.delete(id).then(() => navigate('/'));
          }
        }}>
          {t('common.delete')}
        </Button>
      </div>
    </div>
  );
}
```

### Formulaire Template (Réutilisable)
```tsx
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '@/components/ui';
import { toast } from 'react-hot-toast';

export default function FormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate, isLoading } = useMutation(api.create, {
    onSuccess: (data) => {
      toast.success('Créé avec succès');
      navigate(`/detail/${data.id}`);
    },
    onError: (error) => {
      toast.error('Erreur: ' + error.message);
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <Input {...register('name', { required: true })} />
      {errors.name && <span>{errors.name.message}</span>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer'}
      </Button>
    </form>
  );
}
```

---

## ⚡ Performance Tips

1. **Lazy Load Pages**
```tsx
const ClientsPage = lazy(() => import('./ClientsPage'));
```

2. **Memoize Components**
```tsx
export default memo(ClientCard);
```

3. **React Query Cache**
```tsx
queryClient.prefetchQuery(['client', id], () => api.getById(id));
```

4. **Optimize Re-renders**
```tsx
const { data } = useQuery({...}, { keepPreviousData: true });
```

---

## 📈 Success Metrics

### Semaine 1
- [ ] 4 pages clients 100% fonctionnelles
- [ ] 4 pages contrats 100% fonctionnelles
- [ ] 0 erreurs console (production ready)
- [ ] 100% des endpoints testés

### Semaine 2
- [ ] Interventions gérées
- [ ] Dashboard en place
- [ ] Mobile features
- [ ] Production ready

---

## 🎁 Bonus (Si Temps Disponible)

- [ ] Dark mode
- [ ] Pagination optimisée
- [ ] Search debounce
- [ ] CSV export clients
- [ ] PDF export contrats
- [ ] Real-time notifications
- [ ] Team collaboration features

---

**À Bientôt! 🚀**

Prochaine revue: Dimanche 19 Janvier  
Prochaines étapes complètes en: QUICK_START.md
