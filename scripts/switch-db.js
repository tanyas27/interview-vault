const fs = require('fs');
const provider = process.argv[2];

if (!['sqlite', 'postgresql'].includes(provider)) {
  console.error('Usage: node scripts/switch-db.js <sqlite|postgresql>');
  process.exit(1);
}

// Patch schema.prisma
const schemaPath = './prisma/schema.prisma';
const schema = fs.readFileSync(schemaPath, 'utf8');
const updatedSchema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);
if (schema !== updatedSchema) {
  fs.writeFileSync(schemaPath, updatedSchema);
  console.log(`Switched schema.prisma provider to: ${provider}`);
} else {
  console.log(`schema.prisma provider is already "${provider}" — no change.`);
}

// Patch migration_lock.toml
const lockPath = './prisma/migrations/migration_lock.toml';
const lock = fs.readFileSync(lockPath, 'utf8');
const updatedLock = lock.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);
if (lock !== updatedLock) {
  fs.writeFileSync(lockPath, updatedLock);
  console.log(`Switched migration_lock.toml provider to: ${provider}`);
} else {
  console.log(`migration_lock.toml provider is already "${provider}" — no change.`);
}
