# Préférences Utilisateur - Montassar Lemjid

**Rôle:** Développeur Frontend  
**Domaine Principal:** Frontend (React, React Native, TailwindCSS)  
**Dernière Mise à Jour:** 26 Décembre 2025

---

## Style de Communication

### Langue
- **Langue Principale:** Français
- **Commentaires de Code:** Français
- **Documentation:** Français
- **Messages d'Erreur:** Français
- **Commits Git:** Français

### Ton & Niveau de Détail
- **Style Préféré:** Concis et direct
- **Format:** Points clairs et actions concrètes
- **Profondeur d'Explication:**
  - Va droit au but
  - Explications courtes et pratiques
  - Évite les longs paragraphes
  - Montre le code rapidement

### Structure de Réponse que Je Préfère
```
Résumé rapide (1 ligne)
↓
Actions concrètes (puces)
↓
Code si nécessaire
↓
Question/Confirmation
```

**Exemple de Bonne Réponse:**
```
Je vais créer le composant de liste des clients.

Ce que je fais:
- Composant React avec TailwindCSS
- Affichage en grille responsive
- Boutons d'action (modifier, supprimer)
- Chargement et gestion des erreurs

Taille: Moyen

Je continue?
```

**Exemple de Mauvaise Réponse:**
```
Bien sûr! Je vais créer un magnifique composant pour afficher les clients avec plein de fonctionnalités incroyables et ce sera vraiment super et tu vas adorer le résultat et on pourra ajouter plein d'autres choses après...
```

---

## Préférences de Travail

### Approche Résolution de Problèmes
- **Sois direct** - Dis-moi ce qui ne va pas simplement
- **Pose des questions** - Mais pas trop, juste l'essentiel
- **Montre le code** - J'apprends mieux en voyant
- **Solutions rapides** - Donne-moi l'option la plus simple d'abord

### Quand Tu es Bloqué
- **Dis-le tout de suite** - Pas de temps à perdre
- **Montre l'erreur** - Message complet
- **Suggère une solution** - Qu'est-ce qu'on essaie?
- **2 tentatives max** - Après, demande-moi

### Planification
Garde ça simple:
1. Dis-moi ce que tu vas faire (court)
2. Attends ma confirmation
3. Code
4. Montre le résultat

---

## Préférences Techniques

### Développement Frontend

**Style de Code:**
- TailwindCSS pour tout le styling
- Composants React simples et clairs
- Noms de variables en français ou anglais (selon le contexte)
- Pas de code compliqué sans raison

**React/React Native:**
- Composants fonctionnels (pas de classes)
- Hooks React (useState, useEffect, etc.)
- Props claires et bien définies
- Composants réutilisables

**Styling:**
- TailwindCSS uniquement (pas de CSS custom sauf nécessaire)
- Design responsive (mobile-first)
- Couleurs cohérentes (palette définie)
- Interface claire et intuitive

**Gestion d'État:**
- Context API pour état global simple
- Props pour données locales
- Évite la complexité inutile

---

## Attentes Documentation

### Commentaires de Code
- En français
- Courts et utiles
- Explique le "pourquoi" si c'est pas évident
- Pas de commentaires obvies

**Bon:**
```javascript
// Vérifie les permissions avant d'afficher le bouton supprimer
```

**Mauvais:**
```javascript
// Cette fonction prend un paramètre et retourne quelque chose
```

### Documentation Composants
Chaque composant principal doit avoir:
- Description rapide de son rôle
- Props et leurs types
- Exemple d'utilisation
- Dépendances si nécessaire

### Logging dans Fichiers
- **TASK_LOG_WEB.md** ou **TASK_LOG_MOBILE.md** - Tout le travail fait
- **ERROR_LOG_WEB.md** ou **ERROR_LOG_MOBILE.md** - Erreurs après 2 essais
- **QUESTIONS_WEB.md** ou **QUESTIONS_MOBILE.md** - Questions avant d'assumer
- **FUTURE_IMPROVEMENTS_WEB.md** ou **MOBILE.md** - Améliorations possibles

---

## Style de Décision

### J'Apprécie:
- **Simplicité** - La solution la plus simple qui marche
- **Rapidité** - Résultats rapides, on améliorera après
- **Pratique** - Pas de théorie, du concret
- **Visuel** - Interface avant tout

### Je N'Aime Pas:
- **Sur-complication** - Garde ça simple
- **Trop de questions** - Juste l'essentiel
- **Longs textes** - Sois bref
- **Perfectionnisme excessif** - Ça marche? C'est bon.

### Quand Tu Proposes des Solutions
- Donne-moi l'option la plus simple en premier
- Si plusieurs choix, liste-les rapidement
- Dis-moi ce que tu recommandes
- Pas besoin de longs paragraphes

---

## Gestion des Erreurs

### Quand Tu Rencontres une Erreur

**Premier Essai:**
- Essaie de corriger
- Note ce que tu as fait

**Deuxième Essai:**
- Essaie différemment
- Note cette tentative aussi

**Après 2 Échecs:**
- STOP immédiatement
- Log dans `ERROR_LOG_WEB.md` ou `ERROR_LOG_MOBILE.md`
- Montre-moi:
  - L'erreur
  - Tes 2 tentatives
  - Ce que tu penses qu'est le problème
  - Ta suggestion pour la suite
- Attends mes instructions

**Jamais:**
- Continuer à essayer au hasard
- Cacher les erreurs
- Supposer que je veux que tu continues

---

## Workflow Git

### Quand Je Dis "Sauvegarde Ça"
1. Lis `/docs/ai-instructions/shared/GIT_INSTRUCTIONS.md`
2. Suis les instructions
3. Confirme avant d'exécuter
4. Message de commit clair en français

### Format de Commit que Je Préfère
```
[type]: [description claire]
```

Types: `feat`, `fix`, `style`, `refactor`, `docs`

**Bon:** `feat: ajout recherche clients avec filtres`  
**Mauvais:** `update`

---

## Signaux de Communication

### Ce Qui M'Énerve:
- Réponses trop longues
- Trop de politesse inutile
- Me répéter ce que je viens de dire
- Être vague
- Trop d'options (donne-moi la meilleure)
- Excuses excessives

### Ce Que J'Apprécie:
- Réponses courtes et claires
- Aller droit au but
- Montrer le code
- Être honnête si tu sais pas
- Poser une question si nécessaire (pas 10)
- Solutions rapides

---

## Collaboration avec Zied

### Quand Travail Frontend/Backend Se Croise
- Dis-moi clairement ce qui vient du backend
- Documente les endpoints API en français
- Fournis des exemples de requêtes/réponses
- Note les authentifications nécessaires

### Points d'Intégration
- URLs des endpoints
- Format des données (request/response)
- Codes d'erreur possibles
- Headers requis (auth tokens, etc.)

---

## Apprentissage & Amélioration

### Quand Je Te Donne du Feedback
- Je suis direct
- C'est pas personnel
- Utilise-le pour améliorer
- Update ces préférences si nécessaire

### Ce Qui M'Aide
- Exemples de code concrets
- Solutions qui marchent vite
- Pas de théorie excessive
- Résultats visuels rapides

---

## Gestion du Temps

### Estimation des Tâches
- **Petit:** < 1 heure, simple
- **Moyen:** 1-3 heures, quelques décisions à prendre
- **Grand:** > 3 heures, complexe

Si c'est Grand, découpe en morceaux plus petits.

### Indicateurs de Priorité
- Si je dis "urgent" → Priorité max
- Si plusieurs tâches → Je spécifie l'ordre si différent
- Par défaut: Dans l'ordre donné

---

## Instructions Spéciales

### Avant de Terminer une Fonctionnalité
- Est-ce que l'interface est intuitive?
- Est-ce que ça marche sur mobile ET desktop?
- Est-ce que les couleurs/styles sont cohérents?
- Est-ce que c'est assez rapide?

Si problème → Ajoute à QUESTIONS_WEB.md ou QUESTIONS_MOBILE.md

### Améliorations Futures
Après des fonctionnalités importantes:
- Note améliorations possibles dans `FUTURE_IMPROVEMENTS_[WEB/MOBILE].md`
- Considère: UX, Performance, Accessibilité, Design
- Note priorité et effort estimé

---

## Référence Rapide

**Mon Background:**
- Frontend (React, React Native, TailwindCSS)
- Expérience pratique
- J'aime les résultats rapides
- J'apprends en faisant

**Communication:**
- Français uniquement
- Court et direct
- Montre le code
- Pas de blabla

**Style de Travail:**
- Simple et efficace
- Résultats rapides
- Interface avant tout
- On améliore après

**Autorité de Décision:**
- Design/UX: Décide avec moi
- Implémentation: Fais au mieux
- Si incertain: Demande dans QUESTIONS

---

## Notes Importantes

### Git & GitHub
- J'apprends encore Git
- Explique simplement les commandes
- Confirme avant toute action Git
- En cas de conflit, demande de l'aide

### Outils que J'Utilise
- VS Code
- Chrome DevTools
- Expo (pour mobile)
- GitHub Desktop (peut-être)

---

**Dernière Mise à Jour:** 26 Décembre 2025  
**N'hésite pas à mettre à jour ces préférences si on trouve de meilleures façons de travailler ensemble.**