import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';

await connectDB();
const users = await User.find({}, 'username email role');
console.log('Users in DB:', users);
process.exit(0);
