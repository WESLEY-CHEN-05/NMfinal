import { connect } from 'mongoose';
import dotenv from 'dotenv-defaults';

const connectDB = async () => {
  try {
    dotenv.config();
    if(!process.env.MONGO_URL){
        console.error('Missing MONGO_URL!');
        process.exit(1);
    }
    await connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;