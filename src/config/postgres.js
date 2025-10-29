import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

let sql = null;
let db = null;

// Inicializar solo si hay DATABASE_URL
if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
}

// Helper para verificar conexión
export const checkPostgresConnection = async () => {
  if (!sql) {
    console.log('⚠️  PostgreSQL not configured (DATABASE_URL not set)');
    return false;
  }
  
  try {
    await sql`SELECT 1`;
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    return false;
  }
};

export { db };
export default db;
