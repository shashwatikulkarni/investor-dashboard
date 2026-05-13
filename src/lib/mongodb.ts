import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ Please add your Mongo URI to .env.local or Vercel Environment Variables.');
  // Prevent build crash, but reject if actually used at runtime without URI
  clientPromise = Promise.reject(new Error('Mongo URI not found'));
} else {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;
