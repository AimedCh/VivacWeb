// Script para probar la conexión con el backend
const http = require('http');

const API_URL = 'http://localhost:3001';

console.log('🧪 Probando conexión con el API...\n');

// Test 1: Intentar registrar un usuario
console.log('📝 TEST 1: Registrando usuario de prueba...');
const registerData = JSON.stringify({
  userName: 'TestUser',
  email: 'test@example.com',
  password: 'Test@1234'
});

const registerOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

const registerReq = http.request(registerOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`📦 Respuesta:`, data);
    console.log('\n---\n');
    
    // Test 2: Intentar login
    setTimeout(() => {
      console.log('🔐 TEST 2: Intentando login...');
      const loginData = JSON.stringify({
        email: 'test@example.com',
        password: 'Test@1234'
      });

      const loginOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData)
        }
      };

      const loginReq = http.request(loginOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`📦 Respuesta:`, data);
          console.log('\n✅ Pruebas completadas');
        });
      });

      loginReq.on('error', (e) => {
        console.error(`❌ Error en login:`, e.message);
      });

      loginReq.write(loginData);
      loginReq.end();
    }, 1000);
  });
});

registerReq.on('error', (e) => {
  console.error(`❌ Error en registro:`, e.message);
  console.log('\n⚠️ Asegúrate de que:');
  console.log('1. El proxy está corriendo: node proxy.js');
  console.log('2. El backend está disponible');
  console.log('3. Tienes conexión a internet');
});

registerReq.write(registerData);
registerReq.end();

