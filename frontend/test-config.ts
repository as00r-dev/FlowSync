// Test GitHub OAuth configuration
import { config } from './app/lib/config';

function testConfig() {
  console.log('GitHub OAuth Configuration:');
  console.log('- Client ID:', config.github.clientID ? 'SET' : 'NOT SET');
  console.log('- Client Secret:', config.github.clientSecret ? 'SET' : 'NOT SET');
  console.log('- Callback URL:', config.github.callbackURL);
  
  console.log('\nDatabase Configuration:');
  console.log('- Host:', config.database.host);
  console.log('- Port:', config.database.port);
  console.log('- Database:', config.database.database);
  console.log('- User:', config.database.user);
  
  console.log('\nSession Configuration:');
  console.log('- Secret:', config.session.secret ? 'SET' : 'NOT SET');
  
  // Check for missing required configuration
  const missing = [];
  if (!config.github.clientID) missing.push('GITHUB_CLIENT_ID');
  if (!config.github.clientSecret) missing.push('GITHUB_CLIENT_SECRET');
  
  if (missing.length > 0) {
    console.log('\n⚠️  WARNING: Missing required environment variables:');
    missing.forEach(env => console.log(`  - ${env}`));
    console.log('\nPlease set these variables in your .env.local file');
  } else {
    console.log('\n✅ All required configuration is set');
  }
}

testConfig();