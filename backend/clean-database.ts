/**
 * Clean Database Script
 * Drops all tables and enum types to allow fresh schema creation
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function cleanDatabase() {
  console.log('\n🧹 Starting Database Cleanup...\n');
  console.log('═'.repeat(80));

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Drop all tables
    console.log('📋 Step 1: Dropping all tables...');
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    if (tablesResult.rows.length > 0) {
      for (const table of tablesResult.rows) {
        try {
          await client.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
          console.log(`   ✓ Dropped table: ${table.tablename}`);
        } catch (error: any) {
          console.log(`   ⚠ Could not drop table ${table.tablename}: ${error.message}`);
        }
      }
    } else {
      console.log('   ℹ No tables found');
    }

    // Step 2: Drop all enum types
    console.log('\n📋 Step 2: Dropping all custom enum types...');
    const enumsResult = await client.query(`
      SELECT t.typname as enum_name
      FROM pg_type t 
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typtype = 'e'
      AND n.nspname = 'public'
      ORDER BY t.typname;
    `);

    if (enumsResult.rows.length > 0) {
      for (const enumType of enumsResult.rows) {
        try {
          await client.query(`DROP TYPE IF EXISTS "${enumType.enum_name}" CASCADE;`);
          console.log(`   ✓ Dropped enum: ${enumType.enum_name}`);
        } catch (error: any) {
          console.log(`   ⚠ Could not drop enum ${enumType.enum_name}: ${error.message}`);
        }
      }
    } else {
      console.log('   ℹ No enum types found');
    }

    // Step 3: Drop all sequences
    console.log('\n📋 Step 3: Dropping all sequences...');
    const sequencesResult = await client.query(`
      SELECT sequencename 
      FROM pg_sequences 
      WHERE schemaname = 'public'
      ORDER BY sequencename;
    `);

    if (sequencesResult.rows.length > 0) {
      for (const seq of sequencesResult.rows) {
        try {
          await client.query(`DROP SEQUENCE IF EXISTS "${seq.sequencename}" CASCADE;`);
          console.log(`   ✓ Dropped sequence: ${seq.sequencename}`);
        } catch (error: any) {
          console.log(`   ⚠ Could not drop sequence ${seq.sequencename}: ${error.message}`);
        }
      }
    } else {
      console.log('   ℹ No sequences found');
    }

    console.log('\n' + '═'.repeat(80));
    console.log('✅ Database cleanup completed successfully!');
    console.log('   The database is now empty and ready for fresh schema creation.');
    console.log('═'.repeat(80) + '\n');

  } catch (error: any) {
    console.error('\n❌ Error during cleanup:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  process.exit(0);
}

cleanDatabase();
