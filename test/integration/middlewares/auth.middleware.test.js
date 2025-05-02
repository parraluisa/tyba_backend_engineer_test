const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const TokenService = require('../../../src/services/token.service');
const authenticateToken = require('../../../src/middlewares/auth.middleware');

jest.mock('../../../src/services/token.service');

describe('authenticateToken middleware (integration)', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    
    app.get('/ruta-protegida', authenticateToken, (req, res) => {
      res.json({ success: true });
    });
  });

  it('should return 403 if no token is provided', async () => {
    const res = await request(app).get('/ruta-protegida');
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Access denied. No token provided.');
  });

  it('should return 401 if token is not in whitelist', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    TokenService.findToken.mockResolvedValue(null);

    const res = await request(app)
      .get('/ruta-protegida')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid token');
  });

  it('should call next if token is valid and whitelisted', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    TokenService.findToken.mockResolvedValue(true); 

    const res = await request(app)
      .get('/ruta-protegida')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
