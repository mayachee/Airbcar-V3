import { seedAllRealTestDataToFirestore } from '../src/services/firebase';

async function main() {
  console.log('Starting seed script...');
  try {
    const result = await seedAllRealTestDataToFirestore(true);
    console.log('Seed completed successfully:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

main();
