// tests/user.test.js
const request = require('supertest');
const app = require('../app'); // Adjust if your server is in a different file
const { connectDB, disconnectDB } = require('../config/db-config');
require("dotenv").config();


describe('User API Endpoints (MongoDB Atlas)', () => {
    let token;

    beforeAll(async () => {
        // Ensure DB connection
        await connectDB();

        // Login existing user (must already be present in your MongoDB Atlas)
        const loginRes = await request(app)
            .post('/user/api/v1/login')
            .send({
                email: 'aarav.sharma@example.com',
                password: 'Password123!' // Ensure this matches the actual DB password
            });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body).toHaveProperty('accessToken'); // Changed to accessToken

        token = loginRes.body.accessToken; // Assign accessToken to token
    });

    afterAll(async () => {
        await disconnectDB();
    });

    it('should login an existing user', async () => {
        const res = await request(app).post('/user/api/v1/login').send({
            email: 'aarav.sharma@example.com',
            password: 'Password123!'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken'); // Changed to accessToken
    });

    it('should get user profile', async () => {
        const res = await request(app)
            .get('/user/api/v1/profile')
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('email', 'aarav.sharma@example.com'); // Access email inside data
    });
});
