# 🚀 SplinEdge Shop

**SplinEdge Shop** est une plateforme e-commerce moderne et performante, conçue avec une architecture découplée. Ce projet utilise les technologies les plus récentes pour offrir une expérience utilisateur fluide et une gestion backend robuste.

---

## 📝 Description du projet

SplinEdge Shop est un Proof of Concept (PoC) visant à créer une solution de vente en ligne complète. 
- **Frontend** : Développé avec **React** et **Vite** pour un chargement instantané et une expérience de développement ultra-rapide.
- **Backend** : Propulsé par **Express 5**, offrant une API REST performante et évolutive.
- **Base de données** : PostgreSQL géré via Docker pour une isolation parfaite.
- **Stockage** : Intégration de MinIO pour la gestion des images produits.

---

## ⚙️ Initialisation du projet

Suivez ces étapes pour lancer le projet localement :

### 1. Prérequis
- **Node.js** (v20+)
- **Docker** & **Docker Compose**
- **npm** (ou yarn/pnpm)

### 2. Installation des dépendances
À la racine du projet, installez toutes les dépendances (root, frontend et backend) :
```bash
npm install && npm install --prefix frontend && npm install --prefix backend
```

### 3. Configuration de l'infrastructure
Lancez les services nécessaires (Base de données et Stockage) via Docker :
```bash
docker compose up -d
```

### 4. Variables d'environnement
Copiez les fichiers `.env.example` vers `.env` dans les dossiers `frontend` et `backend` et ajustez les valeurs si nécessaire.

### 5. Lancement
Pour lancer le frontend et le backend simultanément :
```bash
npm run dev
```
L'application sera disponible sur :
- Frontend : `http://localhost:5173`
- Backend API : `http://localhost:3001`

---

## 🤝 Contribution

Les contributions sont ce qui rend la communauté open-source incroyable ! Toute contribution est la bienvenue.

1. **Forker** le projet.
2. Créer une **Branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`).
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`).
4. **Push** sur la branche (`git push origin feature/AmazingFeature`).
5. Ouvrir une **Pull Request**.

---

## 📄 Licence
Distribué sous la licence ISC. Voir `package.json` pour plus de détails.
