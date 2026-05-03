import { PrismaClient } from '@prisma/client';

/**
 * Prisma n'a pas besoin qu'on lui passe l'URI en paramètre.Il utilise nativement
 * la variable 'DATABASE_URL du fichier .env'
*/

class Connection {
    constructor() {
        this.prisma = new PrismaClient();
        this.isConnected = false;
    }

    async connectToDb(){
        try {
            $connect(); //force la connexion immédiate pour s'assurer que la BDD est joignable au démarrage
            await this.prisma.$connect();
            this.isConnected=true;
            console.info("PostgreSQL connected via prisma");
            return this.prisma;
        }catch(e){
            console.error(`PostgreSQL connection error : ${e.message}`);
            process.exit(1);
        }
    }

    async disconnect(){
        if(this.isConnected){
            await this.prisma.$disconnect();
            this.isConnected=false;
            console.info("PostgreSQL disconnected");
        }
    }
}