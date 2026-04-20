# Getting Started (Initialisation du projet)

Ce document est la référence principale du PoC. En cas de conflit entre sources historiques, ce README fait foi.

## Sommaire
1. [Prérequis](#1-prérequis)
2. [Infrastructure (Docker)](#2-infrastructure-docker)
3. [Initialiser le frontend](#3-initialiser-le-frontend)
4. [Initialiser le backend](#4-initialiser-le-backend)
5. [Variables d’environnement](#5-variables-denvironnement)
6. [Configuration de la base de données](#6-configuration-de-la-base-de-données)
7. [Lancement du projet (Terminal unique)](#7-lancement-du-projet-terminal-unique)

---

## 1. Prérequis

- **Node.js** : la version utilisée pour ce projet est v24.14.1.
- **Gestionnaire de paquets** : npm (ou pnpm/yarn).
- **Base de données** : PostgreSQL démarré localement.
- **Stockage des images** : MinIO démarré localement.
_ou_
- **Docker et Docker Compose** : requis pour faire tourner les dépendances du projet.

## 2. Infrastructure (Docker)

Avant de configurer les applications, démarrez les services requis (PostgreSQL et MinIO) via Docker. Depuis la racine de votre projet :

```bash
docker-compose up -d
```

## 3. Initialiser le frontend
Depuis la racine du projet, créez l'application Next.js :

```Bash
npx create-next-app@latest frontend --typescript --eslint --app --src-dir --import-alias "@/*"
```

## 4. Initialiser le backend
### 4.1. Création du projet NestJS

Si vous n'avez pas installé le CLI de Nest globalement, exécutez la première commande. Sinon, passez directement à la création :

```Bash
npm i -g @nestjs/cli
nest new backend
cd backend
```

### 4.2. Installation des dépendances et de Prisma
Toujours dans le dossier backend, installez les outils nécessaires :

```Bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init

npm install @nestjs/config class-validator class-transformer
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs stripe

# Attention à bien installer les types pour bcryptjs
npm install -D @types/passport-jwt @types/bcryptjs
cd ..
```

## 5. Variables d’environnement
Créez les fichiers .env correspondants dans chaque dossier en vous basant sur ces modèles :

backend/.env

```env
# Extrait de code
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce_mvp"
JWT_SECRET="change_me"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
PORT=3001
```
frontend/.env

```env
# Extrait de code
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

## 6. Configuration de la base de données
Une fois la base de données démarrée (via Docker) et les variables d'environnement configurées, exécutez votre première migration :

```Bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

## 7. Lancement du projet (Terminal unique)
Pour lancer à la fois le frontend et le backend dans un seul terminal sans avoir à ouvrir plusieurs fenêtres, nous utilisons concurrently.

Depuis la racine du projet, exécutez simplement :

```Bash
npx concurrently "npm run start:dev --prefix backend" "npm run dev --prefix frontend"
```
**Astuce d'optimisation** : Pour vous simplifier la vie par la suite, vous pouvez initialiser un fichier package.json à la racine de votre projet avec npm init -y, y installer concurrently via npm i -D concurrently, et ajouter la commande ci-dessus dans la section "scripts" sous le nom "dev". Ainsi, un simple npm run dev à la racine suffira à tout lancer.