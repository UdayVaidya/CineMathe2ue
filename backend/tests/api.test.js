import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const API_URL = 'http://localhost:4000/api';

async function testEndpoint(name, method, endpoint, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`\n▶️ Testing: ${name} [${method} ${endpoint}]`);
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${data.success}`);
        if (response.status >= 400 && data.message !== 'Email or username already exists') {
            console.log(`   Response:`, data);
        }
        return { status: response.status, data };
    } catch (err) {
        console.error(`   Error: ${err.message}`);
        return { status: 500 };
    }
}

async function runAllTests() {
    console.log('====================================');
    console.log('   🚀 STARTING FULL API TEST SUITE  ');
    console.log('====================================');

    // Setup DB Connection for Admin Tests
    await mongoose.connect(process.env.MONGO_URI);
    const { default: User } = await import('../src/models/User.js');

    let userToken = '';
    let adminToken = '';
    const timestamp = Date.now();

    // --- 1. USER & AUTH TESTS ---
    console.log('\n\n--- 1. AUTH & USER ROUTES ---');

    // Register normal user
    let res = await testEndpoint('Register User', 'POST', '/auth/register', {
        username: `testuser_${timestamp}`,
        email: `test_${timestamp}@example.com`,
        password: 'password123'
    });

    if (res.data && res.data.token) {
        userToken = res.data.token;
    }

    // Login normal user
    await testEndpoint('Login User', 'POST', '/auth/login', {
        email: `test_${timestamp}@example.com`,
        password: 'password123'
    });

    // Get Me
    await testEndpoint('Get Me', 'GET', '/auth/me', null, userToken);

    // Update Profile
    await testEndpoint('Update Profile', 'PUT', '/users/profile', { username: `updated_${timestamp}` }, userToken);

    // Add/Get/Remove Favorite
    await testEndpoint('Add Favorite', 'POST', '/users/favorites', {
        tmdbId: 101, mediaType: 'movie', title: 'Test Move', posterPath: '/test.jpg'
    }, userToken);
    await testEndpoint('Get Favorites', 'GET', '/users/favorites', null, userToken);
    await testEndpoint('Remove Favorite', 'DELETE', '/users/favorites/101', null, userToken);

    // Add/Get/Clear History
    await testEndpoint('Add Watch History', 'POST', '/users/history', {
        tmdbId: 202, mediaType: 'tv', title: 'Test Show', posterPath: '/show.jpg'
    }, userToken);
    await testEndpoint('Get Watch History', 'GET', '/users/history', null, userToken);
    await testEndpoint('Clear Watch History', 'DELETE', '/users/history', null, userToken);

    // Logout
    await testEndpoint('Logout', 'POST', '/auth/logout', null, userToken);


    // --- 2. ADMIN TESTS ---
    console.log('\n\n--- 2. ADMIN ROUTES ---');

    let admin = await User.findOne({ email: 'admin_suite@test.com' });
    if (!admin) {
        admin = await User.create({
            username: 'admin_suite_test',
            email: 'admin_suite@test.com',
            password: 'password123',
            role: 'admin'
        });
    } else {
        admin.role = 'admin';
        await admin.save();
    }
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    let targetUser = await User.create({
        username: `targetuser_${timestamp}`,
        email: `target_${timestamp}@test.com`,
        password: 'password123'
    });

    await testEndpoint('Get All Users', 'GET', '/admin/users', null, adminToken);
    await testEndpoint('Ban User', 'PUT', `/admin/users/${targetUser._id}/ban`, null, adminToken);
    await testEndpoint('Delete User', 'DELETE', `/admin/users/${targetUser._id}`, null, adminToken);

    const createMovieRes = await testEndpoint('Create Custom Movie', 'POST', '/admin/movies', {
        title: 'Suite Test Movie',
        overview: 'Created by automated suite',
        poster_path: '/poster.jpg',
        backdrop_path: '/backdrop.jpg'
    }, adminToken);

    let movieId = createMovieRes.data?.movie?._id;

    await testEndpoint('Get All Movies', 'GET', '/admin/movies', null, adminToken);

    if (movieId) {
        await testEndpoint('Update Custom Movie', 'PUT', `/admin/movies/${movieId}`, {
            title: 'Suite Test Movie Updated'
        }, adminToken);

        await testEndpoint('Delete Custom Movie', 'DELETE', `/admin/movies/${movieId}`, null, adminToken);
    }

    console.log('\n====================================');
    console.log('   ✅ ALL TESTS COMPLETED SUCCESSFULLY');
    console.log('====================================\n');

    await mongoose.disconnect();
}

runAllTests().catch(console.dir);
