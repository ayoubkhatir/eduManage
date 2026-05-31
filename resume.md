# EduManage — Présentation PPTX

## Contexte
Application web full-stack de gestion scolaire. Modernise les opérations administratives et académiques des établissements éducatifs.

## Problème
- Données fragmentées (notes, présences, dossiers papier/systèmes séparés)
- Gaps de communication admin ↔ enseignants ↔ élèves ↔ parents
- Processus manuels chronophages (saisie notes, calculs, gestion emplois du temps)
- Absence de self-service pour élèves
- Passage à l'échelle difficile

## Solution
Plateforme web centralisée avec :
- **3 rôles** : Administrateur, Enseignant, Élève
- **Dashboard** avec analytics (Chart.js)
- **Gestion académique** : niveaux, classes, matières, périodes d'évaluation
- **Saisie de notes** (échelle 0-20) avec validation
- **Annonces** (éditeur Quill) ciblées par rôle/classe
- **Calendrier** (React Big Calendar) avec événements par rôle
- **Ressources** partagées (Cloudinary)

## Stack technique
- **Framework** : TanStack Start + React 19 + TypeScript strict
- **UI** : Tailwind CSS 4, shadcn/ui (style new-york), Framer Motion, Lucide
- **État** : TanStack Query + Zustand
- **Formulaires** : React Hook Form + Zod
- **Backend** : Drizzle ORM + PostgreSQL (Neon serverless)
- **Auth** : Better Auth (email + Google/Facebook OAuth)
- **Fichiers** : Cloudinary CDN
- **Email** : Resend
- **Déploiement** : Vercel → https://edumanage.vercel.app

## Architecture
```
Client (React) → Edge (Vercel) → TanStack Start Server
    → Drizzle ORM → PostgreSQL (Neon)
    → Cloudinary (fichiers)
    → Resend (emails)
```

## Fonctionnalités clés

### Admin
- CRUD élèves, enseignants, niveaux, classes, matières
- Affectation enseignant → matière → classe
- Gestion périodes d'évaluation
- Dashboard analytics, annonces, calendrier, ressources, settings

### Enseignant
- Voir classes/matières assignées
- Saisie/modification notes
- Création annonces, upload ressources
- Calendrier, profil

### Élève
- Consultation notes, classes, matières
- Calendrier (lecture seule)
- Annonces, ressources téléchargeables
- Profil

## Sécurité
- bcrypt (cost 12), sessions HTTP-only
- Zod validation, requêtes paramétrées (Drizzle)
- RBAC middleware, HTTPS/TLS 1.3
- Pas de `dangerouslySetInnerHTML`

## UX/UI
- Design system avec tokens CSS (light/dark)
- Polices : Plus Jakarta Sans (affichage), Inter (corps), JetBrains Mono (code)
- Composants shadcn/ui, skeleton loaders
- Responsive mobile/tablette/desktop

## Modèle de données (14 tables)
`users` → `admins` / `teachers` / `students` → `classes` → `grades` → `subjects` → `teacher_assignments` → `grade_subjects` → `assessment_periods` → `assessments` → `student_marks` → `resources` → `announcements` → `events`

## Roadmap

### Court terme
- Portail parents (lecture seule)
- Présences quotidiennes
- Bulletins PDF
- Notifications email/SMS

### Moyen terme
- App mobile native
- Paiements en ligne
- Constructeur emploi du temps
- i18n (arabe, français)

### Long terme
- Assistant IA
- BI avancée
- API publique
- White-label

## Équipe
- **Ayoub Khatir** — Lead / Full Stack
- **Maafa Abdelhadi** — Full Stack
- **Benali Mohammed** — UI/UX + Frontend
- **KesKas Nazim** — Backend
- **Taabni Oussama** — Backend
- **Benmehenni Ali** — Backend

## Chiffres clés
- 3 rôles utilisateurs
- 50+ endpoints API
- 14 tables PostgreSQL
- Stack full TypeScript
- Déployé sur Vercel (serverless)
