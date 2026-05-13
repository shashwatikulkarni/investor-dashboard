const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function seedDB() {
  // 1. Get the URI from .env.local
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');

    const db = client.db('fintech_db');
    const dealsCollection = db.collection('deals');

    // 2. Read the mock data
    console.log('Reading mock deals data...');
    const mockDealsPath = path.join(__dirname, 'src', 'data', 'mockDeals.json');
    const rawData = fs.readFileSync(mockDealsPath, 'utf8');
    const deals = JSON.parse(rawData);

    // 3. Optional: Clear the collection before seeding to avoid duplicates
    console.log('Clearing existing deals in the collection...');
    await dealsCollection.deleteMany({});

    // 4. Insert the mock deals
    console.log(`Inserting ${deals.length} deals...`);
    const result = await dealsCollection.insertMany(deals);
    
    console.log(`✅ Successfully seeded ${result.insertedCount} deals!`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // 5. Close the connection
    await client.close();
    console.log('Connection closed.');
  }
}

seedDB();
