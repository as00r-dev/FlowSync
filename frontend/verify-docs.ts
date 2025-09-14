// Verify documentation structure
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredFiles = [
  'README.md',
  'SETUP.md',
  'Docs/Implementation/Epic1-UserManagement/UserStory1.1-GitHubOAuth/implementation-report.md',
  'Docs/Implementation/Epic1-UserManagement/UserStory1.1-GitHubOAuth/requirements.md',
  'Docs/Implementation/Epic1-UserManagement/UserStory1.1-GitHubOAuth/implementation-plan.md',
  'Docs/Implementation/Epic1-UserManagement/UserStory1.1-GitHubOAuth/ad_hoc.md'
];

const missingFiles = requiredFiles.filter(file => !existsSync(join(__dirname, '..', file)));

if (missingFiles.length > 0) {
  console.log('❌ Missing documentation files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  process.exit(1);
} else {
  console.log('✅ All required documentation files are present');
}