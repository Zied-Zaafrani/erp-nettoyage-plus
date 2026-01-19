const http = require('http');

const postData = JSON.stringify({
  email: 'admin@nettoyageplus.com'
});

console.log('🧪 Testing password reset endpoint...');
console.log('📧 Email:', 'admin@nettoyageplus.com');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/forgot-password',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const req = http.request(options, (res) => {
  console.log(`\n✅ STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('📬 RESPONSE:', data);
    try {
      const json = JSON.parse(data);
      console.log('✨ Message:', json.message);
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`\n❌ ERROR: ${e.message}`);
  console.error('Full error:', e);
});

req.write(postData);
req.end();

setTimeout(() => {
  console.log('\n⏱️  Request completed');
}, 5000);
