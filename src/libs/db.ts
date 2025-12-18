import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/client.js";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);

const db = new PrismaClient({ adapter });

export { db };
