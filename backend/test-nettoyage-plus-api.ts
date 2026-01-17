#!/usr/bin/env node

/**
 * API Endpoints Tester for Nettoyage Plus
 * Tests all Client, Contract, and Intervention endpoints
 * 
 * Usage: npm run test:api
 * or: npx ts-node test-nettoyage-plus-api.ts
 * 
 * Requirements:
 * - Backend running on http://localhost:3000
 * - Admin user should exist (from seed-admin.ts)
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const AUTH_EMAIL = 'admin@nettoyageplus.tn';
const AUTH_PASSWORD = 'admin@123456';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: any;
  statusCode?: number;
}

class APITester {
  private api: AxiosInstance;
  private results: TestResult[] = [];
  private authToken?: string;
  private testData: {
    clientId?: string;
    siteId?: string;
    contractId?: string;
    interventionId?: string;
  } = {};

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // Don't throw on any status
    });
  }

  async authenticate(): Promise<boolean> {
    console.log('\n🔐 Authenticating...');
    try {
      const response = await this.api.post('/auth/login', {
        email: AUTH_EMAIL,
        password: AUTH_PASSWORD,
      });

      if (response.status === 200 && response.data?.access_token) {
        this.authToken = response.data.access_token;
        this.api.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
        console.log('✅ Authentication successful');
        return true;
      } else if (response.status === 401) {
        console.log('⚠️  Invalid credentials. Continuing without authentication.');
        return true; // Continue anyway, some endpoints might be public
      } else {
        console.log(`❌ Authentication failed: ${response.status}`);
        return true; // Continue anyway
      }
    } catch (error) {
      console.log(`⚠️  Could not authenticate: ${error instanceof Error ? error.message : String(error)}`);
      return true; // Continue anyway
    }
  }

  async test(
    name: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    expectedStatus: number | number[] = 200,
  ): Promise<TestResult> {
    try {
      console.log(`\n🧪 ${name}`);
      console.log(`   ${method} ${endpoint}`);

      let response;
      const config = { validateStatus: () => true };

      switch (method) {
        case 'GET':
          response = await this.api.get(endpoint, config);
          break;
        case 'POST':
          response = await this.api.post(endpoint, data, config);
          break;
        case 'PATCH':
          response = await this.api.patch(endpoint, data, config);
          break;
        case 'DELETE':
          response = await this.api.delete(endpoint, config);
          break;
      }

      const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
      const passed = expectedStatuses.includes(response.status);
      
      const result: TestResult = {
        name,
        passed,
        statusCode: response.status,
        data: response.data,
      };

      if (passed) {
        console.log(`   ✅ PASSED (${response.status})`);
      } else {
        console.log(`   ❌ FAILED (Expected ${expectedStatuses.join('|')}, got ${response.status})`);
        if (response.data?.message) {
          console.log(`   Error: ${response.data.message}`);
        }
      }

      this.results.push(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`   ❌ ERROR: ${errorMessage}`);
      const result: TestResult = {
        name,
        passed: false,
        error: errorMessage,
      };
      this.results.push(result);
      return result;
    }
  }

  async runTests(): Promise<void> {
    console.log('\n═══════════════════════════════════════════════');
    console.log('🚀 NETTOYAGE PLUS API TEST SUITE');
    console.log(`📍 Base URL: ${API_BASE_URL}`);
    console.log('═══════════════════════════════════════════════');

    // Authenticate first
    await this.authenticate();

    // ==================== CLIENTS TESTS ====================
    console.log('\n\n📋 ============ CLIENTS ENDPOINTS ============');

    // Create a client
    const createClientResult = await this.test(
      'Create a new client',
      'POST',
      '/clients',
      {
        name: `Test Client ${Date.now()}`,
        type: 'INDIVIDUAL',
        email: `client-${Date.now()}@example.com`,
        phone: '+1234567890',
        address: '123 Main St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Tunisia',
        contactPerson: 'John Doe',
        contactPhone: '+1234567890',
        notes: 'Test client for API testing',
        status: 'ACTIVE',
      },
      [201, 200],
    );

    if (createClientResult.passed && createClientResult.data?.id) {
      this.testData.clientId = createClientResult.data.id;
      console.log(`   💾 Saved clientId: ${this.testData.clientId}`);
    }

    // List all clients
    await this.test('Get all clients (paginated)', 'GET', '/clients?page=1&limit=10', undefined, 200);

    // Get single client
    if (this.testData.clientId) {
      await this.test(
        'Get client by ID',
        'GET',
        `/clients/${this.testData.clientId}`,
        undefined,
        200,
      );
    }

    // Update client
    if (this.testData.clientId) {
      await this.test(
        'Update client',
        'PATCH',
        `/clients/${this.testData.clientId}`,
        {
          name: `Updated Client ${Date.now()}`,
          status: 'ACTIVE',
        },
        200,
      );
    }

    // Search clients
    await this.test(
      'Search clients by name',
      'GET',
      '/clients?search=Test',
      undefined,
      200,
    );

    // ==================== SITES TESTS ====================
    console.log('\n\n📍 ============ SITES ENDPOINTS ============');

    // Create a site (needed for contracts)
    const createSiteResult = await this.test(
      'Create a new site',
      'POST',
      '/sites',
      {
        name: `Test Site ${Date.now()}`,
        address: '456 Oak Ave',
        city: 'Test City',
        postalCode: '54321',
        country: 'Tunisia',
        notes: 'Test site for contracts',
      },
      [201, 200],
    );

    if (createSiteResult.passed && createSiteResult.data?.id) {
      this.testData.siteId = createSiteResult.data.id;
      console.log(`   💾 Saved siteId: ${this.testData.siteId}`);
    }

    // List all sites
    await this.test('Get all sites', 'GET', '/sites?page=1&limit=10', undefined, 200);

    // ==================== CONTRACTS TESTS ====================
    console.log('\n\n📄 ============ CONTRACTS ENDPOINTS ============');

    if (this.testData.clientId && this.testData.siteId) {
      // Create a contract
      const createContractResult = await this.test(
        'Create a new contract',
        'POST',
        '/contracts',
        {
          clientId: this.testData.clientId,
          siteId: this.testData.siteId,
          type: 'PERMANENT',
          frequency: 'WEEKLY',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'DRAFT',
          pricing: {
            basePrice: 500,
            currency: 'TND',
          },
          serviceScope: {
            areas: 'Office space',
            frequency: 'Weekly',
          },
          notes: 'Test contract for API testing',
        },
        [201, 200],
      );

      if (createContractResult.passed && createContractResult.data?.id) {
        this.testData.contractId = createContractResult.data.id;
        console.log(`   💾 Saved contractId: ${this.testData.contractId}`);
      }

      // List all contracts
      await this.test(
        'Get all contracts',
        'GET',
        '/contracts?page=1&limit=10',
        undefined,
        200,
      );

      // Get contract by ID
      if (this.testData.contractId) {
        await this.test(
          'Get contract by ID',
          'GET',
          `/contracts/${this.testData.contractId}`,
          undefined,
          200,
        );
      }

      // Get contracts by client
      await this.test(
        'Get contracts by client',
        'GET',
        `/contracts?clientId=${this.testData.clientId}`,
        undefined,
        200,
      );

      // Update contract
      if (this.testData.contractId) {
        await this.test(
          'Update contract',
          'PATCH',
          `/contracts/${this.testData.contractId}`,
          {
            status: 'ACTIVE',
          },
          200,
        );
      }
    } else {
      console.log('\n⚠️  Skipping contract tests (missing clientId or siteId)');
    }

    // ==================== INTERVENTIONS TESTS ====================
    console.log('\n\n🔧 ============ INTERVENTIONS ENDPOINTS ============');

    if (this.testData.contractId && this.testData.siteId) {
      // Create an intervention
      const createInterventionResult = await this.test(
        'Create a new intervention',
        'POST',
        '/interventions',
        {
          contractId: this.testData.contractId,
          siteId: this.testData.siteId,
          scheduledDate: new Date().toISOString().split('T')[0],
          scheduledStartTime: '08:00:00',
          scheduledEndTime: '17:00:00',
          status: 'SCHEDULED',
          notes: 'Test intervention',
        },
        [201, 200],
      );

      if (createInterventionResult.passed && createInterventionResult.data?.id) {
        this.testData.interventionId = createInterventionResult.data.id;
        console.log(`   💾 Saved interventionId: ${this.testData.interventionId}`);
      }

      // List all interventions
      await this.test(
        'Get all interventions',
        'GET',
        '/interventions?page=1&limit=10',
        undefined,
        200,
      );

      // Get intervention by ID
      if (this.testData.interventionId) {
        await this.test(
          'Get intervention by ID',
          'GET',
          `/interventions/${this.testData.interventionId}`,
          undefined,
          200,
        );
      }
    } else {
      console.log('\n⚠️  Skipping intervention tests (missing contractId or siteId)');
    }

    // ==================== CLEANUP TESTS ====================
    console.log('\n\n🗑️  ============ CLEANUP OPERATIONS ============');

    // Delete intervention
    if (this.testData.interventionId) {
      await this.test(
        'Delete intervention',
        'DELETE',
        `/interventions/${this.testData.interventionId}`,
        undefined,
        [200, 204],
      );
    }

    // Delete contract
    if (this.testData.contractId) {
      await this.test(
        'Delete contract',
        'DELETE',
        `/contracts/${this.testData.contractId}`,
        undefined,
        [200, 204],
      );
    }

    // Delete client
    if (this.testData.clientId) {
      await this.test(
        'Delete client',
        'DELETE',
        `/clients/${this.testData.clientId}`,
        undefined,
        [200, 204],
      );
    }

    // Delete site
    if (this.testData.siteId) {
      await this.test(
        'Delete site',
        'DELETE',
        `/sites/${this.testData.siteId}`,
        undefined,
        [200, 204],
      );
    }

    // ==================== SUMMARY ====================
    this.printSummary();
  }

  private printSummary(): void {
    console.log('\n\n═══════════════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════════════');

    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const total = this.results.length;

    console.log(`\n✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    if (total > 0) {
      console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%`);
    }

    if (failed > 0) {
      console.log('\n📋 Failed Tests:');
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`   - ${r.name}`);
          if (r.error) console.log(`     Error: ${r.error}`);
          if (r.data?.message) console.log(`     Response: ${r.data.message}`);
        });
    }

    console.log('\n✨ Test Summary saved to: test-results.json');
    const fs = require('fs');
    fs.writeFileSync(
      'test-results.json',
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          baseUrl: API_BASE_URL,
          summary: {
            passed,
            failed,
            total,
            successRate: total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : 'N/A',
          },
          results: this.results,
        },
        null,
        2,
      ),
    );

    console.log('\n═══════════════════════════════════════════════\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run tests
const tester = new APITester();
tester.runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
