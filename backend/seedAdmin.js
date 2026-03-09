import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({ email: 'admin@test.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const newAdmin = new User({
            username: 'admin',
            email: 'admin@test.com',
            password: 'adminpassword123', // Just a placeholder, modify if you want a different password
            role: 'admin'
        });

        await newAdmin.save();
        console.log('✅ Admin user successfully created with email: admin@test.com and password: adminpassword123');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
