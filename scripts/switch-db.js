const fs = require('fs');
const provider = process.argv[2];

if (!['sqlite', 'postgresql'].includes(provider)) {
  console.error('Usage: node scripts/switch-db.js <sqlite|postgresql>');
  process.exit(1);
}

const schemaPath = './prisma/schema.prisma';
const content = fs.readFileSync(schemaPath, 'utf8');
const updated = content.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);

if (content === updated) {
  console.log(`Prisma provider is already "${provider}" — no change.`);
} else {
  fs.writeFileSync(schemaPath, updated);
  console.log(`Switched Prisma provider to: ${provider}`);
}
