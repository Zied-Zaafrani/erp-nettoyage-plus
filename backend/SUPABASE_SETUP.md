# Configuration Supabase pour erp-nettoyage-plus

## Étapes pour configurer votre base de données Supabase :

### 1. Récupérez vos identifiants Supabase

Allez sur https://supabase.com/dashboard/project/gqjymgkaxmdapmmwvspp/settings/database et trouvez:
- **Host**: supabase.co (visible dans votre URL)
- **Port**: 5432
- **Database**: postgres
- **Username**: postgres
- **Password**: Votre mot de passe Supabase

### 2. Construisez l'URL de connexion

Format:
```
postgresql://postgres:YOUR_PASSWORD@gqjymgkaxmdapmmwvspp.supabase.co:5432/postgres?schema=public&sslmode=require
```

Remplacez `YOUR_PASSWORD` par votre mot de passe réel.

### 3. Mettez à jour le fichier `.env`

Modifiez `backend/.env`:
```dotenv
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@gqjymgkaxmdapmmwvspp.supabase.co:5432/postgres?schema=public&sslmode=require"
```

### 4. Redémarrez le backend

```bash
npm run start:dev
```

## Besoin d'aide ?

Si vous avez toujours des erreurs:
1. Vérifiez que PostgreSQL accepte les connexions SSL
2. Confirmez que le mot de passe est correct
3. Vérifiez que les tables sont créées dans Supabase
