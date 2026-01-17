#!/usr/bin/env node

/**
 * Clients & Contracts Module - Verification Script
 * Checks that all components are properly set up
 */

const fs = require('fs');
const path = require('path');

const checks = [
  // Backend DTOs
  {
    name: 'Clients DTO - Create',
    path: 'backend/src/modules/clients/dto/create-client.dto.ts',
    required: true,
  },
  {
    name: 'Clients DTO - Update',
    path: 'backend/src/modules/clients/dto/update-client.dto.ts',
    required: true,
  },
  {
    name: 'Clients DTO - Search',
    path: 'backend/src/modules/clients/dto/search-client.dto.ts',
    required: true,
  },
  {
    name: 'Contracts DTO - Create',
    path: 'backend/src/modules/contracts/dto/create-contract.dto.ts',
    required: true,
  },
  {
    name: 'Contracts DTO - Update',
    path: 'backend/src/modules/contracts/dto/update-contract.dto.ts',
    required: true,
  },
  // Backend Services
  {
    name: 'Clients Service',
    path: 'backend/src/modules/clients/clients.service.ts',
    required: true,
  },
  {
    name: 'Clients Controller',
    path: 'backend/src/modules/clients/clients.controller.ts',
    required: true,
  },
  {
    name: 'Contracts Service',
    path: 'backend/src/modules/contracts/contracts.service.ts',
    required: true,
  },
  {
    name: 'Contracts Controller',
    path: 'backend/src/modules/contracts/contracts.controller.ts',
    required: true,
  },
  // Frontend Pages
  {
    name: 'Clients List Page',
    path: 'frontend/src/pages/clients/ClientsPage.tsx',
    required: true,
  },
  {
    name: 'Clients Detail Page',
    path: 'frontend/src/pages/clients/ClientDetailPage.tsx',
    required: true,
  },
  {
    name: 'Clients Create Page',
    path: 'frontend/src/pages/clients/CreateClientPage.tsx',
    required: true,
  },
  {
    name: 'Clients Update Page (NEW)',
    path: 'frontend/src/pages/clients/UpdateClientPage.tsx',
    required: true,
  },
  {
    name: 'Contracts List Page',
    path: 'frontend/src/pages/contracts/ContractsPage.tsx',
    required: true,
  },
  {
    name: 'Contracts Create Page',
    path: 'frontend/src/pages/contracts/CreateContractPage.tsx',
    required: true,
  },
  {
    name: 'Contracts Detail Page (NEW)',
    path: 'frontend/src/pages/contracts/ContractDetailPage.tsx',
    required: true,
  },
  {
    name: 'Contracts Update Page (NEW)',
    path: 'frontend/src/pages/contracts/UpdateContractPage.tsx',
    required: true,
  },
  // Routing
  {
    name: 'App Router',
    path: 'frontend/src/App.tsx',
    required: true,
  },
];

console.log('🔍 Clients & Contracts Module Verification\n');
console.log('Checking implementation...\n');

let passed = 0;
let failed = 0;

checks.forEach((check) => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    const status = check.required ? '❌' : '⚠️';
    console.log(`${status} ${check.name} - NOT FOUND`);
    if (check.required) {
      failed++;
    }
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All required files are in place!');
  console.log('\n📋 Next steps:');
  console.log('1. Install dependencies: npm install (in both backend and frontend)');
  console.log('2. Run database migrations: npm run typeorm migration:run');
  console.log('3. Start backend: npm run dev (in backend)');
  console.log('4. Start frontend: npm run dev (in frontend)');
  console.log('5. Test module at http://localhost:5173/clients and /contracts');
  process.exit(0);
} else {
  console.log('❌ Some required files are missing!');
  console.log('Please ensure all files are created before proceeding.');
  process.exit(1);
}
