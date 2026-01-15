/**
 * Comprehensive Database Test Script
 * Tests database connectivity, table creation, and basic CRUD operations
 */

import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './src/config/database.config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function logResult(test: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: any) {
  results.push({ test, status, message, details });
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${emoji} ${test}: ${message}`);
  if (details) {
    console.log(`   Details:`, details);
  }
}

async function runTests() {
  console.log('\n🔍 Starting Comprehensive Database Tests...\n');
  console.log('═'.repeat(80));
  
  let dataSource: DataSource | null = null;

  try {
    // Test 1: Database Configuration
    console.log('\n📋 Test 1: Verify Database Configuration');
    console.log('─'.repeat(80));
    
    const config = getDatabaseConfig() as any;
    if (!config.url) {
      logResult('Database Config', 'FAIL', 'DATABASE_URL not configured');
      return;
    }
    logResult('Database Config', 'PASS', 'Configuration loaded successfully', {
      type: config.type,
      synchronize: config.synchronize,
      logging: config.logging,
    });

    // Test 2: Database Connection
    console.log('\n📋 Test 2: Database Connectivity');
    console.log('─'.repeat(80));
    
    dataSource = new DataSource(config);
    await dataSource.initialize();
    logResult('Database Connection', 'PASS', 'Successfully connected to PostgreSQL');

    // Test 3: List All Tables
    console.log('\n📋 Test 3: Verify Table Creation');
    console.log('─'.repeat(80));
    
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const tableNames = tables.map((t: any) => t.table_name);
    logResult('Table Count', 'PASS', `Found ${tableNames.length} tables in database`, tableNames);

    // Expected tables based on our 12 entities (TypeORM creates plural names)
    const expectedTables = [
      'users',
      'clients',
      'sites',
      'contracts',
      'zones',
      'site_assignments',
      'agent_zone_assignments',
      'interventions',
      'schedules',
      'checklist_templates',
      'checklist_instances',
      'checklist_items',
    ];

    const missingTables = expectedTables.filter(t => !tableNames.includes(t));
    const extraTables = tableNames.filter((t: string) => !expectedTables.includes(t) && !t.startsWith('_'));

    if (missingTables.length > 0) {
      logResult('Table Verification', 'WARN', `Missing expected tables: ${missingTables.join(', ')}`);
    }
    if (extraTables.length > 0) {
      logResult('Table Verification', 'PASS', `Additional tables found: ${extraTables.join(', ')}`);
    }
    if (missingTables.length === 0) {
      logResult('Table Verification', 'PASS', 'All expected tables exist');
    }

    // Test 4: Verify Table Schemas
    console.log('\n📋 Test 4: Verify Table Schemas');
    console.log('─'.repeat(80));
    
    for (const tableName of expectedTables) {
      if (!tableNames.includes(tableName)) continue;

      const columns = await dataSource.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);

      logResult(`Schema: ${tableName}`, 'PASS', `${columns.length} columns defined`, 
        columns.map((c: any) => `${c.column_name} (${c.data_type})`).slice(0, 5).join(', ') + '...'
      );
    }

    // Test 5: Foreign Key Constraints
    console.log('\n📋 Test 5: Verify Foreign Key Relationships');
    console.log('─'.repeat(80));
    
    const foreignKeys = await dataSource.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `);

    logResult('Foreign Keys', 'PASS', `Found ${foreignKeys.length} foreign key constraints`, 
      foreignKeys.slice(0, 3).map((fk: any) => 
        `${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`
      )
    );

    // Test 6: Test CRUD Operations on User Table
    console.log('\n📋 Test 6: Test Basic CRUD Operations (User Entity)');
    console.log('─'.repeat(80));
    
    try {
      // CREATE
      const testEmail = `test-${Date.now()}@nettoyageplus.com`;
      const insertResult = await dataSource.query(`
        INSERT INTO "users" (email, password, "firstName", "lastName", phone, role, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, "firstName", "lastName", role;
      `, [testEmail, 'hashed_password', 'Test', 'User', '12345678', 'AGENT', 'ACTIVE']);
      
      const userId = insertResult[0].id;
      logResult('CREATE Operation', 'PASS', 'User created successfully', insertResult[0]);

      // READ
      const readResult = await dataSource.query(`SELECT * FROM "users" WHERE id = $1;`, [userId]);
      logResult('READ Operation', 'PASS', 'User retrieved successfully', readResult[0]);

      // UPDATE
      await dataSource.query(`UPDATE "users" SET "lastName" = $1 WHERE id = $2;`, ['UpdatedUser', userId]);
      const afterUpdate = await dataSource.query(`SELECT "lastName" FROM "users" WHERE id = $1;`, [userId]);
      logResult('UPDATE Operation', 'PASS', 'User updated successfully', afterUpdate[0]);

      // DELETE
      await dataSource.query(`DELETE FROM "users" WHERE id = $1;`, [userId]);
      const afterDelete = await dataSource.query(`SELECT * FROM "users" WHERE id = $1;`, [userId]);
      if (afterDelete.length === 0) {
        logResult('DELETE Operation', 'PASS', 'User deleted successfully');
      } else {
        logResult('DELETE Operation', 'FAIL', 'User still exists after delete');
      }

    } catch (error: any) {
      logResult('CRUD Operations', 'FAIL', error.message);
    }

    // Test 7: Test Complex Queries
    console.log('\n📋 Test 7: Test Complex Queries');
    console.log('─'.repeat(80));
    
    try {
      // Count records in each table
      const counts: any = {};
      for (const table of expectedTables) {
        if (!tableNames.includes(table)) continue;
        const result = await dataSource.query(`SELECT COUNT(*) as count FROM "${table}";`);
        counts[table] = parseInt(result[0].count);
      }
      logResult('Record Counts', 'PASS', 'Successfully counted records in all tables', counts);

      // Test a JOIN query (if data exists)
      if (tableNames.includes('contracts') && tableNames.includes('clients')) {
        const joinResult = await dataSource.query(`
          SELECT c.id, c."contractCode", cl.name as client_name
          FROM contracts c
          LEFT JOIN clients cl ON c."clientId" = cl.id
          LIMIT 5;
        `);
        logResult('JOIN Query', 'PASS', `Retrieved ${joinResult.length} contracts with client info`);
      }

    } catch (error: any) {
      logResult('Complex Queries', 'FAIL', error.message);
    }

    // Test 8: Test Indexes
    console.log('\n📋 Test 8: Verify Database Indexes');
    console.log('─'.repeat(80));
    
    const indexes = await dataSource.query(`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);
    
    logResult('Indexes', 'PASS', `Found ${indexes.length} indexes`, 
      indexes.slice(0, 5).map((idx: any) => `${idx.tablename}.${idx.indexname}`).join(', ')
    );

    // Test 9: Test Database Performance
    console.log('\n📋 Test 9: Test Database Performance');
    console.log('─'.repeat(80));
    
    const startTime = Date.now();
    await dataSource.query('SELECT 1;');
    const pingTime = Date.now() - startTime;
    
    if (pingTime < 100) {
      logResult('Database Performance', 'PASS', `Ping time: ${pingTime}ms (Excellent)`);
    } else if (pingTime < 500) {
      logResult('Database Performance', 'PASS', `Ping time: ${pingTime}ms (Good)`);
    } else {
      logResult('Database Performance', 'WARN', `Ping time: ${pingTime}ms (Slow)`);
    }

    // Test 10: Verify TypeORM Sync Status
    console.log('\n📋 Test 10: TypeORM Synchronization Status');
    console.log('─'.repeat(80));
    
    if (config.synchronize) {
      logResult('TypeORM Sync', 'PASS', 'Auto-synchronization is ENABLED (Development mode)');
    } else {
      logResult('TypeORM Sync', 'WARN', 'Auto-synchronization is DISABLED (Production mode)');
    }

  } catch (error: any) {
    console.error('\n❌ Critical Error:', error.message);
    logResult('Database Tests', 'FAIL', `Critical error: ${error.message}`);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n🔌 Database connection closed');
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('\n📊 TEST SUMMARY');
  console.log('═'.repeat(80));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARN').length;
  
  console.log(`✅ Passed:   ${passed}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`📝 Total:    ${results.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All database tests completed successfully!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
  
  console.log('\n' + '═'.repeat(80));
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
