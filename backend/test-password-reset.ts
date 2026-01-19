import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testPasswordReset() {
  console.log('🧪 Testing Password Reset Flow...\n');

  try {
    // Test 1: Request password reset for a valid email
    console.log('📧 Test 1: Requesting password reset for admin@nettoyageplus.com...');
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'admin@nettoyageplus.com',
    });

    console.log('✅ Response:', response.data);
    console.log('✅ Status:', response.status);
    console.log('\n📬 Check the backend logs for the Ethereal preview URL!');
    console.log('   You can view the email at that URL.\n');

    // Test 2: Request password reset for non-existent email (should also succeed for security)
    console.log('📧 Test 2: Requesting password reset for non-existent email...');
    const response2 = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'nonexistent@example.com',
    });

    console.log('✅ Response:', response2.data);
    console.log('✅ Status:', response2.status);
    console.log('   (Should return success for security reasons)\n');

    // Test 3: Invalid email format
    console.log('📧 Test 3: Testing invalid email format...');
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: 'invalid-email',
      });
    } catch (error: any) {
      if (error.response) {
        console.log('✅ Correctly rejected invalid email');
        console.log('   Status:', error.response.status);
        console.log('   Error:', error.response.data.message);
      }
    }

    console.log('\n✨ All tests completed!');
    console.log('🔍 Check your backend terminal for the Ethereal email preview URL');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testPasswordReset();
