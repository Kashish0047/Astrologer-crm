import mongoose from 'mongoose';

export const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI;
  const uri = typeof rawUri === 'string' ? rawUri.trim() : '';

  if (!uri) {
    console.error('Error: MONGODB_URI is not set. Set it in your environment variables.');
    process.exit(1);
  }

  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    const sample = uri.slice(0, 60);
    console.error('Error: Invalid MONGODB_URI scheme. Expected it to start with "mongodb://" or "mongodb+srv://".');
    console.error(`Received (first 60 chars): ${sample}`);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
