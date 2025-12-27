# Instructions Git - Nettoyage Plus

**Dernière Mise à Jour:** 26 Décembre 2025  
**Utilisateurs:** Zied Zaafrani & Montassar Lemjid

---

## ⚠️ RÈGLE IMPORTANTE

**L'IA n'effectue JAMAIS d'opérations Git automatiquement.**

Les commandes Git sont exécutées **UNIQUEMENT** quand l'utilisateur le demande explicitement avec des phrases comme:
- "Sauvegarde ça"
- "Save locally"
- "Commit"
- "Sauvegarde en ligne"
- "Save online"
- "Push"

---

## Commandes Acceptées

### 1. Sauvegarder Localement (Local Commit)

**Phrases que l'utilisateur peut dire:**
- "Sauvegarde ça"
- "Save locally"
- "Commit"
- "Sauvegarde local"
- "Enregistre les changements"

**Ce que l'IA doit faire:**

**Étape 1 - Vérifier les changements:**
```bash
git status
```

**Étape 2 - Ajouter tous les fichiers modifiés:**
```bash
git add .
```

**Étape 3 - Demander confirmation à l'utilisateur:**
```
Fichiers à sauvegarder:
- [liste des fichiers modifiés]

Message de commit suggéré:
"[type]: [description de ce qui a été fait]"

Exemples:
- "feat: ajout module clients avec CRUD complet"
- "fix: correction erreur validation email"
- "refactor: amélioration structure dossiers backend"

Confirme le message ou donne-moi ta propre version?
```

**Étape 4 - Après confirmation, commit:**
```bash
git commit -m "message confirmé par l'utilisateur"
```

**Étape 5 - Confirmer à l'utilisateur:**
```
✅ Sauvegarde locale effectuée!

Message: [message du commit]
Fichiers sauvegardés: [nombre de fichiers]

Les changements sont sauvegardés sur ton ordinateur.
Pour les envoyer en ligne, dis "save online" ou "sauvegarde en ligne".
```

---

### 2. Sauvegarder en Ligne (Push)

**Phrases que l'utilisateur peut dire:**
- "Sauvegarde en ligne"
- "Save online"
- "Push"
- "Envoie sur GitHub"
- "Upload"

**Ce que l'IA doit faire:**

**Étape 1 - Vérifier qu'il y a un commit local:**
```bash
git log -1
```

**Étape 2 - Demander confirmation:**
```
Tu vas envoyer ces changements sur GitHub:
- Dernier commit: [message du dernier commit]
- Branch actuelle: [nom de la branch]

Confirme pour envoyer en ligne?
```

**Étape 3 - Après confirmation, push:**
```bash
git push origin [branch-actuelle]
```

**Étape 4 - Confirmer à l'utilisateur:**
```
✅ Changements envoyés en ligne!

Branch: [nom de la branch]
Commit: [message]

Tes changements sont maintenant sur GitHub.
```

**Si Erreur (push rejeté):**
```
❌ Impossible d'envoyer en ligne.

Raison probable: Quelqu'un d'autre a fait des changements sur GitHub.

Solutions:
1. Récupère les derniers changements: "pull changes" ou "récupère les changements"
2. Ou on merge ensemble quand vous êtes tous les deux en ligne

Qu'est-ce que tu veux faire?
```

---

### 3. Récupérer les Changements (Pull)

**Phrases que l'utilisateur peut dire:**
- "Récupère les changements"
- "Pull"
- "Get latest changes"
- "Update"
- "Télécharge les changements"

**Ce que l'IA doit faire:**

**Étape 1 - Vérifier si des changements locaux non sauvegardés existent:**
```bash
git status
```

**Si changements non sauvegardés:**
```
⚠️ Attention!

Tu as des changements non sauvegardés:
- [liste des fichiers modifiés]

Options:
1. Sauvegarde d'abord localement: "save locally"
2. Ou ignore tes changements (ils seront perdus): "ignore mes changements"

Que veux-tu faire?
```

**Étape 2 - Si aucun changement local, pull:**
```bash
git pull origin [branch-actuelle]
```

**Étape 3 - Confirmer à l'utilisateur:**
```
✅ Changements récupérés!

Fichiers mis à jour: [nombre]
- [liste des fichiers changés]

Ton code est maintenant à jour avec GitHub.
```

**Si Conflits Détectés:**
```
⚠️ CONFLITS DÉTECTÉS!

Fichiers en conflit:
- [liste des fichiers avec conflits]

Tu dois résoudre les conflits manuellement ou avec Zied/Montassar.

L'IA ne peut pas résoudre les conflits automatiquement.
Voulez-vous que j'arrête ici pour que vous puissiez le faire ensemble?
```

---

### 4. Voir l'État Actuel (Status)

**Phrases que l'utilisateur peut dire:**
- "Quel est l'état?"
- "Status"
- "Qu'est-ce qui a changé?"
- "Show status"

**Ce que l'IA doit faire:**
```bash
git status
```

**Réponse à l'utilisateur:**
```
État actuel:

Branch: [nom de la branch]

Fichiers modifiés:
- [liste]

Fichiers non suivis (nouveaux):
- [liste]

Fichiers supprimés:
- [liste]

Tu peux:
- Sauvegarder localement: "save locally"
- Ignorer les changements: "reset"
```

---

### 5. Voir l'Historique (Log)

**Phrases que l'utilisateur peut dire:**
- "Montre l'historique"
- "Show log"
- "Derniers commits"
- "Historique Git"

**Ce que l'IA doit faire:**
```bash
git log --oneline -10
```

**Réponse à l'utilisateur:**
```
Derniers commits:

[hash court] - [message] - [auteur] - [date]
[hash court] - [message] - [auteur] - [date]
...

Veux-tu voir plus de détails sur un commit? Donne-moi son hash.
```

---

### 6. Créer une Nouvelle Branch

**Phrases que l'utilisateur peut dire:**
- "Crée une branch"
- "Create branch"
- "Nouvelle branch"
- "New branch [nom]"

**Ce que l'IA doit faire:**

**Étape 1 - Demander le nom si pas fourni:**
```
Quel nom pour la nouvelle branch?

Convention suggérée:
- feature/[nom-fonctionnalite]
- fix/[nom-bug]
- refactor/[nom-module]

Exemples:
- feature/client-module
- fix/login-error
- refactor/backend-structure
```

**Étape 2 - Créer et basculer sur la branch:**
```bash
git checkout -b [nom-branch]
```

**Étape 3 - Confirmer:**
```
✅ Branch créée!

Nom: [nom-branch]
Tu es maintenant sur cette branch.

Tous tes prochains commits seront sur cette branch.
```

---

### 7. Changer de Branch

**Phrases que l'utilisateur peut dire:**
- "Change de branch"
- "Switch to [nom]"
- "Va sur [nom]"
- "Checkout [nom]"

**Ce que l'IA doit faire:**

**Étape 1 - Vérifier les changements non sauvegardés:**
```bash
git status
```

**Si changements non sauvegardés:**
```
⚠️ Tu as des changements non sauvegardés!

Tu dois d'abord:
1. Sauvegarder: "save locally"
2. Ou ignorer: "ignore changes"

Que veux-tu faire?
```

**Étape 2 - Changer de branch:**
```bash
git checkout [nom-branch]
```

**Étape 3 - Confirmer:**
```
✅ Branch changée!

Tu es maintenant sur: [nom-branch]
Dernier commit: [message du dernier commit]
```

---

### 8. Annuler les Changements (Reset)

**Phrases que l'utilisateur peut dire:**
- "Annule mes changements"
- "Reset"
- "Ignore mes modifications"
- "Reviens en arrière"

**Ce que l'IA doit faire:**

**Étape 1 - AVERTISSEMENT SÉRIEUX:**
```
⚠️⚠️⚠️ ATTENTION! ⚠️⚠️⚠️

Cette action va SUPPRIMER tous tes changements non sauvegardés!

Fichiers qui seront perdus:
- [liste des fichiers modifiés]

Cette action est IRRÉVERSIBLE!

Es-tu ABSOLUMENT SÛR? (tape "oui je suis sûr" pour confirmer)
```

**Étape 2 - Après confirmation explicite:**
```bash
git reset --hard HEAD
git clean -fd
```

**Étape 3 - Confirmer:**
```
✅ Changements annulés!

Ton code est revenu à l'état du dernier commit.
Tous les changements non sauvegardés ont été supprimés.
```

---

### 9. Revenir à un Ancien Commit (Rollback)

**Phrases que l'utilisateur peut dire:**
- "Reviens au commit [hash]"
- "Rollback to [hash]"
- "Restore [hash]"

**Ce que l'IA doit faire:**

**Étape 1 - Montrer l'historique si pas de hash:**
```bash
git log --oneline -10
```
```
Voici les derniers commits:

[liste des commits avec hash]

Donne-moi le hash (code court) du commit où tu veux revenir.
```

**Étape 2 - AVERTISSEMENT:**
```
⚠️ ATTENTION!

Tu vas revenir au commit:
[hash] - [message] - [date]

Tous les commits après celui-ci seront perdus!
Tous tes changements non sauvegardés seront perdus!

Es-tu sûr? (tape "oui je suis sûr")
```

**Étape 3 - Après confirmation:**
```bash
git reset --hard [hash]
```

**Étape 4 - Confirmer:**
```
✅ Rollback effectué!

Tu es revenu au commit: [hash]
Tous les commits suivants ont été supprimés.
```

---

## ❌ Ce Que l'IA NE FAIT JAMAIS

### Opérations Interdites Sans Permission Explicite:

1. **Merge (Fusion de branches)**
   - Trop risqué
   - Zied et Montassar le font ensemble en ligne
   - Si conflits, l'IA arrête et demande de l'aide

2. **Rebase**
   - Trop complexe
   - Peut casser l'historique
   - Réservé aux utilisateurs avancés

3. **Force Push**
   - Dangereux
   - Peut écraser le travail des autres
   - Jamais permis à l'IA

4. **Delete Branch**
   - Seulement si l'utilisateur dit explicitement
   - Avec double confirmation

---

## 🚨 Gestion des Erreurs Git

### Si une Commande Git Échoue:

**L'IA doit:**
1. Montrer l'erreur complète
2. Expliquer simplement ce qui s'est passé
3. Suggérer une solution simple
4. Demander: "Veux-tu que j'essaie [solution] ou on attend de régler ça ensemble?"

**Exemple:**
```
❌ Erreur lors du push!

Erreur: rejected - non-fast-forward

Explication simple:
Quelqu'un d'autre a fait des changements sur GitHub que tu n'as pas encore.

Solution suggérée:
Récupère d'abord les changements: "pull changes"

Ou on peut régler ça ensemble quand vous êtes en ligne.

Que veux-tu faire?
```

---

## 📋 Format des Messages de Commit

### Convention à Suivre:
```
[type]: [description courte et claire]

[détails optionnels si nécessaire]
```

### Types Autorisés:
- **feat:** Nouvelle fonctionnalité
- **fix:** Correction de bug
- **refactor:** Amélioration du code (sans changement de fonctionnalité)
- **style:** Changements visuels (CSS, UI)
- **docs:** Documentation
- **test:** Ajout de tests
- **chore:** Maintenance (dépendances, config)

### Exemples de Bons Messages:

**Français (Montassar):**
- `feat: ajout module clients avec CRUD complet`
- `fix: correction validation email dans formulaire inscription`
- `style: amélioration design page d'accueil`
- `refactor: restructuration dossiers backend`

**Anglais (Zied):**
- `feat: add client module with full CRUD operations`
- `fix: resolve email validation in registration form`
- `refactor: improve backend folder structure`
- `docs: update API documentation for auth endpoints`

### Exemples de Mauvais Messages:
- ❌ `update`
- ❌ `fix stuff`
- ❌ `changes`
- ❌ `work in progress`
- ❌ `aaaaaa`

---

## 🔄 Workflow Recommandé

### Début de Journée:
```
1. "récupère les changements" (pull)
2. Travaille sur ton code
3. "save locally" régulièrement (toutes les 30-60 min)
4. "save online" en fin de journée
```

### Avant de Quitter:
```
1. "save locally" (si changements)
2. "save online" (partage avec l'équipe)
```

### Si Tu Travailles sur une Grande Fonctionnalité:
```
1. "crée une branch feature/[nom]"
2. Travaille sur cette branch
3. "save locally" régulièrement
4. "save online" pour backup
5. Quand terminé, merge avec Zied/Montassar ensemble
```

---

## 🆘 En Cas de Problème

### Si Tu es Bloqué:

**L'IA doit dire:**
```
🆘 Situation Git complexe détectée!

Problème: [description]

Je ne peux pas résoudre ça automatiquement.

Options:
1. On attend de régler ça ensemble (recommandé)
2. Tu peux essayer de reset (mais tu perds tes changements)
3. Contacte Zied/Montassar pour merge ensemble

Que veux-tu faire?
```

**L'IA ne doit JAMAIS:**
- Essayer de forcer des solutions
- Faire des merges automatiques
- Prendre des décisions risquées
- Continuer si conflit détecté

---

## 📝 Logging Git

### Après Chaque Opération Git Réussie:

Log dans le TASK_LOG approprié:
```
## [Date Heure] - GIT - [Opération]
**User:** [Zied / Montassar]
**Action:** [save locally / save online / pull / etc.]
**Branch:** [nom de la branch]
**Commit Message:** [message si commit]
**Fichiers:** [nombre de fichiers modifiés]
```

---

## ✅ Checklist pour l'IA

Avant d'exécuter une commande Git, vérifie:
- [ ] L'utilisateur a demandé explicitement l'action
- [ ] J'ai confirmé avec l'utilisateur si nécessaire
- [ ] J'ai vérifié s'il y a des changements non sauvegardés
- [ ] J'ai expliqué ce qui va se passer
- [ ] Je suis prêt à gérer les erreurs possibles
- [ ] Je vais logger cette action dans TASK_LOG

---

**Version:** 1.0  
**Dernière Mise à Jour:** 26 Décembre 2025  
**Maintenu Par:** Zied Zaafrani & Montassar Lemjid

---

**Rappel Important:** L'IA est un assistant Git, pas un expert. En cas de doute, elle demande à l'utilisateur ou suggère de régler ça ensemble.