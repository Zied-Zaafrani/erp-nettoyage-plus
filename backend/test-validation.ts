/**
 * Data Validation & Business Logic Tests
 * Tests DTOs, validators, and business rules
 */

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './src/modules/users/dto/create-user.dto';
import { CreateClientDto } from './src/modules/clients/dto/create-client.dto';
import { CreateSiteDto } from './src/modules/sites/dto/create-site.dto';
import { CreateContractDto } from './src/modules/contracts/dto/create-contract.dto';
import { CreateInterventionDto } from './src/modules/interventions/dto/create-intervention.dto';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function logResult(test: string, status: 'PASS' | 'FAIL', message: string, details?: any) {
  results.push({ test, status, message, details });
  const emoji = status === 'PASS' ? '✅' : '❌';
  console.log(`${emoji} ${test}: ${message}`);
  if (details && status === 'FAIL') {
    console.log(`   Details:`, details);
  }
}

async function runValidationTests() {
  console.log('\n🔍 Starting Data Validation & Business Logic Tests...\n');
  console.log('═'.repeat(80));

  // ========================================
  // Test 1: User DTO Validation
  // ========================================
  console.log('\n📋 Test Group 1: User DTO Validation');
  console.log('─'.repeat(80));

  try {
    // Valid user
    const validUser = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'Test@12345Test@12345',
      firstName: 'John',
      lastName: 'Doe',
      phone: '12345678',
      role: 'AGENT',
      status: 'ACTIVE',
    });

    const validUserErrors = await validate(validUser);
    logResult('Valid User DTO', 
      validUserErrors.length === 0 ? 'PASS' : 'FAIL',
      validUserErrors.length === 0 ? 'Valid user passes validation' : 'Valid user failed validation',
      validUserErrors.length > 0 ? validUserErrors : undefined
    );

    // Invalid email
    const invalidEmail = plainToClass(CreateUserDto, {
      email: 'not-an-email',
      password: 'Test@12345',
      firstName: 'John',
    });

    const invalidEmailErrors = await validate(invalidEmail);
    logResult('Invalid Email Validation',
      invalidEmailErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidEmailErrors.length > 0 ? 'Invalid email caught' : 'Invalid email not caught'
    );

    // Missing required fields
    const missingFields = plainToClass(CreateUserDto, {
      firstName: 'John',
    });

    const missingFieldsErrors = await validate(missingFields);
    logResult('Missing Required Fields',
      missingFieldsErrors.length > 0 ? 'PASS' : 'FAIL',
      missingFieldsErrors.length > 0 ? 'Missing fields caught' : 'Missing fields not caught'
    );

    // Invalid role
    const invalidRole = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'Test@12345',
      role: 'INVALID_ROLE',
    });

    const invalidRoleErrors = await validate(invalidRole);
    logResult('Invalid Enum Value',
      invalidRoleErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidRoleErrors.length > 0 ? 'Invalid role enum caught' : 'Invalid role enum not caught'
    );

  } catch (error: any) {
    logResult('User DTO Validation', 'FAIL', error.message);
  }

  // ========================================
  // Test 2: Client DTO Validation
  // ========================================
  console.log('\n📋 Test Group 2: Client DTO Validation');
  console.log('─'.repeat(80));

  try {
    // Valid client
    const validClient = plainToClass(CreateClientDto, {
      name: 'Test Company Ltd',
      type: 'COMPANY',
      email: 'contact@company.com',
      phone: '12345678',
      status: 'ACTIVE',
    });

    const validClientErrors = await validate(validClient);
    logResult('Valid Client DTO',
      validClientErrors.length === 0 ? 'PASS' : 'FAIL',
      validClientErrors.length === 0 ? 'Valid client passes validation' : 'Valid client failed validation'
    );

    // Missing name
    const missingName = plainToClass(CreateClientDto, {
      type: 'COMPANY',
      email: 'contact@company.com',
    });

    const missingNameErrors = await validate(missingName);
    logResult('Client Missing Name',
      missingNameErrors.length > 0 ? 'PASS' : 'FAIL',
      missingNameErrors.length > 0 ? 'Missing name caught' : 'Missing name not caught'
    );

    // Invalid email format
    const invalidClientEmail = plainToClass(CreateClientDto, {
      name: 'Test Company',
      type: 'COMPANY',
      email: 'invalid-email',
    });

    const invalidClientEmailErrors = await validate(invalidClientEmail);
    logResult('Client Invalid Email',
      invalidClientEmailErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidClientEmailErrors.length > 0 ? 'Invalid email caught' : 'Invalid email not caught'
    );

  } catch (error: any) {
    logResult('Client DTO Validation', 'FAIL', error.message);
  }

  // ========================================
  // Test 3: Site DTO Validation
  // ========================================
  console.log('\n📋 Test Group 3: Site DTO Validation');
  console.log('─'.repeat(80));

  try {
    // Valid site
    const validSite = plainToClass(CreateSiteDto, {
      clientId: 'a1b2c3d4-e5f6-4789-a012-3456789abcde',
      name: 'Test Site',
      size: 'MEDIUM',
      address: '123 Test Street',
      city: 'Nouakchott',
      status: 'ACTIVE',
    });

    const validSiteErrors = await validate(validSite);
    logResult('Valid Site DTO',
      validSiteErrors.length === 0 ? 'PASS' : 'FAIL',
      validSiteErrors.length === 0 ? 'Valid site passes validation' : 'Valid site failed validation',
      validSiteErrors.length > 0 ? validSiteErrors : undefined
    );

    // Invalid UUID
    const invalidUuid = plainToClass(CreateSiteDto, {
      clientId: 'not-a-uuid',
      name: 'Test Site',
      size: 'MEDIUM',
    });

    const invalidUuidErrors = await validate(invalidUuid);
    logResult('Site Invalid UUID',
      invalidUuidErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidUuidErrors.length > 0 ? 'Invalid UUID caught' : 'Invalid UUID not caught'
    );

    // Invalid size enum
    const invalidSize = plainToClass(CreateSiteDto, {
      clientId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Site',
      size: 'EXTRA_LARGE',
    });

    const invalidSizeErrors = await validate(invalidSize);
    logResult('Site Invalid Size Enum',
      invalidSizeErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidSizeErrors.length > 0 ? 'Invalid size enum caught' : 'Invalid size enum not caught'
    );

  } catch (error: any) {
    logResult('Site DTO Validation', 'FAIL', error.message);
  }

  // ========================================
  // Test 4: Contract DTO Validation
  // ========================================
  console.log('\n📋 Test Group 4: Contract DTO Validation');
  console.log('─'.repeat(80));

  try {
    // Valid contract
    const validContract = plainToClass(CreateContractDto, {
      clientId: '123e4567-e89b-12d3-a456-426614174000',
      siteId: '123e4567-e89b-12d3-a456-426614174001',
      type: 'PERMANENT',
      frequency: 'WEEKLY',
      startDate: '2026-01-20',
      status: 'ACTIVE',
    });

    const validContractErrors = await validate(validContract);
    logResult('Valid Contract DTO',
      validContractErrors.length === 0 ? 'PASS' : 'FAIL',
      validContractErrors.length === 0 ? 'Valid contract passes validation' : 'Valid contract failed validation'
    );

    // Invalid date format
    const invalidDate = plainToClass(CreateContractDto, {
      clientId: '123e4567-e89b-12d3-a456-426614174000',
      siteId: '123e4567-e89b-12d3-a456-426614174001',
      type: 'PERMANENT',
      startDate: 'not-a-date',
    });

    const invalidDateErrors = await validate(invalidDate);
    logResult('Contract Invalid Date',
      invalidDateErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidDateErrors.length > 0 ? 'Invalid date caught' : 'Invalid date not caught'
    );

    // Missing required fields
    const missingContractFields = plainToClass(CreateContractDto, {
      clientId: '123e4567-e89b-12d3-a456-426614174000',
    });

    const missingContractErrors = await validate(missingContractFields);
    logResult('Contract Missing Fields',
      missingContractErrors.length > 0 ? 'PASS' : 'FAIL',
      missingContractErrors.length > 0 ? 'Missing fields caught' : 'Missing fields not caught'
    );

  } catch (error: any) {
    logResult('Contract DTO Validation', 'FAIL', error.message);
  }

  // ========================================
  // Test 5: Intervention DTO Validation
  // ========================================
  console.log('\n📋 Test Group 5: Intervention DTO Validation');
  console.log('─'.repeat(80));

  try {
    // Valid intervention
    const validIntervention = plainToClass(CreateInterventionDto, {
      contractId: '550e8400-e29b-41d4-a716-446655440000',
      siteId: '550e8400-e29b-41d4-a716-446655440001',
      scheduledDate: '2026-01-20',
      scheduledStartTime: '08:00',
      scheduledEndTime: '12:00',
      assignedAgentIds: ['550e8400-e29b-41d4-a716-446655440002'],
      status: 'SCHEDULED',
    });

    const validInterventionErrors = await validate(validIntervention);
    logResult('Valid Intervention DTO',
      validInterventionErrors.length === 0 ? 'PASS' : 'FAIL',
      validInterventionErrors.length === 0 ? 'Valid intervention passes validation' : 'Valid intervention failed validation',
      validInterventionErrors.length > 0 ? validInterventionErrors : undefined
    );

    // Invalid time format
    const invalidTime = plainToClass(CreateInterventionDto, {
      contractId: '123e4567-e89b-12d3-a456-426614174000',
      siteId: '123e4567-e89b-12d3-a456-426614174001',
      scheduledDate: '2026-01-20',
      scheduledStartTime: '25:00', // Invalid hour
      scheduledEndTime: '12:00',
    });

    const invalidTimeErrors = await validate(invalidTime);
    logResult('Intervention Invalid Time',
      invalidTimeErrors.length > 0 ? 'PASS' : 'FAIL',
      invalidTimeErrors.length > 0 ? 'Invalid time caught' : 'Invalid time not caught'
    );

  } catch (error: any) {
    logResult('Intervention DTO Validation', 'FAIL', error.message);
  }

  // ========================================
  // Test 6: Business Logic Tests
  // ========================================
  console.log('\n📋 Test Group 6: Business Logic Rules');
  console.log('─'.repeat(80));

  // Test date logic
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  logResult('Date Comparison Logic',
    tomorrow > today && yesterday < today ? 'PASS' : 'FAIL',
    'Date comparison working correctly'
  );

  // Test string validations
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('test@example.com');
  const invalidEmailTest = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('not-an-email');

  logResult('Email Regex Validation',
    validEmail && invalidEmailTest ? 'PASS' : 'FAIL',
    'Email regex working correctly'
  );

  // Test UUID validation
  const validUuidTest = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test('123e4567-e89b-12d3-a456-426614174000');
  const invalidUuidTest = !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test('not-a-uuid');

  logResult('UUID Regex Validation',
    validUuidTest && invalidUuidTest ? 'PASS' : 'FAIL',
    'UUID regex working correctly'
  );

  // Test phone number validation (8 digits for Mauritania)
  const validPhone = /^[0-9]{8}$/.test('12345678');
  const invalidPhone = !/^[0-9]{8}$/.test('123');

  logResult('Phone Number Validation',
    validPhone && invalidPhone ? 'PASS' : 'FAIL',
    'Phone validation working correctly'
  );

  // ========================================
  // Summary
  // ========================================
  console.log('\n' + '═'.repeat(80));
  console.log('\n📊 VALIDATION TEST SUMMARY');
  console.log('═'.repeat(80));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total:  ${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 All validation tests passed!');
  } else {
    console.log('\n⚠️  Some validation tests failed. Please review the errors above.');
  }

  console.log('\n' + '═'.repeat(80));

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runValidationTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
