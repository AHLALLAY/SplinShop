## 18. Getting started (initialisation projet)

### 18.1 Prérequis

- Node.js LTS
- npm (ou pnpm/yarn)
- PostgreSQL démarré localement

### 18.2 Initialiser le frontend

```bash
npx create-next-app@latest frontend --typescript --eslint --app --src-dir --import-alias "@/*"
cd frontend
npm run dev
```

### 18.3 Initialiser le backend

```bash
npm i -g @nestjs/cli
nest new backend
cd backend
npm run start:dev
```

### 18.4 Installer Prisma et dépendances backend

```bash
cd backend
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
npm install @nestjs/config class-validator class-transformer
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs stripe
npm install -D @types/passport-jwt @types/bcrypt
```

### 18.5 Variables d’environnement

`backend/.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce_mvp"
JWT_SECRET="change_me"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
PORT=3001
```

`frontend/.env`

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

### 18.6 Première migration Prisma

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 18.7 Lancer les deux applications

Terminal 1 :

```bash
cd backend
npm run start:dev
```

Terminal 2 :

```bash
cd frontend
npm run dev
```

---

Ce document est la référence principale du PoC. En cas de conflit entre sources historiques, ce README fait foi.
