# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.


 <<<<<--------AI Text & Audio SaaS Architecture v1------->>>>>



AI Text & Audio SaaS
Version 1.0

──────────────────────────────

1. Vision du produit

2. Fonctionnalités

3. Architecture

4. Modèles de données

5. Relations

6. Règles métier

7. Enums

8. Roadmap

9. Décisions d'architecture

10. Futures améliorations



<<<<<<<<<<<<<<<--------------------RÈGLES MÉTIER-------------------->>>>>>>>>>>>>>





Authentification
L'utilisateur doit être connecté pour accéder au tableau de bord.
Chaque utilisateur ne voit que ses propres projets.


Projet
    Un projet appartient à un seul utilisateur.
    Un projet peut être restauré pendant 30 jours.
    Après 30 jours, il est supprimé définitivement.

Génération
    Une génération appartient à un seul projet.
    Une génération utilise une seule voix.
    Une génération consomme des crédits.
    Une génération garde un "snapshot" des paramètres utilisés.

Voix
    Une voix peut être intégrée ou personnelle.
    Une voix inactive ne peut plus être utilisée pour une nouvelle génération.
    Une voix personnelle appartient à un seul utilisateur.

<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<L'architecture complète>>>>>>>>>>>>>>>>>>>>>>>>>>>>


                                👤 Utilisateur
                                        │
                                        ▼
                            Next.js (Frontend)
                                        │
                                        ▼
                                tRPC Router
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │   Services métier    │
                            ├──────────────────────┤
                            │ AuthService          │
                            │ ProjectService       │
                            │ GenerationService    │
                            │ VoiceService         │
                            │ BillingService       │
                            │ CreditService        │
                            └──────────────────────┘
                                        │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
                    Prisma                         APIs externes
                        │                  ┌─────────┬─────────┬─────────┐
                        ▼                  ▼         ▼         ▼         ▼
            Neon PostgreSQL        Better Auth  OpenAI  ElevenLabs  Cloudflare R2


server/
│
├── api/
│
├── auth/
│
├── db/
│
├── repositories/
│   ├── project.repository.ts
│   ├── voice.repository.ts
│   ├── generation.repository.ts
│   └── user.repository.ts
│
├── services/
│   ├── auth.service.ts
│   ├── project.service.ts
│   ├── generation.service.ts
│   ├── voice.service.ts
│   ├── billing.service.ts
│   └── credit.service.ts
│
├── providers/
│   ├── openai.provider.ts
│   ├── elevenlabs.provider.ts
│   └── minimax.provider.ts
│
└── workers/
    ├── cleanup.worker.ts
    └── generation.worker.ts



                        📌 Architecture globale

                    Je vois notre SaaS découpé en 7 domaines.

                    AI Text Audio SaaS
                    │
                    ├── Auth Domain
                    ├── Project Domain
                    ├── Voice Domain
                    ├── Generation Domain
                    ├── Billing Domain
                    ├── Storage Domain
                    └── Notification Domain

                    Chaque domaine est indépendant.

                    1️⃣ Auth Domain

                    Responsabilité :

                    Connexion

                    Inscription

                    Sessions

                    Sécurité

                    Modèles :

                    User
                    Session
                    Account
                    Verification
                    2️⃣ Project Domain

                    Responsabilité :

                    Organiser le travail

                    Contient :

                    Project

                    Services :

                    Create Project

                    Rename Project

                    Delete Project

                    Restore Project

                    Favorite Project
                    3️⃣ Voice Domain

                    Responsabilité :

                    Toutes les voix

                    Contient :

                    SYSTEM

                    PERSONAL

                    TEMPORARY

                    Services :

                    Importer une voix

                    Supprimer une voix

                    Ajouter aux favoris

                    Rechercher une voix
                    4️⃣ Generation Domain ⭐

                    C'est le cerveau de l'application.

                    Responsabilité :

                    Transformer un texte

                    Audio

                    Services :

                    Créer une génération

                    Réessayer

                    Annuler

                    Télécharger

                    Historique
                    Workflow
                    Create Generation

                    Validation

                    Créer Generation(PENDING)

                    Déduire crédits

                    Worker

                    Provider

                    Upload R2

                    Notification

                    Completed
                    5️⃣ Billing Domain

                    Responsabilité :

                    Argent

                    Crédits

                    Abonnements

                    Contient :

                    Subscription

                    SubscriptionPlan

                    CreditPack

                    Purchase

                    CreditTransaction
                    6️⃣ Storage Domain

                    Responsabilité

                    Tous les fichiers.

                    Voice

                    Audio

                    Image

                    Document

                    Tous passent par :

                    File

                    7️⃣ Notification Domain

                    Responsabilité

                    Informer l'utilisateur.

                    Exemple :

                    Audio terminé

                    Paiement accepté

                    Abonnement expiré

                    Nouveaux crédits