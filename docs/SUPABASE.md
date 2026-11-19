# Brancher Bivaska sur Supabase

Tout le code est prêt : comptes, sauvegarde, signalements, idées, carte communautaire et modération. Tant que `config.js` est vide, l'appli fonctionne exactement comme avant, sans compte.

## 1. Créer le projet (5 minutes, gratuit)
1. Va sur https://supabase.com, crée un compte (avec GitHub, c'est le plus simple).
2. **New project** : nom `sylva`, mot de passe de base de données fort (garde-le dans ton gestionnaire de mots de passe), région **Central EU (Frankfurt)**.
3. Attends que le projet soit prêt (1 à 2 minutes).

## 2. Créer les tables
1. Menu de gauche **SQL Editor** → **New query**.
2. Colle tout le contenu de `supabase/schema.sql` (dans le dépôt) → **Run**. Il doit afficher « Success ».

## 3. Régler la connexion par code
1. **Authentication → Sign In / Providers → Email** : laisse « Enable Email provider » activé ; « Confirm email » activé.
2. **Authentication → Emails → Magic Link** : remplace le texte du modèle par :
   ```
   <h2>Ton code Bivaska</h2>
   <p>Entre ce code dans l'appli : <b style="font-size:24px">{{ .Token }}</b></p>
   <p>Il expire dans une heure. Si tu n'as rien demandé, ignore ce message.</p>
   ```
   (Un code plutôt qu'un lien : sur iPhone, un lien s'ouvrirait dans Safari et pas dans l'appli installée.)
3. Fais pareil pour le modèle **Confirm signup** (même texte).
4. **Authentication → URL Configuration** : *Site URL* = `https://timhurr.github.io/Sylva/`.
5. Pour la sortie publique : **Authentication → Emails → SMTP Settings**, branche un vrai service d'e-mail (Brevo, Resend…). Le service intégré de Supabase est limité à quelques e-mails par heure, suffisant pour tester.

## 4. Donner les clés à Claude
**Project Settings → API** (ou « Data API ») :
- **Project URL** (ex. `https://abcdefgh.supabase.co`)
- **anon public** key

Ces deux-là sont faites pour être publiques (la sécurité vient des règles de `schema.sql`). Claude les met dans `config.js`.
**Ne donne jamais la clé `service_role`** : elle contourne toute la sécurité.

## 5. Devenir administrateur (modération)
1. Connecte-toi une première fois dans l'appli (Réglages → Mon compte) avec ton adresse.
2. Dans Supabase, **SQL Editor**, lance (en remplaçant l'adresse) :
   ```sql
   update public.profiles set is_admin = true, trusted = true
   where id = (select id from auth.users where email = 'ton@adresse.be');
   ```
3. La modération se fait sur https://timhurr.github.io/Sylva/moderation.html (même connexion par code).

## Comment marche la modération
- Les **3 premiers spots** d'un membre arrivent dans la file « Spots » : tu publies ou refuses. Au 3e spot validé, il devient membre de confiance et publie directement.
- **Toutes les photos** passent par la file « Photos » (visages, plaques, contenu choquant → refuser).
- Un spot **signalé 3 fois** est masqué automatiquement et revient dans ta file.
- Les **signalements d'erreur** sur les fiches et espèces arrivent dans « Signalements » (possibles sans compte).
- Les **idées** sont publiées après ta relecture ; tu peux les marquer « prévu ».

## Ce qui reste sur le téléphone, toujours
« Mes infos d'urgence » (santé), le minuteur de garrot, les clés d'API, les caches de carte et la position en direct ne sont jamais envoyés. Les photos du journal et des spots non partagés ne sont pas sauvegardées en ligne (pour l'instant).

## Coûts
Formule gratuite : 50 000 utilisateurs actifs par mois, 500 Mo de base, 1 Go de photos. Ensuite Pro à 25 $/mois. Attention : un projet gratuit **se met en pause après 7 jours sans activité** ; il redémarre en un clic depuis le tableau de bord (ou passer en Pro au lancement).
