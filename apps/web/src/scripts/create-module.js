const fs = require('fs');
const path = require('path');

let rawName = process.argv[2];

if (!rawName) {
  console.error('❌ Error: Please provide a module name. Example: npm run create-module user');
  process.exit(1);
}

const moduleName = rawName.replace(/[\\/]/g, '').trim();

const rootDir = process.cwd();
const modulesDir = fs.existsSync(path.join(rootDir, 'src/features'))
  ? path.join(rootDir, 'src/features')
  : path.join(rootDir, 'web/src/features');

const targetDir = path.join(modulesDir, moduleName);

const filesToCreate = [
  'api.ts',
  'hooks.ts',
  'validator.ts',
  `${moduleName}.d.ts`
];

try {
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Created module directory at: ${path.relative(rootDir, targetDir)}`);
  }

  filesToCreate.forEach((file) => {
    const filePath = path.join(targetDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(`  📄 Created file: ${file}`);
    } else {
      console.log(`  ⚠️  File already exists, skipping: ${file}`);
    }
  });

  console.log(`\n🚀 Module "${moduleName}" scaffolded cleanly!\n`);
} catch (error) {
  console.error('❌ Generation error:', error.message);
  process.exit(1);
}