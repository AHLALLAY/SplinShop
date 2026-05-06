import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
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