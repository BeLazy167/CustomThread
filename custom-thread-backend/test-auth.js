// Simple script to test authentication
const fetch = require('node-fetch');

// Replace with your actual token
const token = 'test_development_token';

async function testAuth() {
  try {
    const response = await fetch('http://localhost:3001/api/v1/reports/sales', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
