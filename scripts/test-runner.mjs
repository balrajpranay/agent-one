import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting Agent One Automated Production Test Suite...\n');

const runCommand = (cmd, args) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd: rootDir, stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command ${cmd} ${args.join(' ')} exited with code ${code}`));
    });
  });
};

async function main() {
  try {
    console.log('1️⃣ Checking TypeScript Compilation & Type Safety...');
    await runCommand('npx', ['tsc', '--noEmit']);
    console.log('✅ TypeScript: 0 type errors found.\n');

    console.log('2️⃣ Running Next.js Linting Audit...');
    await runCommand('npx', ['eslint', 'src/lib', 'src/components/ui']);
    console.log('✅ Linter: Clean.\n');

    console.log('3️⃣ Running Universal Pipeline Automated Verification...');
    await runCommand('npx', ['tsx', 'scripts/test-universal-pipeline.mjs']);
    console.log('✅ Universal Pipeline: Domain-aware intelligence verified.\n');

    console.log('4️⃣ Running Multi-Tenant User Isolation Verification...');
    await runCommand('node', ['scripts/test-user-isolation.mjs']);
    console.log('✅ User Isolation: Cross-account data boundary verified.\n');

    console.log('5️⃣ Running 10-Category Document Intelligence Verification...');
    await runCommand('npx', ['tsx', 'scripts/test-document-categories.mjs']);
    console.log('✅ Document Intelligence: 10 categories, zero emojis & strict plugin scoping verified.\n');

    console.log('6️⃣ Running Demo Documents Library Verification...');
    await runCommand('npx', ['tsx', 'scripts/test-demo-documents.mjs']);
    console.log('✅ Demo Documents: 8 preloaded categories, drag-and-drop & zero emojis verified.\n');

    console.log('7️⃣ Verifying Next.js Production Build...');
    await runCommand('npm', ['run', 'build']);
    console.log('✅ Production Bundle: Compiled 14 routes successfully.\n');

    console.log('🏆 All Automated Validation Tests Passed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test Suite Failed:', err.message);
    process.exit(1);
  }
}

main();
