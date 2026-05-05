import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
/**
 * Prisma n'a pas besoin qu'on lui passe l'URI en paramètre.Il utilise nativement
 * la variable 'DATABASE_URL du fichier .env'
*/

const dbUrl = process.env.DATABASE_URL;
const adapter = new PrismaPg({clientUrl: dbUrl})
const prisma = new PrismaClient({adapter});

class Connection {
    constructor() {
        this.prisma = prisma;
        this.isConnected = false;
    }

    async connectToDb(){
        try {
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

export default new Connection();