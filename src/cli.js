import { MongoClient } from 'mongodb';
import { parseCommand, execute } from './notes.js';

async function main() {
  const input = parseCommand(process.argv.slice(2));
  const client = new MongoClient(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
    { serverSelectionTimeoutMS: 5000 }
  );
  try {
    await client.connect();
    const collection = client.db(process.env.MONGODB_DB || 'pocket_notes')
      .collection('notes');
    console.log(await execute(collection, input));
  } finally {
    await client.close();
  }
}

main().catch(error => {
  // Avoid printing a connection string that could contain credentials.
  console.error(error.message.startsWith('Usage:')
    ? error.message : 'MongoDB operation failed. Check your connection and database access.');
  process.exitCode = 1;
});
