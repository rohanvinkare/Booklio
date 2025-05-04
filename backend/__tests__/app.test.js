const request = require('supertest');
const app = require('../app.js');

describe('GET /health', () => {
  it('should return Hello Booklio!', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello Booklio!');
  });
});
